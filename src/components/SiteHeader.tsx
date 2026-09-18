import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[20] border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-8">
        <Link href="/" className="text-[1.05rem] font-semibold tracking-tight">
          JobFit
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="text-[var(--text-muted)] hover:text-[var(--text)]">
            Home
          </Link>
          <Link
            href="/analyze"
            className="rounded-[12px] bg-[var(--accent-button)] px-4 py-2 font-semibold text-[var(--accent-button-text)] transition hover:bg-[var(--accent-hover)] active:translate-y-px"
          >
            Analyze my fit
          </Link>
        </nav>
      </div>
    </header>
  );
}
