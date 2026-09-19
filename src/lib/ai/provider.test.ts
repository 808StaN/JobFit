import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analysisOutputFormat } from "@/lib/ai/output-formats";
import { requestStructuredAi } from "@/lib/ai/provider";
import { AiServiceError } from "@/lib/ai/openrouter";
import { requestGroqAi } from "@/lib/ai/groq";
import { requestStructuredAi as requestOpenRouterAi } from "@/lib/ai/openrouter";

vi.mock("@/lib/ai/groq", () => ({ requestGroqAi: vi.fn() }));
vi.mock("@/lib/ai/openrouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai/openrouter")>();
  return { ...actual, requestStructuredAi: vi.fn() };
});

const requestGroqAiMock = vi.mocked(requestGroqAi);
const requestOpenRouterAiMock = vi.mocked(requestOpenRouterAi);

describe("AI provider orchestration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    process.env.GROQ_API_KEY = "groq-test";
    process.env.OPENROUTER_API_KEY = "openrouter-test";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
  });

  it("uses Groq without calling OpenRouter when Groq succeeds", async () => {
    requestGroqAiMock.mockResolvedValue({ ok: true });

    await expect(requestStructuredAi("prompt", analysisOutputFormat)).resolves.toEqual({ ok: true });
    expect(requestGroqAiMock).toHaveBeenCalledOnce();
    expect(requestOpenRouterAiMock).not.toHaveBeenCalled();
  });

  it("falls back to OpenRouter when Groq is rate limited", async () => {
    requestGroqAiMock.mockRejectedValue(
      new AiServiceError("Groq limit", 503, "provider"),
    );
    requestOpenRouterAiMock.mockResolvedValue({ fallback: true });

    await expect(requestStructuredAi("prompt", analysisOutputFormat)).resolves.toEqual({ fallback: true });
    expect(requestOpenRouterAiMock).toHaveBeenCalledOnce();
  });

  it("uses OpenRouter directly when no Groq key is configured", async () => {
    delete process.env.GROQ_API_KEY;
    requestOpenRouterAiMock.mockResolvedValue({ fallback: true });

    await expect(requestStructuredAi("prompt", analysisOutputFormat)).resolves.toEqual({ fallback: true });
    expect(requestGroqAiMock).not.toHaveBeenCalled();
  });

  it("returns one safe error when both providers are unavailable", async () => {
    requestGroqAiMock.mockRejectedValue(new AiServiceError("Groq limit", 503, "provider"));
    requestOpenRouterAiMock.mockRejectedValue(new AiServiceError("OpenRouter limit", 503, "provider"));

    await expect(requestStructuredAi("prompt", analysisOutputFormat)).rejects.toMatchObject({
      message: "All configured free AI providers are busy or unavailable. Please try again later.",
      status: 503,
    });
  });

  it("does not send filtered content to the fallback provider", async () => {
    requestGroqAiMock.mockRejectedValue(new AiServiceError("Filtered", 422, "provider"));

    await expect(requestStructuredAi("prompt", analysisOutputFormat)).rejects.toMatchObject({ status: 422 });
    expect(requestOpenRouterAiMock).not.toHaveBeenCalled();
  });
});
