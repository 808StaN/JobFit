import type { StructuredOutputFormat } from "@/lib/ai/output-formats";

export class AiServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number = 502,
    public readonly code: "configuration" | "provider" | "timeout" | "invalid_output" = "provider",
  ) {
    super(message);
    this.name = "AiServiceError";
  }
}

type ContentPart =
  | string
  | {
      type?: string;
      text?: string;
      content?: string;
    };

interface OpenRouterChoice {
  finish_reason?: string;
  native_finish_reason?: string;
  text?: string;
  message?: {
    content?: string | ContentPart | ContentPart[] | null;
    reasoning?: string | ContentPart[] | null;
    reasoning_details?: ContentPart[] | null;
    parsed?: unknown;
  };
  error?: {
    code?: number;
    message?: string;
  };
}

interface OpenRouterResponse {
  id?: string;
  model?: string;
  choices?: OpenRouterChoice[];
  error?: { message?: string };
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    completion_tokens_details?: { reasoning_tokens?: number };
  };
}

const MODEL_TIMEOUT_MS = 16_000;
const REQUEST_BUDGET_MS = 45_000;
const PREFERRED_PART_TYPES = new Set(["output_text", "text", "json", "output_json"]);
export const DEFAULT_FREE_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "nex-agi/nex-n2.5-mini:free",
  "google/gemma-4-31b-it:free",
] as const;

export function getConfiguredModels() {
  const configured = process.env.OPENROUTER_MODELS?.trim() || process.env.OPENROUTER_MODEL?.trim();
  const candidates = !configured || configured === "openrouter/free"
    ? [...DEFAULT_FREE_MODELS]
    : configured.split(",").map((model) => model.trim()).filter(Boolean);
  const models = [...new Set(candidates)];

  if (models.length === 0 || models.some((model) => !model.endsWith(":free"))) {
    throw new AiServiceError(
      "AI model configuration must contain only free OpenRouter models.",
      503,
      "configuration",
    );
  }

  return models;
}

export function extractJsonText(content: string) {
  const unfenced = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = unfenced.indexOf("{");
  if (start === -1) {
    return unfenced;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < unfenced.length; index += 1) {
    const char = unfenced[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return unfenced.slice(start, index + 1);
      }
    }
  }

  const end = unfenced.lastIndexOf("}");
  if (end <= start) {
    return unfenced;
  }
  return unfenced.slice(start, end + 1);
}

function partText(part: ContentPart) {
  if (typeof part === "string") {
    return part;
  }
  if (typeof part.text === "string") {
    return part.text;
  }
  if (typeof part.content === "string") {
    return part.content;
  }
  return "";
}

function isReasoningPart(part: ContentPart) {
  return typeof part !== "string" && (part.type === "reasoning" || part.type === "reasoning_text");
}

function partsToText(parts: ContentPart[]) {
  const preferred = parts.filter(
    (part) => typeof part !== "string" && part.type && PREFERRED_PART_TYPES.has(part.type),
  );
  if (preferred.length > 0) {
    return preferred.map(partText).join("");
  }

  return parts
    .filter((part) => !isReasoningPart(part))
    .map(partText)
    .join("");
}

function asText(value: string | ContentPart | ContentPart[] | null | undefined) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return partsToText(value);
  }
  return partText(value);
}

function asRawText(value: string | ContentPart | ContentPart[] | null | undefined) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(partText).join("");
  }
  return partText(value);
}

export function extractOpenRouterText(payload: OpenRouterResponse | null) {
  const choice = payload?.choices?.[0];
  const message = choice?.message;

  if (message && "parsed" in message && message.parsed && typeof message.parsed === "object") {
    return JSON.stringify(message.parsed);
  }

  const content = asText(message?.content) || asRawText(choice?.text);
  if (content.trim()) {
    return content.trim();
  }

  return `${asRawText(message?.reasoning)}${asRawText(message?.reasoning_details)}`.trim();
}

function parseStructuredContent(content: string) {
  try {
    return { ok: true as const, value: JSON.parse(extractJsonText(content)) as unknown };
  } catch {
    return { ok: false as const };
  }
}

