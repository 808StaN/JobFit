import type { StructuredOutputFormat } from "@/lib/ai/output-formats";
import { requestGroqAi } from "@/lib/ai/groq";
import {
  AiServiceError,
  isRetryableAiOutputError,
  requestStructuredAi as requestOpenRouterAi,
} from "@/lib/ai/openrouter";

export { AiServiceError, isRetryableAiOutputError };

export async function requestStructuredAi(prompt: string, outputFormat: StructuredOutputFormat) {
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);

  if (!hasGroq && !hasOpenRouter) {
    throw new AiServiceError("AI analysis is not configured yet.", 503, "configuration");
  }

  let groqError: AiServiceError | null = null;
  if (hasGroq) {
    try {
      return await requestGroqAi(prompt, outputFormat);
    } catch (error) {
      if (!(error instanceof AiServiceError) || error.status === 422) {
        throw error;
      }
      groqError = error;
      console.warn("[ai] Falling back from Groq to OpenRouter", {
        reason: error.code,
        status: error.status,
      });
    }
  }

  if (hasOpenRouter) {
    try {
      return await requestOpenRouterAi(prompt, outputFormat);
    } catch (error) {
      if (!(error instanceof AiServiceError) || error.status === 422) {
        throw error;
      }

      if (error.code === "invalid_output") {
        throw error;
      }

      throw new AiServiceError(
        "All configured free AI providers are busy or unavailable. Please try again later.",
        503,
        error.code === "timeout" && groqError?.code === "timeout" ? "timeout" : "provider",
      );
    }
  }

  throw groqError ?? new AiServiceError("AI analysis is not configured yet.", 503, "configuration");
}
