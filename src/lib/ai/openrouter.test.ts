import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analysisOutputFormat, improveBulletOutputFormat } from "@/lib/ai/output-formats";
import {
  AiServiceError,
  DEFAULT_FREE_MODELS,
  extractJsonText,
  extractOpenRouterText,
  isRetryableAiOutputError,
  requestStructuredAi,
} from "@/lib/ai/openrouter";

function jsonResponse(payload: unknown) {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "application/json" }),
    text: async () => JSON.stringify(payload),
  };
}

function errorResponse(payload: unknown, status = 404) {
  return {
    ok: false,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    text: async () => JSON.stringify(payload),
  };
}

describe("requestStructuredAi", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_MODEL;
    delete process.env.OPENROUTER_MODELS;
  });

  it("fails safely when the service is not configured", async () => {
    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).rejects.toMatchObject({
      name: "AiServiceError",
      status: 503,
    } satisfies Partial<AiServiceError>);
  });

  it("parses a JSON object from the model", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test/model:free";
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        choices: [{ message: { content: '{"improvedBullet":"Rewritten.","rationale":"Clearer."}' } }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).resolves.toEqual({
      improvedBullet: "Rewritten.",
      rationale: "Clearer.",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("ignores reasoning braces when content already contains JSON", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "openrouter/free";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          choices: [
            {
              message: {
                content: '{"improvedBullet":"Rewritten.","rationale":"Clearer."}',
                reasoning: "I weighed {overallScore} against {skills}.",
              },
            },
          ],
        }),
      ),
    );

    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).resolves.toEqual({
      improvedBullet: "Rewritten.",
      rationale: "Clearer.",
    });
  });

  it("returns one retryable error for invalid JSON", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test/model:free";
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ choices: [{ message: { content: "not-json" } }] }));
    vi.stubGlobal("fetch", fetchMock);

    const result = requestStructuredAi("prompt", improveBulletOutputFormat);
    await expect(result).rejects.toMatchObject({
      message: "The AI service returned an invalid response. Please try again.",
      code: "invalid_output",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("extracts a JSON object wrapped in extra text", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test/model:free";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          choices: [
            {
              message: {
                content:
                  'Here you go:\n```json\n{"improvedBullet":"Rewritten clearly.","rationale":"Kept the original stack."}\n```',
              },
            },
          ],
        }),
      ),
    );

    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).resolves.toEqual({
      improvedBullet: "Rewritten clearly.",
      rationale: "Kept the original stack.",
    });
  });

  it("sends the full prompt with the minimal JSON request parameters", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "openrouter/free";
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ choices: [{ message: { content: '{"ok":true}' } }] }));
    vi.stubGlobal("fetch", fetchMock);

    const prompt = "x".repeat(7000);
    await expect(requestStructuredAi(prompt, improveBulletOutputFormat)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body as string) as {
      model: string;
      messages: Array<{ content: string }>;
      provider: { allow_fallbacks: boolean; require_parameters: boolean };
      response_format: { type: string };
      reasoning?: unknown;
      temperature?: unknown;
      max_tokens?: unknown;
    };
    expect(requestBody.messages[1]?.content).toBe(prompt);
    expect(requestBody.model).toBe(DEFAULT_FREE_MODELS[0]);
    expect(requestBody.provider).toEqual({ allow_fallbacks: true, require_parameters: true });
    expect(requestBody.response_format).toEqual({ type: "json_object" });
    expect(requestBody).not.toHaveProperty("reasoning");
    expect(requestBody).not.toHaveProperty("temperature");
    expect(requestBody).not.toHaveProperty("max_tokens");
  });

  it("throws a retryable error when the response is empty", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "openrouter/free";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ choices: [{ message: { content: "   " } }] })),
    );

    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).rejects.toMatchObject({
      message: "The AI service returned an empty response.",
      code: "invalid_output",
    });
  });

  it("rejects responses truncated by the provider", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "openrouter/free";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          choices: [{ finish_reason: "length", message: { content: '{"partial":true}' } }],
        }),
      ),
    );

    const error = await requestStructuredAi("prompt", improveBulletOutputFormat).catch(
      (reason: unknown) => reason,
    );
    expect(isRetryableAiOutputError(error)).toBe(true);
  });

  it("uses a configured ordered list of free models", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODELS = "vendor/primary:free, vendor/fallback:free";
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: '{"ok":true}' } }] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await requestStructuredAi("prompt", improveBulletOutputFormat);

    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body as string) as { model: string };
    expect(requestBody.model).toBe("vendor/primary:free");
  });

  it("moves to the next free model after an empty response", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODELS = "vendor/primary:free,vendor/fallback:free";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ choices: [{ message: { content: "" } }] }))
      .mockResolvedValueOnce(jsonResponse({ choices: [{ message: { content: '{"ok":true}' } }] }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body as string) as { model: string };
    const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body as string) as { model: string };
    expect(firstBody.model).toBe("vendor/primary:free");
    expect(secondBody.model).toBe("vendor/fallback:free");
  });

  it("moves to the next model when an endpoint cannot handle the parameters", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODELS = "vendor/incompatible:free,vendor/compatible:free";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        errorResponse({ error: { message: "No endpoints found that can handle the requested parameters." } }),
      )
      .mockResolvedValueOnce(jsonResponse({ choices: [{ message: { content: '{"ok":true}' } }] }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestStructuredAi("prompt", analysisOutputFormat)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("uses lightweight JSON mode for the large analysis contract", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODELS = "vendor/model:free";
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: '{"ok":true}' } }] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await requestStructuredAi("prompt", analysisOutputFormat);

    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body as string) as {
      response_format: unknown;
    };
    expect(requestBody.response_format).toEqual({ type: "json_object" });
  });

  it("rejects a paid model before sending a request", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODELS = "openai/paid-model";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).rejects.toMatchObject({
      code: "configuration",
      status: 503,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces a provider error returned inside an HTTP 200 response", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          id: "gen-test",
          model: "vendor/model:free",
          choices: [
            {
              finish_reason: "error",
              message: { content: null },
              error: { code: 429, message: "Provider rate limited" },
            },
          ],
        }),
      ),
    );

    await expect(requestStructuredAi("prompt", improveBulletOutputFormat)).rejects.toMatchObject({
      message: "The OpenRouter free-model quota is exhausted or its providers are busy. Please try again later.",
      code: "provider",
      status: 503,
    });
  });
});

