import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using JobFit CV analysis and writing assistance.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main id="main" className="page-shell pb-24 pt-12 sm:pb-32 sm:pt-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
        <IconArrowLeft size={17} stroke={1.8} aria-hidden />
        Back to home
      </Link>
      <header className="mt-10 grid gap-8 border-b border-[var(--line-strong)] pb-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Policy / 02</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">Terms</h1>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] lg:col-span-4">Effective September 19, 2026</p>
      </header>

      <div className="grid gap-10 pt-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <p className="max-w-xs text-sm leading-6 text-[var(--text-muted)]">
            JobFit is a review aid. You remain responsible for every claim in your CV and every application you submit.
          </p>
        </aside>
        <article className="grid max-w-3xl gap-10 lg:col-span-8 lg:col-start-5">
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Using JobFit</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              You may use the service to compare a CV you are authorized to process with a job description and to improve existing CV text. Do not upload another person&apos;s information without permission or use the service for unlawful purposes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">No hiring guarantee</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              Scores, gaps, and recommendations are automated estimates. They do not represent a recruiter’s decision, professional career advice, or a guarantee of interviews, employment, or any other outcome.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Accuracy and your responsibility</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              AI output can be incomplete or incorrect. Review every suggestion before using it. Do not add qualifications, results, or experience that you cannot support. You are responsible for the accuracy and legality of submitted application materials.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Availability</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              The service is provided as available and may be changed, suspended, or limited without notice. Analysis may fail when parsing a PDF or when an external AI provider is unavailable.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Third-party services</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              JobFit relies on hosting, Groq, and OpenRouter services. Their terms govern their parts of the processing. By submitting a request, you acknowledge that these providers may process the supplied text to fulfill it.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
