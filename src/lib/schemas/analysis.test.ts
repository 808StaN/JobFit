import { describe, expect, it } from "vitest";
import { analysisSchema } from "@/lib/schemas/analysis";
import { sampleAnalysis } from "@/test/fixtures/analysis";

describe("analysisSchema", () => {
  it("accepts a complete analysis object", () => {
    expect(analysisSchema.parse(sampleAnalysis).overallScore).toBe(78);
  });

  it("rejects a malformed AI payload", () => {
    const result = analysisSchema.safeParse({ overallScore: "high" });
    expect(result.success).toBe(false);
  });
});
