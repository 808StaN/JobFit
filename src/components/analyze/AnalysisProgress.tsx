const steps = ["Reading CV", "Extracting requirements", "Comparing skills", "Generating recommendations"] as const;

export function AnalysisProgress({ activeStep = 2 }: { activeStep?: number }) {
  return (
    <div role="status" aria-live="polite" className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-6">
      <p className="font-semibold">Analyzing your CV</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">This usually takes a few seconds.</p>
      <ol className="mt-5 grid gap-3">
        {steps.map((step, index) => {
          const state = index < activeStep ? "done" : index === activeStep ? "current" : "waiting";
          return (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span
                aria-hidden
                className={`flex size-6 items-center justify-center rounded-full border text-xs font-semibold ${
                  state === "waiting"
                    ? "border-[var(--line)] text-[var(--text-muted)]"
                    : "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                }`}
              >
                {state === "done" ? "OK" : index + 1}
              </span>
              <span className={state === "current" ? "font-semibold" : "text-[var(--text-muted)]"}>
                {step}
                {state === "current" ? ", in progress" : state === "done" ? ", complete" : ""}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
