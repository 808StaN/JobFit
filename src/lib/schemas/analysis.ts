import { z } from "zod";

const scoreSchema = z.number().int().min(0).max(100);

export const analysisSchema = z.object({
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
});

export const improveBulletSchema = z.object({
  improvedBullet: z.string().min(20).max(500),
  rationale: z.string().min(1).max(240),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type ImproveBullet = z.infer<typeof improveBulletSchema>;
