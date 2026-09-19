import type { StructuredOutputFormat } from "@/lib/ai/output-formats";
import { AiServiceError, extractJsonText } from "@/lib/ai/openrouter";

interface GroqResponse {
  id?: string;
  model?: string;
  choices?: Array<{
    finish_reason?: string;
    message?: { content?: string | null };
  }>;
  error?: { message?: string; code?: string };
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

const GROQ_TIMEOUT_MS = 30_000;
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export async function requestGroqAi(prompt: string, outputFormat: StructuredOutputFormat) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AiServiceError("Groq is not configured.", 503, "configuration");
  }

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;
  const responseFormat = outputFormat.mode === "json_object"
    ? { type: "json_object" }
    : {
        type: "json_schema",
        json_schema: {
          name: outputFormat.name,
          strict: true,
          schema: outputFormat.schema,
        },
      };
  let response: Response;
  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "Return only valid JSON matching the supplied schema. Do not include markdown or commentary.",
          },
          { role: "user", content: prompt },
        ],
        reasoning_effort: "low",
        max_completion_tokens: 4096,
        response_format: responseFormat,
      }),
      signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
    });
  } catch {
    throw new AiServiceError("Groq did not respond in time.", 504, "timeout");
  }

  let responseText: string;
  try {
    responseText = await response.text();
  } catch {
    throw new AiServiceError("Groq did not respond in time.", 504, "timeout");
  }

  let payload: GroqResponse | null = null;
  try {
    payload = JSON.parse(responseText) as GroqResponse;
  } catch {
    console.warn("[groq] Provider returned a non-JSON response", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      bodyLength: responseText.length,
    });
  }

  if (!response.ok) {
    console.warn("[groq] Request failed", {
      status: response.status,
      code: payload?.error?.code,
      providerMessage: payload?.error?.message,
    });

    if (response.status === 401 || response.status === 403) {
      throw new AiServiceError("Groq authentication failed.", 503, "configuration");
    }
    if (response.status === 429) {
      throw new AiServiceError("The Groq free-tier limit is currently exhausted.", 503, "provider");
    }
    throw new AiServiceError("Groq could not complete the request.", 502, "provider");
  }

  const choice = payload?.choices?.[0];
  const finishReason = choice?.finish_reason;
  console.info("[groq] Completion response", {
    requestId: payload?.id,
    model: payload?.model,
    finishReason,
    promptTokens: payload?.usage?.prompt_tokens,
    completionTokens: payload?.usage?.completion_tokens,
  });

  if (finishReason === "content_filter") {
    throw new AiServiceError("The AI service could not process this content.", 422, "provider");
  }
  if (finishReason === "length") {
    throw new AiServiceError("Groq returned an incomplete response.", 502, "invalid_output");
  }

  const content = choice?.message?.content?.trim();
  if (!content) {
    throw new AiServiceError("Groq returned an empty response.", 502, "invalid_output");
  }

  try {
    return JSON.parse(extractJsonText(content)) as unknown;
  } catch {
    throw new AiServiceError("Groq returned invalid JSON.", 502, "invalid_output");
  }
}
