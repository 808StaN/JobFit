"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, retry }: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  useEffect(() => {
    console.error("[app] Route render failed", { digest: error.digest });
  }, [error]);

  return (
    <main id="main" className="page-shell grid min-h-dvh place-items-center py-28">
      <section className="surface-panel max-w-xl p-7 sm:p-10" aria-labelledby="error-heading">
        <p className="text-sm font-semibold text-[var(--accent)]">JobFit</p>
        <h1 id="error-heading" className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
          We could not load this page.
        </h1>
        <p className="mt-4 max-w-lg leading-7 text-[var(--text-muted)]">
          The problem may be temporary. Try again, or return to the homepage and start a new review.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={retry} className="button-primary">
            Try again
          </button>
          <Link href="/" className="button-secondary">
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
