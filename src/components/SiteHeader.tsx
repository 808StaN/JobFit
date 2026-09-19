"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowUpRight } from "@tabler/icons-react";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAnalyze = pathname === "/analyze";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-[var(--z-header)] sm:top-4">
      <div className="page-shell pointer-events-auto">
        <div className="floating-nav flex h-14 items-center justify-between gap-5 px-3.5 sm:h-[3.75rem] sm:px-4">
          <Link href="/" className="group flex items-center gap-2.5 font-semibold tracking-[-0.025em] text-white" aria-label="JobFit home">
            <span className="grid size-7 place-items-center rounded-[7px] border border-white/30 bg-white/12 font-mono text-[0.62rem] font-bold tracking-[-0.06em] text-white transition-transform group-hover:-rotate-3" aria-hidden>
              JF
            </span>
            JobFit
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1 text-sm font-semibold sm:gap-2">
            <Link
              href="/"
              aria-current={isHome ? "page" : undefined}
              className={`hidden rounded-[8px] px-3 py-2 sm:inline-flex ${isHome ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              Home
            </Link>
            <Link
              href="/analyze"
              aria-current={isAnalyze ? "page" : undefined}
              className={`inline-flex min-h-9 items-center gap-2 rounded-[8px] px-3 py-2 ${isAnalyze ? "bg-white/15 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              Analyze my fit
              <IconArrowUpRight size={16} stroke={1.8} aria-hidden />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
