import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/analyze/route";
import { AiServiceError, requestStructuredAi } from "@/lib/ai/provider";
import { extractCvText } from "@/lib/pdf";
import { sampleAnalysis } from "@/test/fixtures/analysis";

vi.mock("@/lib/ai/provider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai/provider")>();
  return { ...actual, requestStructuredAi: vi.fn() };
});

vi.mock("@/lib/pdf", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/pdf")>();
  return { ...actual, extractCvText: vi.fn() };
});

const requestStructuredAiMock = vi.mocked(requestStructuredAi);
const extractCvTextMock = vi.mocked(extractCvText);

function analysisRequest(jobDescription = "Wymagana znajomość JavaScript, React i Next.js.") {
  const formData = new FormData();
  formData.set("cv", new File(["%PDF-test"], "cv.pdf", { type: "application/pdf" }));
  formData.set("jobDescription", jobDescription);
  return { formData: async () => formData } as Request;
}

describe("POST /api/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    extractCvTextMock.mockResolvedValue("Built React and Next.js applications with JavaScript.");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("retries an incomplete payload with the full CV and Polish job description", async () => {
    requestStructuredAiMock.mockResolvedValueOnce({}).mockResolvedValueOnce(sampleAnalysis);

    const response = await POST(analysisRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.analysis.overallScore).toBe(70);
    expect(requestStructuredAiMock).toHaveBeenCalledTimes(2);
    expect(requestStructuredAiMock.mock.calls[1]?.[0]).toContain(
      "Built React and Next.js applications with JavaScript.",
    );
    expect(requestStructuredAiMock.mock.calls[1]?.[0]).toContain(
      "Wymagana znajomość JavaScript, React i Next.js.",
    );
  });

  it("returns 502 instead of converting two empty payloads into a zero score", async () => {
    requestStructuredAiMock.mockResolvedValue({});

    const response = await POST(analysisRequest());
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({ error: "We could not validate the AI response. Please try again." });
    expect(requestStructuredAiMock).toHaveBeenCalledTimes(2);
  });

  it("accepts an oversized model response after normalizing it to the UI limits", async () => {
    requestStructuredAiMock.mockResolvedValue({
      ...sampleAnalysis,
      jobRequirements: Array.from({ length: 14 }, (_, index) => ({
        name: `Requirement ${index + 1}`,
        type: "required",
        found: false,
      })),
      actionPlan: Array.from({ length: 7 }, (_, index) => `Action ${index + 1}`),
    });

    const response = await POST(analysisRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.analysis.jobRequirements).toHaveLength(12);
    expect(body.analysis.actionPlan).toHaveLength(5);
    expect(requestStructuredAiMock).toHaveBeenCalledTimes(1);
  });

  it("retries malformed provider output only once", async () => {
    requestStructuredAiMock
      .mockRejectedValueOnce(new AiServiceError("Invalid JSON", 502, "invalid_output"))
      .mockResolvedValueOnce(sampleAnalysis);

    const response = await POST(analysisRequest());

    expect(response.status).toBe(200);
    expect(requestStructuredAiMock).toHaveBeenCalledTimes(2);
  });
});
