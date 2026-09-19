import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestGroqAi } from "@/lib/ai/groq";
import { analysisOutputFormat } from "@/lib/ai/output-formats";

function response(payload: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    text: async () => JSON.stringify(payload),
  };
}

describe("requestGroqAi", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.GROQ_API_KEY;
    delete process.env.GROQ_MODEL;
  });

  it("fails safely when Groq is not configured", async () => {
    await expect(requestGroqAi("prompt", analysisOutputFormat)).rejects.toMatchObject({
      code: "configuration",
      status: 503,
    });
  });

  it("uses JSON object mode and parses the response", async () => {
    process.env.GROQ_API_KEY = "test-key";
    process.env.GROQ_MODEL = "openai/gpt-oss-20b";
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        id: "groq-test",
        model: "openai/gpt-oss-20b",
        choices: [{ finish_reason: "stop", message: { content: '{"ok":true}' } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestGroqAi("full prompt", analysisOutputFormat)).resolves.toEqual({ ok: true });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string) as {
      model: string;
      reasoning_effort: string;
      max_completion_tokens: number;
      messages: Array<{ content: string }>;
      response_format: { type: string };
    };
    expect(body.model).toBe("openai/gpt-oss-20b");
    expect(body.reasoning_effort).toBe("low");
    expect(body.max_completion_tokens).toBe(4096);
    expect(body.messages[1]?.content).toBe("full prompt");
    expect(body.response_format).toEqual({ type: "json_object" });
  });

  it("returns a provider error when the free-tier limit is exhausted", async () => {
    process.env.GROQ_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response({ error: { message: "Rate limit exceeded" } }, 429)),
    );

    await expect(requestGroqAi("prompt", analysisOutputFormat)).rejects.toMatchObject({
      code: "provider",
      status: 503,
      message: "The Groq free-tier limit is currently exhausted.",
    });
  });
});
