import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How JobFit processes CVs, job descriptions, and analysis requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="page-shell pb-24 pt-12 sm:pb-32 sm:pt-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
        <IconArrowLeft size={17} stroke={1.8} aria-hidden />
        Back to home
      </Link>
      <header className="mt-10 grid gap-8 border-b border-[var(--line-strong)] pb-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Policy / 01</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">Privacy</h1>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] lg:col-span-4">Effective September 19, 2026</p>
      </header>

      <div className="grid gap-10 pt-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <p className="max-w-xs text-sm leading-6 text-[var(--text-muted)]">
            Short version: JobFit processes your input to create the requested review. The application does not persist uploaded files or generated reports.
          </p>
        </aside>
        <article className="grid max-w-3xl gap-10 lg:col-span-8 lg:col-start-5">
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Information you provide</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              JobFit receives the PDF CV, job description, and any CV bullet you submit for improvement. These inputs may contain personal information that you choose to include.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">How the analysis works</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              The application extracts text from your PDF and sends the relevant text with the job description to Groq for AI processing. If Groq is unavailable, OpenRouter may process the request as a fallback. Their own privacy and retention terms apply to data handled by their services.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <a href="https://groq.com/privacy-policy/" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">Groq privacy policy</a>
              <a href="https://openrouter.ai/privacy" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">OpenRouter privacy policy</a>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Storage and logs</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              JobFit does not intentionally save uploaded CV files, pasted job descriptions, or generated reports in an application database. Hosting infrastructure and AI providers may keep technical or request logs under their own policies. Avoid submitting information that is not needed for the review.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Purpose and choices</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              Inputs are used only to return the analysis or bullet rewrite you request, maintain service security, and diagnose failures. If you do not want CV content processed by third-party AI providers, do not upload it to JobFit.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Policy changes</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              This notice may change as the service or its providers change. The effective date above identifies the current version.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
