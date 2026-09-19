export interface StructuredOutputFormat {
  name: string;
  schema: Record<string, unknown>;
  mode?: "json_schema" | "json_object";
}

const score = { type: "integer", minimum: 0, maximum: 100 } as const;

export const analysisOutputFormat: StructuredOutputFormat = {
  name: "jobfit_analysis",
  mode: "json_object",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      overallScore: score,
      scoreBreakdown: {
        type: "object",
        additionalProperties: false,
        properties: {
          skills: score,
          experience: score,
          education: score,
          keywords: score,
        },
        required: ["skills", "experience", "education", "keywords"],
      },
      matchedSkills: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            evidence: { type: "string" },
          },
          required: ["name", "evidence"],
        },
      },
      gaps: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            status: { type: "string", enum: ["missing", "weak_evidence"] },
            explanation: { type: "string" },
          },
          required: ["name", "status", "explanation"],
        },
      },
      strengths: { type: "array", maxItems: 5, items: { type: "string" } },
      suggestions: {
        type: "array",
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            explanation: { type: "string" },
            priority: { type: "string", enum: ["high", "medium", "low"] },
          },
          required: ["title", "explanation", "priority"],
        },
      },
      jobRequirements: {
        type: "array",
        minItems: 1,
        maxItems: 12,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            type: { type: "string", enum: ["required", "preferred"] },
            found: { type: "boolean" },
          },
          required: ["name", "type", "found"],
        },
      },
      experienceRelevance: {
        type: "array",
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            relevance: { type: "string", enum: ["high", "medium", "low"] },
            explanation: { type: "string" },
          },
          required: ["name", "relevance", "explanation"],
        },
      },
      actionPlan: {
        type: "array",
        minItems: 1,
        maxItems: 5,
        items: { type: "string" },
      },
    },
    required: [
      "overallScore",
      "scoreBreakdown",
      "matchedSkills",
      "gaps",
      "strengths",
      "suggestions",
      "jobRequirements",
      "experienceRelevance",
      "actionPlan",
    ],
  },
};

export const improveBulletOutputFormat: StructuredOutputFormat = {
  name: "jobfit_improved_bullet",
  mode: "json_object",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      improvedBullet: { type: "string" },
      rationale: { type: "string" },
    },
    required: ["improvedBullet", "rationale"],
  },
};
