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
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

function cleanJson(content: string) {
  return content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

export async function requestStructuredAi(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    throw new AiServiceError("AI analysis is not configured yet.", 503);
  }

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
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return only valid JSON. Do not include markdown fences or explanatory text.",
          },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new AiServiceError("The AI service did not respond. Please try again.", 504);
  }

  const payload = (await response.json().catch(() => null)) as OpenRouterResponse | null;

  if (!response.ok) {
    throw new AiServiceError(payload?.error?.message ?? "The AI service could not complete the request.", 502);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new AiServiceError("The AI service returned an empty response.", 502);
  }

  try {
    return JSON.parse(cleanJson(content)) as unknown;
  } catch {
    throw new AiServiceError("The AI service returned an invalid response. Please try again.", 502);
  }
}
