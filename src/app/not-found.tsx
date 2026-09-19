import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <main id="main" className="page-shell grid min-h-[64dvh] items-center py-20">
      <div className="grid gap-8 border-y border-[var(--line)] py-12 lg:grid-cols-12 lg:items-end">
        <p className="data-number text-[clamp(6rem,18vw,13rem)] font-semibold leading-none text-[var(--surface-strong)] lg:col-span-5" aria-hidden>404</p>
        <div className="lg:col-span-6 lg:col-start-7">
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em]">This page left no evidence.</h1>
          <p className="mt-5 max-w-[40rem] leading-7 text-[var(--text-muted)]">The address may have changed, or the page never existed.</p>
          <Link href="/" className="button-primary mt-7 w-fit">
            <IconArrowLeft size={18} stroke={1.8} aria-hidden />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
