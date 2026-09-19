import { describe, expect, it } from "vitest";
import { analysisSchema } from "@/lib/schemas/analysis";
import { parseAnalysis } from "@/lib/schemas/normalize";
import { sampleAnalysis } from "@/test/fixtures/analysis";

describe("analysisSchema", () => {
  it("accepts a complete analysis object", () => {
    expect(analysisSchema.parse(sampleAnalysis).overallScore).toBe(79);
  });

  it("rejects a malformed AI payload", () => {
    const result = analysisSchema.safeParse({ overallScore: "high" });
    expect(result.success).toBe(false);
  });

  it("does not coerce null or an empty string to a zero score", () => {
    expect(analysisSchema.safeParse({ ...sampleAnalysis, overallScore: null }).success).toBe(false);
    expect(analysisSchema.safeParse({ ...sampleAnalysis, overallScore: "" }).success).toBe(false);
  });
});

describe("parseAnalysis", () => {
  it("coerces breakdown scores and computes the weighted overall score", () => {
    const result = parseAnalysis({
      ...sampleAnalysis,
      overallScore: "84.4",
      scoreBreakdown: {
        skills: 88.6,
        experience: "72",
        education: 90,
        keywords: 85.2,
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.overallScore).toBe(83);
      expect(result.data.scoreBreakdown.skills).toBe(89);
    }
  });

  it("maps status aliases and trims oversized evidence", () => {
    const result = parseAnalysis({
      ...sampleAnalysis,
      gaps: [
        {
          name: "Playwright",
          status: "weak evidence",
          explanation: "x".repeat(400),
        },
      ],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.gaps[0]?.status).toBe("weak_evidence");
      expect(result.data.gaps[0]?.explanation.length).toBe(240);
    }
  });

  it("rejects an empty action plan instead of inventing a fallback", () => {
    const result = parseAnalysis({
      ...sampleAnalysis,
      actionPlan: [],
    });

    expect(result.success).toBe(false);
  });

  it.each([{}, null, [], "not an analysis"])("rejects an empty or unrelated payload: %j", (payload) => {
    expect(parseAnalysis(payload).success).toBe(false);
  });

  it("accepts a deliberate analysis wrapper", () => {
    expect(parseAnalysis({ analysis: sampleAnalysis }).success).toBe(true);
  });

  it("rejects zero scores when matching evidence exists", () => {
    const result = parseAnalysis({
      ...sampleAnalysis,
      overallScore: 0,
      scoreBreakdown: { skills: 0, experience: 0, education: 0, keywords: 0 },
    });

    expect(result.success).toBe(false);
  });

  it("allows a genuine zero match when requirements and gaps are explained", () => {
    const result = parseAnalysis({
      overallScore: 0,
      scoreBreakdown: { skills: 0, experience: 0, education: 0, keywords: 0 },
      matchedSkills: [],
      gaps: [{ name: "Rust", status: "missing", explanation: "Rust is not present in the CV." }],
      strengths: [],
      suggestions: [{ title: "Show Rust work", explanation: "Add it only if supported.", priority: "high" }],
      jobRequirements: [{ name: "Rust", type: "required", found: false }],
      experienceRelevance: [],
      actionPlan: ["Apply only if you can support the required Rust experience."],
    });

    expect(result.success).toBe(true);
  });
});
