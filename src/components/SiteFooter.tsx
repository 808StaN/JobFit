import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--background)]">
      <div className="page-shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
        <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">JobFit</Link>
        <nav aria-label="Footer" className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/privacy" className="hover:text-[var(--accent)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--accent)]">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
