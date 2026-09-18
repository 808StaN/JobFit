import Link from "next/link";
import { IconArrowRight, IconFileText, IconSparkles, IconTargetArrow } from "@tabler/icons-react";

const steps = [
  {
    icon: IconFileText,
    title: "Add your CV",
    copy: "Upload one PDF. Your document is processed only for this analysis.",
  },
  {
    icon: IconTargetArrow,
    title: "Paste the role",
    copy: "Use the complete job description to give the analysis enough context.",
  },
  {
    icon: IconSparkles,
    title: "Act on the result",
    copy: "See evidence, gaps and a clear list of improvements before you apply.",
  },
];

export default function Home() {
  return (
    <main className="min-h-[100dvh]">
      <header className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          JobFit
        </Link>
        <Link
          href="/analyze"
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:translate-y-px"
        >
          Analyze CV
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <p className="mb-5 text-sm font-semibold text-[var(--accent)]">CV analysis for focused applications</p>
          <h1 className="max-w-3xl font-[family-name:var(--font-geist)] text-5xl font-semibold tracking-[-0.055em] text-[var(--text)] sm:text-6xl">
            Know what your CV proves before you apply.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
            JobFit compares your PDF CV with a real job description and turns the gap into practical next steps.
          </p>
          <Link
            href="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--accent-hover)] active:translate-y-px"
          >
            Analyze my fit <IconArrowRight size={18} stroke={2} aria-hidden />
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(23,32,28,0.08)] sm:p-8">
          <p className="text-sm font-semibold text-[var(--text-muted)]">Built for an honest review</p>
          <dl className="mt-8 grid gap-7">
            <div>
              <dt className="text-3xl font-semibold tracking-tight text-[var(--text)]">Evidence first</dt>
              <dd className="mt-2 text-[var(--text-muted)]">Matches point back to skills and experience mentioned in your CV.</dd>
            </div>
            <div>
              <dt className="text-3xl font-semibold tracking-tight text-[var(--text)]">No invented experience</dt>
              <dd className="mt-2 text-[var(--text-muted)]">Missing information stays a gap. JobFit does not fabricate qualifications.</dd>
            </div>
            <div>
              <dt className="text-3xl font-semibold tracking-tight text-[var(--text)]">A plan, not a verdict</dt>
              <dd className="mt-2 text-[var(--text-muted)]">The score is an orientation signal, not a prediction of your hiring outcome.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface-muted)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">One focused workflow</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {steps.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="border-l-2 border-[var(--accent)] pl-5">
                <Icon size={25} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-sm leading-7 text-[var(--text-muted)]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
