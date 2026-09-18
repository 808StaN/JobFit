import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>JobFit processes each CV only for the current analysis. Files are not stored.</p>
        <Link href="/analyze" className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]">
          Analyze my fit
        </Link>
      </div>
    </footer>
  );
}
