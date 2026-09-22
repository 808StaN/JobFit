import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleDashed,
  IconListCheck,
  IconTargetArrow,
} from "@tabler/icons-react";
import type { Analysis } from "@/lib/schemas/analysis";

const priorityLabel = {
  high: "High priority",
  medium: "Medium priority",
  low: "Lower priority",
} as const;

function requirementCoverage(analysis: Analysis, type: "required" | "preferred") {
  const requirements = analysis.jobRequirements.filter((requirement) => requirement.type === type);
  const found = requirements.filter((requirement) => requirement.found).length;

  return {
    found,
    total: requirements.length,
    score: requirements.length === 0 ? 0 : Math.round((found / requirements.length) * 100),
  };
}

export function AnalysisResults({ analysis }: { analysis: Analysis }) {
  const requiredCoverage = requirementCoverage(analysis, "required");
  const preferredCoverage = requirementCoverage(analysis, "preferred");
  const coverageGroups = [
    { label: "Required requirements", ...requiredCoverage },
    { label: "Preferred requirements", ...preferredCoverage },
  ];

  return (
    <section aria-labelledby="results-heading" className="grid gap-16">
      <div className="surface-panel overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-[var(--line)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 id="results-heading" className="text-xl font-semibold tracking-[-0.025em]">Your CV-to-role review</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between border-b border-[var(--line)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <span className="data-number text-[clamp(5rem,12vw,8.5rem)] font-semibold leading-none text-[var(--accent)]">
              {analysis.overallScore}%
            </span>
            <div className="mt-7">
              <p className="text-lg font-semibold">Requirement coverage</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--text-muted)]">
                Confirmed CV evidence for the role&apos;s requirements. This is not a hiring prediction.
              </p>
            </div>
          </div>

          <div className="grid content-center px-6 py-4 sm:px-8 sm:py-6">
            <dl>
              {coverageGroups.map(({ label, found, total, score }) => (
                <div key={label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-4 border-b border-[var(--line)] py-4 last:border-b-0">
                  <dt className="text-sm text-[var(--text-muted)]">{label}</dt>
                  <dd className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${score}%` }} />
                  </dd>
                  <dd className="data-number w-12 text-right text-sm font-semibold">
                    {total === 0 ? "N/A" : `${found}/${total}`}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="pt-4 text-xs leading-5 text-[var(--text-muted)]">
              Required requirements account for 70% of the score and preferred requirements for 30% when both are listed.
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-8 rounded-[var(--radius-display)] bg-[var(--accent-soft)] p-6 sm:p-8 lg:grid-cols-12 lg:gap-10" aria-labelledby="plan-heading">
        <div className="lg:col-span-4">
          <IconListCheck size={28} stroke={1.7} className="text-[var(--accent)]" aria-hidden />
          <h2 id="plan-heading" className="mt-5 text-3xl font-semibold tracking-[-0.045em]">Your next steps</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--text-muted)]">Work top to bottom before making lower-impact edits.</p>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {analysis.actionPlan.map((step, index) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-4 border-t border-[color-mix(in_srgb,var(--accent)_32%,transparent)] py-4 first:border-t-0 first:pt-0">
              <span className="data-number text-sm font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
              <p className="leading-7">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="suggestions-heading">
        <div className="grid gap-5 border-b border-[var(--line-strong)] pb-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="suggestions-heading" className="text-3xl font-semibold tracking-[-0.045em]">What to improve</h2>
          </div>
          <p className="text-sm leading-6 text-[var(--text-muted)] lg:col-span-5">Specific changes ordered by their likely value for this application.</p>
        </div>
        {analysis.suggestions.length === 0 ? (
          <p className="py-7 text-[var(--text-muted)]">No specific edits were recommended for this pairing.</p>
        ) : (
          <div>
            {analysis.suggestions.map((suggestion, index) => (
              <article key={suggestion.title} className="grid gap-3 border-b border-[var(--line)] py-6 sm:grid-cols-[3rem_1fr] sm:gap-5 lg:grid-cols-[3rem_0.7fr_1.3fr]">
                <span className="data-number text-sm text-[var(--text-muted)]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className={`text-xs font-semibold ${suggestion.priority === "high" ? "text-[var(--danger)]" : "text-[var(--accent)]"}`}>
                    {priorityLabel[suggestion.priority]}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em]">{suggestion.title}</h3>
                </div>
                <p className="text-sm leading-6 text-[var(--text-muted)]">{suggestion.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <section aria-labelledby="matched-heading">
          <div className="flex items-center gap-3 border-b border-[var(--line-strong)] pb-4">
            <IconCircleCheck size={22} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
            <div>
              <h2 id="matched-heading" className="text-2xl font-semibold tracking-[-0.035em]">Matched skills</h2>
            </div>
          </div>
          {analysis.matchedSkills.length === 0 ? (
            <p className="py-6 text-[var(--text-muted)]">No clearly matched skills were identified in this CV.</p>
          ) : (
            <ul>
              {analysis.matchedSkills.map((skill) => (
                <li key={skill.name} className="border-b border-[var(--line)] py-5">
                  <p className="font-semibold">{skill.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{skill.evidence}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="gaps-heading">
          <div className="flex items-center gap-3 border-b border-[var(--line-strong)] pb-4">
            <IconAlertTriangle size={22} stroke={1.8} className="text-[var(--danger)]" aria-hidden />
            <div>
              <h2 id="gaps-heading" className="text-2xl font-semibold tracking-[-0.035em]">Skills to address</h2>
            </div>
          </div>
          {analysis.gaps.length === 0 ? (
            <p className="py-6 text-[var(--text-muted)]">No missing or weakly evidenced skills were identified.</p>
          ) : (
            <ul>
              {analysis.gaps.map((gap) => (
                <li key={gap.name} className="border-b border-[var(--line)] py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{gap.name}</p>
                    <p className="text-xs font-semibold text-[var(--danger)]">{gap.status === "missing" ? "Missing from CV" : "Weak evidence"}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{gap.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="strengths-heading">
        <div className="grid gap-4 border-b border-[var(--line-strong)] pb-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <h2 id="strengths-heading" className="text-3xl font-semibold tracking-[-0.045em]">Strengths to keep visible</h2>
        </div>
        {analysis.strengths.length === 0 ? (
          <p className="py-7 text-[var(--text-muted)]">No standout strengths were identified for this role.</p>
        ) : (
          <ul className="grid sm:grid-cols-2">
            {analysis.strengths.map((strength, index) => (
              <li key={strength} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-[var(--line)] py-5 sm:odd:pr-7 sm:even:border-l sm:even:pl-7">
                <span className="data-number text-sm text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                <p className="leading-7">{strength}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <section aria-labelledby="requirements-heading">
          <div className="flex items-center gap-3 border-b border-[var(--line-strong)] pb-4">
            <IconTargetArrow size={22} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
            <h2 id="requirements-heading" className="text-2xl font-semibold tracking-[-0.035em]">Job requirements</h2>
          </div>
          {analysis.jobRequirements.length === 0 ? (
            <p className="py-6 text-[var(--text-muted)]">No job requirements were returned for this analysis.</p>
          ) : (
            <ul>
              {analysis.jobRequirements.map((requirement) => (
                <li key={`${requirement.type}-${requirement.name}`} className="flex items-start justify-between gap-5 border-b border-[var(--line)] py-4">
                  <div>
                    <p className="font-semibold">{requirement.name}</p>
                    <p className="mt-1 text-xs capitalize text-[var(--text-muted)]">{requirement.type}</p>
                  </div>
                  <span className={`shrink-0 font-mono text-xs font-semibold ${requirement.found ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>
                    {requirement.found ? "Found in CV" : "Not found in CV"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="relevance-heading">
          <div className="flex items-center gap-3 border-b border-[var(--line-strong)] pb-4">
            <IconCircleDashed size={22} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
            <h2 id="relevance-heading" className="text-2xl font-semibold tracking-[-0.035em]">Relevant experience</h2>
          </div>
          {analysis.experienceRelevance.length === 0 ? (
            <p className="py-6 text-[var(--text-muted)]">No relevant experience was identified for this role.</p>
          ) : (
            <ul>
              {analysis.experienceRelevance.map((item) => (
                <li key={item.name} className="border-b border-[var(--line)] py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="shrink-0 font-mono text-xs font-semibold capitalize text-[var(--accent)]">{item.relevance} relevance</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