function logResponseMetadata(payload: OpenRouterResponse | null, finishReason?: string) {
  const completionTokens = payload?.usage?.completion_tokens ?? 0;
  const reasoningTokens = payload?.usage?.completion_tokens_details?.reasoning_tokens ?? 0;
  console.info("[openrouter] Completion response", {
    requestId: payload?.id,
    model: payload?.model,
    finishReason,
    promptTokens: payload?.usage?.prompt_tokens,
    completionTokens,
    reasoningTokens,
    visibleTokens: Math.max(0, completionTokens - reasoningTokens),
  });
}

async function completeOnce(
  apiKey: string,
  model: string,
  prompt: string,
  outputFormat: StructuredOutputFormat,
  timeoutMs: number,
) {
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
        provider: {
          allow_fallbacks: true,
          require_parameters: true,
        },
        response_format: responseFormat,
        messages: [
          {
            role: "system",
            content: "Return only valid JSON. Do not include markdown fences or explanatory text.",
          },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    throw new AiServiceError("The AI service did not respond. Please try again.", 504, "timeout");
  }

  let responseText: string;
  try {
    responseText = await response.text();
  } catch {
    throw new AiServiceError("The AI service did not respond. Please try again.", 504, "timeout");
  }
  let payload: OpenRouterResponse | null = null;
  try {
    payload = JSON.parse(responseText) as OpenRouterResponse;
  } catch {
    console.warn("[openrouter] Provider returned a non-JSON response", {
      model,
      status: response.status,
      contentType: response.headers.get("content-type"),
      bodyLength: responseText.length,
    });
  }

  if (!response.ok) {
    console.warn("[openrouter] Provider rejected a free model request", {
      model,
      status: response.status,
      providerMessage: payload?.error?.message,
    });
    if (response.status === 429) {
      throw new AiServiceError("The AI service is busy right now. Please try again in a moment.", 503, "provider");
    }
    throw new AiServiceError(
      "The free AI model could not handle this request. Trying another model may help.",
      503,
      "provider",
    );
  }

  const choice = payload?.choices?.[0];
  const finishReason = choice?.native_finish_reason ?? choice?.finish_reason;
  logResponseMetadata(payload, finishReason);

  if (choice?.error || finishReason === "error") {
    console.warn("[openrouter] Free model request failed", {
      requestId: payload?.id,
      model: payload?.model,
      finishReason,
      providerCode: choice?.error?.code,
    });
    throw new AiServiceError(
      "The free AI models are unavailable right now. Please try again shortly.",
      503,
      "provider",
    );
  }

  if (finishReason === "content_filter") {
    throw new AiServiceError("The AI service could not process this content.", 422, "provider");
  }

  if (finishReason === "length" || finishReason === "max_tokens") {
    throw new AiServiceError("The AI service returned an incomplete response.", 502, "invalid_output");
  }

  return extractOpenRouterText(payload);
}

export function isRetryableAiOutputError(error: unknown): error is AiServiceError {
  return error instanceof AiServiceError && error.code === "invalid_output";
}

export async function requestStructuredAi(prompt: string, outputFormat: StructuredOutputFormat) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new AiServiceError("AI analysis is not configured yet.", 503, "configuration");
  }

  const models = getConfiguredModels();
  let lastError: AiServiceError | null = null;
  const deadline = Date.now() + REQUEST_BUDGET_MS;

  for (const [index, model] of models.entries()) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      break;
    }

    try {
      const content = await completeOnce(
        apiKey,
        model,
        prompt,
        outputFormat,
        Math.min(MODEL_TIMEOUT_MS, remainingMs),
      );
      if (!content) {
        throw new AiServiceError("The AI service returned an empty response.", 502, "invalid_output");
      }

      const parsed = parseStructuredContent(content);
      if (!parsed.ok) {
        throw new AiServiceError(
          "The AI service returned an invalid response. Please try again.",
          502,
          "invalid_output",
        );
      }

      return parsed.value;
    } catch (error) {
      if (!(error instanceof AiServiceError) || error.code === "configuration" || error.status === 422) {
        throw error;
      }

      lastError = error;
      console.warn("[openrouter] Trying the next free model", {
        model,
        attempt: index + 1,
        totalModels: models.length,
        reason: error.code,
      });
    }
  }

  if (lastError?.code === "invalid_output") {
    throw lastError;
  }

  throw new AiServiceError(
    "The OpenRouter free-model quota is exhausted or its providers are busy. Please try again later.",
    503,
    lastError?.code === "timeout" ? "timeout" : "provider",
  );
}
