import type { Analysis } from "@/lib/schemas/analysis";

export const sampleAnalysis: Analysis = {
  overallScore: 79,
  scoreBreakdown: {
    skills: 85,
    experience: 70,
    education: 90,
    keywords: 74,
  },
  matchedSkills: [
    {
      name: "React",
      evidence: "Listed in skills and used in the OpenStudio project.",
    },
    {
      name: "TypeScript",
      evidence: "Appears in skills and in recent frontend work.",
    },
  ],
  gaps: [
    {
      name: "Playwright",
      status: "missing",
      explanation: "The posting asks for end-to-end testing, but the CV does not mention Playwright.",
    },
    {
      name: "Accessibility",
      status: "weak_evidence",
      explanation: "WCAG is named once, without a concrete example of an audit or fix.",
    },
  ],
  strengths: [
    "Multiple React projects show practical component work, not only a skills list.",
    "TypeScript is evidenced in both skills and project descriptions.",
  ],
  suggestions: [
    {
      title: "Add testing experience",
      explanation: "If you have unit or end-to-end tests, describe the tools and what they covered.",
      priority: "high",
    },
    {
      title: "Make Next.js easier to find",
      explanation: "Move Next.js higher in the most relevant project instead of leaving it as a passing mention.",
      priority: "medium",
    },
  ],
  jobRequirements: [
    { name: "React", type: "required", found: true },
    { name: "TypeScript", type: "required", found: true },
    { name: "CI/CD", type: "preferred", found: false },
  ],
  experienceRelevance: [
    {
      name: "OpenStudio",
      relevance: "high",
      explanation: "The role is frontend-heavy and this project uses React and TypeScript.",
    },
  ],
  actionPlan: [
    "Describe any testing work you have already done.",
    "Move Next.js into the first relevant project summary.",
    "Replace the generic accessibility mention with one concrete example.",
  ],
};
