import { afterEach, describe, expect, it, vi } from "vitest";
import { AiServiceError, requestStructuredAi } from "@/lib/ai/openrouter";

describe("requestStructuredAi", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_MODEL;
  });

  it("fails safely when the service is not configured", async () => {
    await expect(requestStructuredAi("prompt")).rejects.toMatchObject({
      name: "AiServiceError",
      status: 503,
    } satisfies Partial<AiServiceError>);
  });

  it("parses a JSON object from the model", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test-model";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '{"improvedBullet":"Rewritten.","rationale":"Clearer."}' } }],
        }),
      }),
    );

    await expect(requestStructuredAi("prompt")).resolves.toEqual({
      improvedBullet: "Rewritten.",
      rationale: "Clearer.",
    });
  });

  it("throws when the model returns invalid JSON", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test-model";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ choices: [{ message: { content: "not-json" } }] }),
      }),
    );

    await expect(requestStructuredAi("prompt")).rejects.toBeInstanceOf(AiServiceError);
  });
});
