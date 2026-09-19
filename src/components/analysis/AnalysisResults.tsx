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

export function AnalysisResults({ analysis }: { analysis: Analysis }) {
  return (
    <section aria-labelledby="results-heading" className="space-y-10">
      <div className="grid gap-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:grid-cols-[190px_1fr] sm:p-8">
        <div className="flex flex-col justify-center border-b border-[var(--line)] pb-6 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
          <span className="text-5xl font-semibold tracking-[-0.06em] text-[var(--accent)]">{analysis.overallScore}%</span>
          <h2 id="results-heading" className="mt-2 text-lg font-semibold">Overall match</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">An orientation score based on evidence in your CV.</p>
        </div>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(analysis.scoreBreakdown).map(([name, score]) => (
            <div key={name} className="rounded-xl bg-[var(--surface-muted)] p-4">
              <dt className="text-sm capitalize text-[var(--text-muted)]">{name}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">{score}%</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="matched-heading">
          <div className="flex items-center gap-2">
            <IconCircleCheck size={23} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
            <h2 id="matched-heading" className="text-2xl font-semibold tracking-tight">Matched skills</h2>
          </div>
          {analysis.matchedSkills.length === 0 ? (
            <p className="mt-5 text-[var(--text-muted)]">No clearly matched skills were identified in this CV.</p>
          ) : (
            <ul className="mt-5 grid gap-3">
              {analysis.matchedSkills.map((skill) => (
                <li key={skill.name} className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="font-semibold">{skill.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{skill.evidence}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="gaps-heading">
          <div className="flex items-center gap-2">
            <IconAlertTriangle size={23} stroke={1.8} className="text-[var(--danger)]" aria-hidden />
            <h2 id="gaps-heading" className="text-2xl font-semibold tracking-tight">Skills to address</h2>
          </div>
          {analysis.gaps.length === 0 ? (
            <p className="mt-5 text-[var(--text-muted)]">No missing or weakly evidenced skills were identified.</p>
          ) : (
            <ul className="mt-5 grid gap-3">
              {analysis.gaps.map((gap) => (
                <li key={gap.name} className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="font-semibold">{gap.name}</p>
                  <p className="mt-1 text-sm font-medium text-[var(--danger)]">
                    {gap.status === "missing" ? "Missing from CV" : "Weak evidence"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{gap.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="strengths-heading">
        <h2 id="strengths-heading" className="text-2xl font-semibold tracking-tight">
          Your strengths
        </h2>
        {analysis.strengths.length === 0 ? (
          <p className="mt-5 text-[var(--text-muted)]">No standout strengths were identified for this role.</p>
        ) : (
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {analysis.strengths.map((strength) => (
              <li key={strength} className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4 leading-7">
                {strength}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8" aria-labelledby="suggestions-heading">
        <h2 id="suggestions-heading" className="text-2xl font-semibold tracking-tight">What you could improve</h2>
        {analysis.suggestions.length === 0 ? (
          <p className="mt-6 text-[var(--text-muted)]">No specific edits were recommended for this pairing.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {analysis.suggestions.map((suggestion) => (
              <article key={suggestion.title} className="rounded-[16px] bg-[var(--surface-muted)] p-5">
                <p className="text-sm font-semibold text-[var(--accent)]">{priorityLabel[suggestion.priority]}</p>
                <h3 className="mt-2 text-lg font-semibold">{suggestion.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{suggestion.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="requirements-heading">
          <div className="flex items-center gap-2">
            <IconTargetArrow size={23} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
            <h2 id="requirements-heading" className="text-2xl font-semibold tracking-tight">Job requirements</h2>
          </div>
          {analysis.jobRequirements.length === 0 ? (
            <p className="mt-5 text-[var(--text-muted)]">No job requirements were returned for this analysis.</p>
          ) : (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {analysis.jobRequirements.map((requirement) => (
                <li key={`${requirement.type}-${requirement.name}`} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="font-semibold">{requirement.name}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {requirement.type === "required" ? "Required" : "Preferred"} · {requirement.found ? "Found in CV" : "Not found in CV"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="relevance-heading">
          <div className="flex items-center gap-2">
            <IconCircleDashed size={23} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
            <h2 id="relevance-heading" className="text-2xl font-semibold tracking-tight">Relevant experience</h2>
          </div>
          {analysis.experienceRelevance.length === 0 ? (
            <p className="mt-5 text-[var(--text-muted)]">No relevant experience was identified for this role.</p>
          ) : (
            <ul className="mt-5 grid gap-3">
              {analysis.experienceRelevance.map((item) => (
                <li key={item.name} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm font-medium capitalize text-[var(--accent)]">{item.relevance} relevance</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{item.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl bg-[var(--accent-soft)] p-6 sm:p-8" aria-labelledby="plan-heading">
        <div className="flex items-center gap-2">
          <IconListCheck size={24} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
          <h2 id="plan-heading" className="text-2xl font-semibold tracking-tight">Your next steps</h2>
        </div>
        <ol className="mt-5 grid gap-3">
          {analysis.actionPlan.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-button)] text-sm font-bold text-[var(--accent-button-text)]">
                {index + 1}
              </span>
              <p className="pt-0.5 leading-6">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
