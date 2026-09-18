"use client";

import { IconFileTypePdf, IconTrash, IconUpload } from "@tabler/icons-react";
import { useId, useRef } from "react";

interface CvUploadProps {
  file: File | null;
  error?: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

export function CvUpload({ file, error, disabled, onFileChange }: CvUploadProps) {
  const inputId = useId();
  const errorId = useId();
  const helpId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function assignFile(next: File | null) {
    onFileChange(next);
    if (!next && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="font-semibold">
        CV
      </label>
      <p id={helpId} className="text-sm text-[var(--text-muted)]">
        PDF only, maximum 5 MB. You can replace the file at any time.
      </p>
      <div
        className="rounded-[16px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-5"
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (disabled) {
            return;
          }
          const dropped = event.dataTransfer.files[0];
          if (dropped) {
            assignFile(dropped);
          }
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          name="cv"
          type="file"
          accept="application/pdf,.pdf"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${helpId} ${errorId}` : helpId}
          className="sr-only"
          onChange={(event) => {
            assignFile(event.target.files?.[0] ?? null);
          }}
        />
        {file ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex min-w-0 items-center gap-2 font-medium">
              <IconFileTypePdf size={22} stroke={1.8} className="shrink-0 text-[var(--accent)]" aria-hidden />
              <span className="truncate">{file.name}</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-[12px] border border-[var(--line)] px-3 py-2 text-sm font-semibold transition hover:bg-[var(--surface-muted)] active:scale-[0.98]"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Replace
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-[12px] border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--surface-muted)] active:scale-[0.98]"
                onClick={() => assignFile(null)}
                disabled={disabled}
              >
                <IconTrash size={16} stroke={1.8} aria-hidden />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full flex-col items-center gap-2 rounded-[12px] py-6 text-center transition hover:bg-[var(--surface-muted)] active:scale-[0.99]"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            <IconUpload size={28} stroke={1.8} className="text-[var(--accent)]" aria-hidden />
            <span className="font-semibold">Drop your PDF here, or choose a file</span>
          </button>
        )}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
