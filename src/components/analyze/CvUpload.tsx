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
    <div className="grid gap-3">
      <label htmlFor={inputId} className="text-lg font-semibold tracking-[-0.02em]">
        CV
      </label>
      <p id={helpId} className="-mt-1 text-sm leading-6 text-[var(--text-muted)]">
        PDF only, maximum 5 MB. You can replace the file at any time.
      </p>
      <div
        className="cv-dropzone mt-2 min-h-64 rounded-[var(--radius-control)] border border-dashed p-4 transition-colors"
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
          <div className="flex min-h-56 flex-col justify-between gap-6 p-2">
            <p className="flex min-w-0 flex-col items-start gap-4 font-medium">
              <span className="grid size-12 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <IconFileTypePdf size={24} stroke={1.8} aria-hidden />
              </span>
              <span className="max-w-full truncate">{file.name}</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="button-secondary min-h-10 flex-1 px-3 py-2 text-sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Replace
              </button>
              <button
                type="button"
                className="button-secondary min-h-10 flex-1 px-3 py-2 text-sm text-[var(--danger)]"
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
            className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-control)] p-5 text-center transition hover:bg-[var(--surface)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            <span className="grid size-12 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <IconUpload size={24} stroke={1.8} aria-hidden />
            </span>
            <span className="max-w-52 font-semibold leading-6">Drop your PDF here, or choose a file</span>
            <span className="text-xs text-[var(--text-muted)]">Text-based PDF works best</span>
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
