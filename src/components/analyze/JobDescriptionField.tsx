"use client";

import { useId } from "react";
import { MAX_JOB_DESCRIPTION_LENGTH } from "@/lib/validation";

interface JobDescriptionFieldProps {
  value: string;
  error?: string | null;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function JobDescriptionField({ value, error, disabled, onChange }: JobDescriptionFieldProps) {
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();
  const countId = useId();

  return (
    <div className="grid gap-3">
      <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">02 / Target role</p>
      <label htmlFor={inputId} className="text-lg font-semibold tracking-[-0.02em]">
        Job description
      </label>
      <p id={helpId} className="-mt-1 text-sm leading-6 text-[var(--text-muted)]">
        Paste the full posting, including required and preferred skills.
      </p>
      <textarea
        id={inputId}
        name="jobDescription"
        value={value}
        disabled={disabled}
        rows={12}
        maxLength={MAX_JOB_DESCRIPTION_LENGTH}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${helpId} ${countId} ${errorId}` : `${helpId} ${countId}`}
        className="mt-2 min-h-64 w-full resize-y rounded-[var(--radius-control)] border border-[var(--line-strong)] bg-[var(--background)] px-4 py-3 leading-7 text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
        onChange={(event) => onChange(event.target.value)}
      />
      <p id={countId} className="text-right font-mono text-xs text-[var(--text-muted)]">
        {value.length.toLocaleString("en-US")} of {MAX_JOB_DESCRIPTION_LENGTH.toLocaleString("en-US")} characters
      </p>
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
