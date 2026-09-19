import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconCheck, IconFileText, IconLock } from "@tabler/icons-react";
import { HeroShader } from "@/components/visual/HeroShader";

const reviewRows = [
  { label: "Role essentials", value: "7 / 9", tone: "text-[var(--accent)]" },
  { label: "Evidence strength", value: "Clear", tone: "text-[var(--text)]" },
  { label: "Priority gaps", value: "2", tone: "text-[var(--danger)]" },
];

const outcomes = [
  {
    number: "01",
    title: "Evidence already working",
    description: "See which requirements your CV supports and the exact experience behind each match.",
  },
  {
    number: "02",
    title: "Gaps worth your attention",
    description: "Separate missing skills from experience that is present but too vague to carry weight.",
  },
  {
    number: "03",
    title: "A focused revision plan",
    description: "Leave with ordered next steps instead of a long list of generic CV advice.",
  },
];

export default function Home() {
  return (
    <main id="main">
      <section className="relative isolate overflow-hidden border-b border-[var(--line)]">
        <HeroShader />
        <div className="page-shell relative grid min-h-[42rem] items-center gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
          <div className="lg:col-span-7 lg:pr-10">
            <p className="mb-7 flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span className="h-px w-8 bg-[var(--line-strong)]" aria-hidden />
              CV evidence review
            </p>
            <h1 className="max-w-[12ch] text-balance text-[clamp(3.15rem,7vw,6.8rem)] font-semibold leading-[0.91] tracking-[-0.072em] text-[var(--text)]">
              Know what your CV can prove.
            </h1>
            <p className="mt-7 max-w-[36rem] text-pretty text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
              Compare one CV with one role. JobFit turns the overlap into an evidence map, exposes weak claims, and tells you what to fix before you apply.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/analyze" className="button-primary group sm:min-w-44">
                Analyze my fit
                <IconArrowRight className="transition-transform group-hover:translate-x-0.5" size={18} stroke={1.8} aria-hidden />
              </Link>
              <Link href="#sample-review" className="button-secondary sm:min-w-40">
                See the output
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <IconLock size={15} stroke={1.8} aria-hidden />
              Your PDF is processed for this review and is not stored.
            </p>
          </div>

          <article
            id="sample-review"
            aria-label="Illustrative JobFit review"
            className="surface-panel relative lg:col-span-5 lg:translate-y-8"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4 sm:px-7">
              <div>
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Sample review / 0048</p>
                <h2 className="mt-1 font-semibold tracking-[-0.025em]">Product designer · Growth</h2>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <IconFileText size={18} stroke={1.8} aria-hidden />
              </span>
            </div>

            <div className="grid gap-8 px-5 py-6 sm:px-7 sm:py-8">
              <div className="grid grid-cols-[auto_1fr] items-end gap-6">
                <p className="data-number text-7xl font-semibold leading-none sm:text-8xl">68</p>
                <div className="pb-1">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Fit signal / 100</p>
                  <p className="mt-2 max-w-44 text-sm leading-5 text-[var(--text-muted)]">Promising overlap with two fixable evidence gaps.</p>
                </div>
              </div>

              <dl className="border-t border-[var(--line)]">
                {reviewRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-5 border-b border-[var(--line)] py-3.5">
                    <dt className="text-sm text-[var(--text-muted)]">{row.label}</dt>
                    <dd className={`font-mono text-sm font-semibold ${row.tone}`}>{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-[var(--radius-control)] bg-[var(--surface-muted)] p-4">
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">First action</p>
                <p className="mt-2 text-sm font-semibold leading-6">Quantify the checkout redesign result before adding more skills.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="review-heading" className="page-shell py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">What you receive</p>
            <h2 id="review-heading" className="mt-5 max-w-[12ch] text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">
              A review built for one decision.
            </h2>
            <p className="mt-6 max-w-[31rem] text-pretty leading-7 text-[var(--text-muted)]">
              The score is an orientation signal for CV-to-role overlap, not a prediction of whether you will be hired.
            </p>
          </div>
          <ol className="lg:col-span-7 lg:col-start-7">
            {outcomes.map((item) => (
              <li key={item.number} className="grid gap-3 border-t border-[var(--line)] py-7 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="font-mono text-sm text-[var(--text-muted)]">{item.number}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.025em]">{item.title}</h3>
                  <p className="mt-2 max-w-[38rem] leading-7 text-[var(--text-muted)]">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="process-heading" className="border-y border-[var(--line)] bg-[var(--surface-muted)]">
        <div className="page-shell grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
          <div className="relative lg:col-span-7">
            <div className="overflow-hidden rounded-[var(--radius-display)]">
              <Image
                src="/images/hero-desk.jpg"
                alt="A candidate reviewing a printed CV beside a laptop open to a job posting."
                width={1600}
                height={900}
                className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
              />
            </div>
            <div className="absolute -bottom-5 right-4 max-w-56 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 shadow-[0_1rem_3rem_-1.5rem_var(--shadow)] sm:right-8">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-muted)]">Typical input</p>
              <p className="mt-1 text-sm font-semibold">1 PDF + 1 job description</p>
            </div>
          </div>

          <div className="pt-5 lg:col-span-4 lg:col-start-9 lg:pt-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">One focused pass</p>
            <h2 id="process-heading" className="mt-5 text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-5xl">
              From PDF to an edit plan.
            </h2>
            <ol className="mt-9 grid gap-6">
              <li className="grid grid-cols-[2rem_1fr] gap-4">
                <span className="font-mono text-sm text-[var(--accent)]">01</span>
                <div>
                  <h3 className="font-semibold">Add your CV</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Upload one text-based PDF, up to 5 MB.</p>
                </div>
              </li>
              <li className="grid grid-cols-[2rem_1fr] gap-4">
                <span className="font-mono text-sm text-[var(--accent)]">02</span>
                <div>
                  <h3 className="font-semibold">Paste the complete role</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Keep required and preferred qualifications in context.</p>
                </div>
              </li>
              <li className="grid grid-cols-[2rem_1fr] gap-4">
                <span className="font-mono text-sm text-[var(--accent)]">03</span>
                <div>
                  <h3 className="font-semibold">Revise what matters</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Work through prioritized gaps without rewriting your whole CV.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="guardrail-heading" className="page-shell py-24 sm:py-32">
        <div className="grid gap-10 border-t border-[var(--line-strong)] pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--danger)]">A deliberate limit</p>
            <h2 id="guardrail-heading" className="mt-5 max-w-[15ch] text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-5xl">
              Better evidence, never invented experience.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-10">
            <p className="text-pretty leading-7 text-[var(--text-muted)]">
              If testing, deployment, or accessibility work is absent from your CV, JobFit reports the gap. It will not write those claims for you.
            </p>
            <ul className="mt-6 grid gap-3 text-sm font-semibold">
              <li className="flex items-center gap-3">
                <IconCheck size={18} stroke={2} className="text-[var(--accent)]" aria-hidden />
                Recommendations stay grounded in your PDF
              </li>
              <li className="flex items-center gap-3">
                <IconCheck size={18} stroke={2} className="text-[var(--accent)]" aria-hidden />
                Missing experience remains clearly labeled
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--accent-soft)]">
        <div className="page-shell grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Your next application</p>
            <h2 className="mt-4 max-w-[17ch] text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">
              Check the evidence before a recruiter does.
            </h2>
          </div>
          <Link href="/analyze" className="button-primary group w-fit">
            Start the review
            <IconArrowRight className="transition-transform group-hover:translate-x-0.5" size={18} stroke={1.8} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
