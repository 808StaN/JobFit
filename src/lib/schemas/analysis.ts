import { z } from "zod";

const scoreSchema = z.preprocess((value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(100, Math.max(0, Math.round(value)));
  }

  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return Math.min(100, Math.max(0, Math.round(numeric)));
    }
  }

  return value;
}, z.number().int().min(0).max(100));

export const analysisSchema = z
  .object({
    overallScore: scoreSchema.describe("Orientation score for CV-to-role evidence, not a hiring prediction."),
    scoreBreakdown: z.object({
      skills: scoreSchema,
      experience: scoreSchema,
      education: scoreSchema,
      keywords: scoreSchema,
    }),
    matchedSkills: z
      .array(
        z.object({
          name: z.string().min(1).max(80),
          evidence: z.string().min(1).max(240),
        }),
      )
      .max(10),
    gaps: z
      .array(
        z.object({
          name: z.string().min(1).max(80),
          status: z.enum(["missing", "weak_evidence"]),
          explanation: z.string().min(1).max(240),
        }),
      )
      .max(10),
    strengths: z.array(z.string().min(1).max(260)).max(5),
    suggestions: z
      .array(
        z.object({
          title: z.string().min(1).max(100),
          explanation: z.string().min(1).max(300),
          priority: z.enum(["high", "medium", "low"]),
        }),
      )
      .max(6),
    jobRequirements: z
      .array(
        z.object({
          name: z.string().min(1).max(120),
          type: z.enum(["required", "preferred"]),
          found: z.boolean(),
        }),
      )
      .min(1)
      .max(12),
    experienceRelevance: z
      .array(
        z.object({
          name: z.string().min(1).max(120),
          relevance: z.enum(["high", "medium", "low"]),
          explanation: z.string().min(1).max(240),
        }),
      )
      .max(5),
    actionPlan: z.array(z.string().min(1).max(240)).min(1).max(5),
  })
  .superRefine((analysis, context) => {
    if (analysis.matchedSkills.length === 0 && analysis.gaps.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["matchedSkills"],
        message: "The analysis must contain at least one matched skill or gap.",
      });
    }

    const hasPositiveEvidence =
      analysis.matchedSkills.length > 0 || analysis.jobRequirements.some((requirement) => requirement.found);
    const allScoresAreZero = Object.values(analysis.scoreBreakdown).every((score) => score === 0);

    if (hasPositiveEvidence && (analysis.overallScore === 0 || allScoresAreZero)) {
      context.addIssue({
        code: "custom",
        path: ["overallScore"],
        message: "Scores cannot all be zero when the CV contains matching evidence.",
      });
    }
  });

export const improveBulletSchema = z.object({
  improvedBullet: z.string().min(20).max(500),
  rationale: z.string().min(1).max(240),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type ImproveBullet = z.infer<typeof improveBulletSchema>;
