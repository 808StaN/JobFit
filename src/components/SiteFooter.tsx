import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface-muted)]">
      <div className="page-shell grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-12">
        <div className="lg:col-span-5">
          <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">JobFit</Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
            Evidence-led CV reviews for individual job applications. Files are not stored by JobFit after the request completes.
          </p>
        </div>

        <div className="lg:col-span-3 lg:col-start-7">
          <div className="flex flex-col items-start gap-2 text-sm font-semibold">
            <Link href="/analyze" className="hover:text-[var(--accent)]">Analyze my fit</Link>
            <Link href="/privacy" className="hover:text-[var(--accent)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--accent)]">Terms</Link>
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="text-sm leading-6 text-[var(--text-muted)]">
            Analysis uses Groq as the primary provider and OpenRouter only as a fallback. Review sensitive information before uploading.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="page-shell flex flex-col gap-2 py-4 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>JobFit / application evidence review</p>
          <p>Built for informed edits, not hiring predictions</p>
        </div>
      </div>
    </footer>
  );
}
