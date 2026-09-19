"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowUpRight } from "@tabler/icons-react";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAnalyze = pathname === "/analyze";

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_90%,transparent)] backdrop-blur-md">
      <div className="page-shell flex h-16 items-center justify-between gap-5">
        <Link href="/" className="group flex items-center gap-2.5 font-semibold tracking-[-0.025em]" aria-label="JobFit home">
          <span className="grid size-7 place-items-center rounded-[7px] bg-[var(--accent-button)] font-mono text-[0.62rem] font-bold tracking-[-0.06em] text-[var(--accent-button-text)] transition-transform group-hover:-rotate-3" aria-hidden>
            JF
          </span>
          JobFit
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2 text-sm font-semibold sm:gap-4">
          <Link
            href="/"
            aria-current={isHome ? "page" : undefined}
            className={`hidden px-2 py-2 sm:inline-flex ${isHome ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
          >
            Home
          </Link>
          <Link
            href="/analyze"
            aria-current={isAnalyze ? "page" : undefined}
            className={isAnalyze ? "button-secondary min-h-10 px-3.5 py-2" : "button-primary min-h-10 px-3.5 py-2"}
          >
            Analyze my fit
            <IconArrowUpRight size={16} stroke={1.8} aria-hidden />
          </Link>
        </nav>
      </div>
    </header>
  );
}
