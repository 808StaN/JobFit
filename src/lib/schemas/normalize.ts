import { analysisSchema } from "@/lib/schemas/analysis";

function asRecord(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : null;
}

function clip(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function mapGapStatus(value: unknown) {
  const normalized = String(value ?? "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (normalized === "weak_evidence" || normalized === "weak") {
    return "weak_evidence";
  }
  if (normalized === "missing") {
    return "missing";
  }
  return value;
}

function mapPriority(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "high") {
    return "high";
  }
  if (normalized === "medium") {
    return "medium";
  }
  if (normalized === "low") {
    return "low";
  }
  return value;
}

function mapRequirementType(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "preferred") {
    return "preferred";
  }
  if (normalized === "required") {
    return "required";
  }
  return value;
}

function mapRelevance(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "high") {
    return "high";
  }
  if (normalized === "medium") {
    return "medium";
  }
  if (normalized === "low") {
    return "low";
  }
  return value;
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "true" || normalized === "yes" || normalized === "found") {
    return true;
  }
  if (normalized === "false" || normalized === "no" || normalized === "missing") {
    return false;
  }
  return value;
}

export function normalizeAnalysis(raw: unknown) {
  const root = asRecord(raw);
  if (!root) {
    return raw;
  }

  const wrapped = asRecord(root.analysis);
  const input = wrapped && Object.keys(root).length === 1 ? wrapped : root;
  const matchedSkills = asArray(input.matchedSkills)?.map((item) => {
    const record = asRecord(item);
    if (!record) {
      return item;
    }
    return {
      ...record,
      name: clip(record.name ?? record.skill ?? record.title, 80),
      evidence: clip(record.evidence ?? record.reason ?? record.detail, 240),
    };
  });

  const gaps = asArray(input.gaps ?? input.missingSkills)?.map((item) => {
    const record = asRecord(item);
    if (!record) {
      return item;
    }
    return {
      ...record,
      name: clip(record.name ?? record.skill ?? record.title, 80),
      status: mapGapStatus(record.status ?? record.level),
      explanation: clip(record.explanation ?? record.reason ?? record.detail, 240),
    };
  });

  const strengths = asArray(input.strengths)?.map((item) =>
    typeof item === "string" ? clip(item, 260) : item,
  );

  const suggestions = asArray(input.suggestions)?.map((item) => {
    const record = asRecord(item);
    if (!record) {
      return item;
    }
    return {
      ...record,
      title: clip(record.title ?? record.name, 100),
      explanation: clip(record.explanation ?? record.detail ?? record.reason, 300),
      priority: mapPriority(record.priority),
    };
  });

  const jobRequirements = asArray(input.jobRequirements)?.map((item) => {
    const record = asRecord(item);
    if (!record) {
      return item;
    }
    return {
      ...record,
      name: clip(record.name ?? record.title, 120),
      type: mapRequirementType(record.type ?? record.level),
      found: toBoolean(record.found),
    };
  });

  const experienceRelevance = asArray(input.experienceRelevance)?.map((item) => {
    const record = asRecord(item);
    if (!record) {
      return item;
    }
    return {
      ...record,
      name: clip(record.name ?? record.title, 120),
      relevance: mapRelevance(record.relevance),
      explanation: clip(record.explanation ?? record.reason ?? record.detail, 240),
    };
  });

  const actionPlan = asArray(input.actionPlan)?.map((item) =>
    typeof item === "string" ? clip(item, 240) : item,
  );

  return {
    ...input,
    matchedSkills: matchedSkills ?? input.matchedSkills,
    gaps: gaps ?? input.gaps,
    strengths: strengths ?? input.strengths,
    suggestions: suggestions ?? input.suggestions,
    jobRequirements: jobRequirements ?? input.jobRequirements,
    experienceRelevance: experienceRelevance ?? input.experienceRelevance,
    actionPlan: actionPlan ?? input.actionPlan,
  };
}

export function parseAnalysis(raw: unknown) {
  const result = analysisSchema.safeParse(normalizeAnalysis(raw));
  if (!result.success) {
    return result;
  }

  const { skills, experience, education, keywords } = result.data.scoreBreakdown;
  const overallScore = Math.round(skills * 0.4 + experience * 0.3 + education * 0.1 + keywords * 0.2);

  return {
    success: true as const,
    data: { ...result.data, overallScore },
  };
}

export function formatAnalysisIssues(result: ReturnType<typeof parseAnalysis>) {
  if (result.success) {
    return "";
  }

  return result.error.issues.map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`).join("; ");
}
