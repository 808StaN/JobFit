export function AnalysisProgress({ hasPreviousResult = false }: { hasPreviousResult?: boolean }) {
  return (
    <div role="status" aria-live="polite" className="surface-panel overflow-hidden px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-semibold">Analyzing your CV</p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            {hasPreviousResult
              ? "Your current review stays visible until the new one is ready."
              : "We are reading both documents and building your evidence review."}
          </p>
        </div>
        <span className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden />
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]" aria-hidden>
        <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--accent)]" />
      </div>
    </div>
  );
}
