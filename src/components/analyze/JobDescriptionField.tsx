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
    <div className="grid gap-2">
      <label htmlFor={inputId} className="font-semibold">
        Job description
      </label>
      <p id={helpId} className="text-sm text-[var(--text-muted)]">
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
        className="w-full resize-y rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 leading-7 text-[var(--text)]"
        onChange={(event) => onChange(event.target.value)}
      />
      <p id={countId} className="text-sm text-[var(--text-muted)]">
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
