export function ErrorMessage({ children }: { children: string }) {
  return (
    <p role="alert" className="rounded-[12px] border border-[var(--danger)]/30 bg-[color-mix(in_srgb,var(--danger)_10%,var(--surface))] px-4 py-3 text-sm font-medium text-[var(--danger)]">
      {children}
    </p>
  );
}