describe("extractJsonText", () => {
  it("keeps the first JSON object and drops surrounding prose", () => {
    expect(extractJsonText('Note: {"ok":true} thanks')).toBe('{"ok":true}');
  });

  it("does not swallow later braces from reasoning text", () => {
    expect(extractJsonText('{"ok":true} thought about {score} later.')).toBe('{"ok":true}');
  });
});

describe("extractOpenRouterText", () => {
  it("reads output_text parts", () => {
    expect(
      extractOpenRouterText({
        choices: [{ message: { content: [{ type: "output_text", text: '{"ok":true}' }] } }],
      }),
    ).toBe('{"ok":true}');
  });

  it("prefers content JSON over reasoning that contains braces", () => {
    expect(
      extractOpenRouterText({
        choices: [
          {
            message: {
              content: '{"ok":true}',
              reasoning: "I considered {overallScore} and other fields.",
              reasoning_details: [{ type: "reasoning", text: "more {notes}" }],
            },
          },
        ],
      }),
    ).toBe('{"ok":true}');
  });

  it("falls back to reasoning details", () => {
    expect(
      extractOpenRouterText({
        choices: [
          {
            message: {
              content: "",
              reasoning_details: [{ type: "reasoning", text: '{"ok":true}' }],
            },
          },
        ],
      }),
    ).toBe('{"ok":true}');
  });
});
