export class AiServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number = 502,
  ) {
    super(message);
    this.name = "AiServiceError";
  }
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<string | { text?: string }>;
      reasoning?: string;
    };
  }>;
  error?: { message?: string };
}

function cleanJson(content: string) {
  return content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

function extractMessageText(payload: OpenRouterResponse | null) {
  const message = payload?.choices?.[0]?.message;
  const content = message?.content;

  if (typeof content === "string" && content.trim()) {
    return content;
  }

  if (Array.isArray(content)) {
    const joined = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        return part?.text ?? "";
      })
      .join("");
    if (joined.trim()) {
      return joined;
    }
  }

  if (typeof message?.reasoning === "string" && message.reasoning.trim()) {
    return message.reasoning;
  }

  return "";
}

async function completeOnce(apiKey: string, model: string, prompt: string, jsonMode: boolean) {
  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
        "X-Title": "JobFit",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        messages: [
          {
            role: "system",
            content: "Return only valid JSON. Do not include markdown fences or explanatory text.",
          },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new AiServiceError("The AI service did not respond. Please try again.", 504);
  }

  const payload = (await response.json().catch(() => null)) as OpenRouterResponse | null;

  if (!response.ok) {
    const providerMessage = payload?.error?.message ?? "The AI service could not complete the request.";
    const status = response.status === 429 ? 429 : 502;
    throw new AiServiceError(
      status === 429 ? "The AI service is busy right now. Please try again in a moment." : providerMessage,
      status === 429 ? 503 : 502,
    );
  }

  return extractMessageText(payload);
}

export async function requestStructuredAi(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? "openrouter/free";

  if (!apiKey) {
    throw new AiServiceError("AI analysis is not configured yet.", 503);
  }

  let content = await completeOnce(apiKey, model, prompt, true);
  if (!content) {
    content = await completeOnce(apiKey, model, prompt, false);
  }

  if (!content) {
    throw new AiServiceError("The AI service returned an empty response.", 502);
  }

  try {
    return JSON.parse(cleanJson(content)) as unknown;
  } catch {
    throw new AiServiceError("The AI service returned an invalid response. Please try again.", 502);
  }
}
