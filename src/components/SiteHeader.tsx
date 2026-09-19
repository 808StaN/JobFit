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
      <div className="nav-shell pointer-events-auto">
        <div className="floating-nav flex h-14 items-center justify-between gap-5 px-3.5 sm:h-[3.75rem] sm:px-4">
          <Link href="/" className="group flex items-center gap-2.5 font-semibold tracking-[-0.025em] text-white" aria-label="JobFit home">
            <span className="grid size-7 place-items-center text-white transition-transform group-hover:-rotate-3" aria-hidden>
              <svg className="size-7" viewBox="0 0 43.916 43.916" aria-hidden="true">
                <mask id="cv-icon-cutouts" maskUnits="userSpaceOnUse" x="0" y="0" width="43.916" height="43.916">
                  <rect width="43.916" height="43.916" fill="black" />
                  <path fill="white" d="M34.395,0H9.522c-2.762,0-5,2.239-5,5v33.916c0,2.761,2.238,5,5,5h24.871c2.762,0,5-2.239,5-5V5C39.395,2.239,37.154,0,34.395,0z" />
                  <path fill="black" d="M9.208,16.855c0-1.172,0.951-2.121,2.121-2.121h0.742c-0.791-0.874-1.277-2.03-1.277-3.304c0-2.723,2.209-4.931,4.932-4.931c2.725,0,4.932,2.207,4.932,4.932c0,1.272-0.486,2.429-1.279,3.303h0.709c1.172,0,2.121,0.949,2.121,2.121v3.578c0,1.122-0.875,2.03-1.975,2.106h-9.051c-1.1-0.076-1.975-0.984-1.975-2.106V16.855L9.208,16.855z M32.708,37.416h-21.5c-1.104,0-2-0.896-2-2s0.896-2,2-2h21.5c1.104,0,2,0.896,2,2S33.812,37.416,32.708,37.416z M32.708,29.916h-21.5c-1.104,0-2-0.896-2-2s0.896-2,2-2h21.5c1.104,0,2,0.896,2,2S33.812,29.916,32.708,29.916z M32.708,22.416h-6.5c-1.104,0-2-0.896-2-2c0-1.104,0.896-2,2-2h6.5c1.104,0,2,0.896,2,2C34.708,21.52,33.812,22.416,32.708,22.416z" />
                </mask>
                <rect width="43.916" height="43.916" fill="currentColor" mask="url(#cv-icon-cutouts)" />
              </svg>
            </span>
            JobFit
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1 text-sm font-semibold sm:gap-2">
            <Link
              href="/"
              aria-current={isHome ? "page" : undefined}
              className={`hidden rounded-[14px] px-2.5 py-1.5 hover:bg-white/10 hover:text-white sm:inline-flex ${isHome ? "text-white" : "text-white/70"}`}
            >
              Home
            </Link>
            <Link
              href="/analyze"
              aria-current={isAnalyze ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-[14px] px-2.5 py-1.5 hover:bg-white/10 hover:text-white ${isAnalyze ? "text-white" : "text-white/80"}`}
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
