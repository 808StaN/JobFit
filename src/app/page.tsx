import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconFileText, IconListCheck, IconShieldCheck } from "@tabler/icons-react";

const outcomes = [
  "Matched skills with evidence from your CV",
  "Missing skills versus weak evidence",
  "Suggestions that stay inside what you actually wrote",
  "A short action plan before you send the application",
];

export default function Home() {
  return (
    <main id="main">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pt-16">
        <div>
          <h1 className="max-w-[14ch] text-4xl font-semibold tracking-[-0.055em] text-[var(--text)] md:text-5xl lg:text-6xl">
            Know what your CV proves before you apply.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
            Upload a PDF, paste a job description, and get a structured fit review with concrete next steps.
          </p>
          <Link
            href="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-[12px] bg-[var(--accent-button)] px-5 py-3 font-semibold text-[var(--accent-button-text)] transition hover:bg-[var(--accent-hover)] active:translate-y-px"
          >
            Analyze my fit
            <IconArrowRight size={18} stroke={1.8} aria-hidden />
          </Link>
        </div>
        <div className="overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)]">
          <Image
            src="/images/hero-desk.jpg"
            alt="A candidate reviewing a printed CV beside a laptop open to a job posting."
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface-muted)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[16px]">
            <Image
              src="/images/workflow-desk.jpg"
              alt="A quiet desk with a resume stack, a laptop, and notes prepared for an application."
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">From PDF to a plan in one pass</h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-[var(--text-muted)]">
              The analysis lives on a dedicated workspace so the landing page stays focused and the tool can stay accessible.
            </p>
            <ol className="mt-8 grid gap-6">
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <IconFileText size={24} stroke={1.8} className="mt-0.5 text-[var(--accent)]" aria-hidden />
                <div>
                  <h3 className="font-semibold">Add the CV</h3>
                  <p className="mt-1 text-[var(--text-muted)]">One text-based PDF, up to 5 MB. You can replace it before running analysis.</p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <IconListCheck size={24} stroke={1.8} className="mt-0.5 text-[var(--accent)]" aria-hidden />
                <div>
                  <h3 className="font-semibold">Paste the role</h3>
                  <p className="mt-1 text-[var(--text-muted)]">Use the full posting so required and preferred skills can be separated.</p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <IconShieldCheck size={24} stroke={1.8} className="mt-0.5 text-[var(--accent)]" aria-hidden />
                <div>
                  <h3 className="font-semibold">Review evidence</h3>
                  <p className="mt-1 text-[var(--text-muted)]">Matches, gaps, and suggestions stay tied to what the CV actually contains.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">What the review includes</h2>
        <p className="mt-4 max-w-[65ch] leading-7 text-[var(--text-muted)]">
          The score is an orientation signal for CV-to-role overlap. It is not a prediction of whether you will be hired.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {outcomes.map((item) => (
            <li key={item} className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-5 py-4 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[var(--surface-muted)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">No invented experience</h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-[var(--text-muted)]">
              If testing, deployment, or accessibility work is not in the CV, JobFit reports the gap. It will not write those claims for you.
            </p>
            <p className="mt-4 max-w-[65ch] leading-7 text-[var(--text-muted)]">
              That keeps the tool useful for a last review, not as a source of fabricated qualifications.
            </p>
          </div>
          <div className="overflow-hidden rounded-[16px]">
            <Image
              src="/images/review-notes.jpg"
              alt="Close-up of annotated resume pages and a small note on a pale desk."
              width={1200}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="rounded-[16px] bg-[var(--accent-soft)] px-6 py-10 sm:px-10">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight">Ready to check one application</h2>
          <p className="mt-3 max-w-[65ch] leading-7 text-[var(--text-muted)]">
            Open the analysis workspace, add your PDF, and generate a plan you can act on today.
          </p>
          <Link
            href="/analyze"
            className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-[var(--accent-button)] px-5 py-3 font-semibold text-[var(--accent-button-text)] transition hover:bg-[var(--accent-hover)] active:translate-y-px"
          >
            Analyze my fit
            <IconArrowRight size={18} stroke={1.8} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
