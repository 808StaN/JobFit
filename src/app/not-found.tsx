import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-[65ch] text-[var(--text-muted)]">The page you requested does not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-[12px] bg-[var(--accent-button)] px-4 py-2 font-semibold text-[var(--accent-button-text)]"
      >
        Back to home
      </Link>
    </main>
  );
}
