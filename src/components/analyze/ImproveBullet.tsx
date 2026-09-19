"use client";

import { useId, useState } from "react";
import { ErrorMessage } from "@/components/analyze/ErrorMessage";
import type { ImproveBullet as ImproveBulletResult } from "@/lib/schemas/analysis";
import { validateBullet } from "@/lib/validation";

interface ImproveBulletProps {
  jobDescription: string;
}

export function ImproveBullet({ jobDescription }: ImproveBulletProps) {
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();
  const [bullet, setBullet] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [result, setResult] = useState<ImproveBulletResult | null>(null);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = validateBullet(bullet);
    setFieldError(nextError);
    setCopied(false);

    if (nextError) {
      return;
    }

    setPending(true);
    setRequestError(null);

    try {
      const response = await fetch("/api/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: bullet.trim(), jobDescription }),
      });
      const payload = (await response.json().catch(() => null)) as
        | ImproveBulletResult
        | { error?: string }
        | null;

      if (!response.ok || !payload || !("improvedBullet" in payload)) {
        setResult(null);
        setRequestError(payload && "error" in payload && payload.error ? payload.error : "We could not improve this bullet right now.");
        return;
      }

      setResult(payload);
    } catch {
      setResult(null);
      setRequestError("We could not improve this bullet right now.");
    } finally {
      setPending(false);
    }
  }

  async function copyResult() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.improvedBullet);
      setCopied(true);
    } catch {
      setCopied(false);
      setRequestError("Copy failed. Select the improved bullet and copy it manually.");
    }
  }

  return (
    <section className="surface-panel overflow-hidden" aria-labelledby="improve-heading">
      <div className="grid gap-4 border-b border-[var(--line)] px-5 py-6 sm:px-7 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h2 id="improve-heading" className="text-3xl font-semibold tracking-[-0.04em]">
            Improve a CV bullet
          </h2>
        </div>
        <p className="max-w-[38rem] text-sm leading-6 text-[var(--text-muted)] lg:col-span-5">
          Rewrite one existing bullet for this role without inventing experience.
        </p>
      </div>
      <form className="grid gap-5 px-5 py-6 sm:px-7" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label htmlFor={inputId} className="font-semibold">
            Existing bullet
          </label>
          <p id={helpId} className="text-sm text-[var(--text-muted)]">
            Use text that already appears in your CV.
          </p>
          <textarea
            id={inputId}
            value={bullet}
            disabled={pending}
            rows={4}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? `${helpId} ${errorId}` : helpId}
            className="w-full rounded-[var(--radius-control)] border border-[var(--line-strong)] bg-[var(--background)] px-4 py-3 leading-7 disabled:cursor-not-allowed disabled:opacity-60"
            onChange={(event) => {
              setBullet(event.target.value);
              setCopied(false);
            }}
          />
          {fieldError ? (
            <p id={errorId} role="alert" className="text-sm font-medium text-[var(--danger)]">
              {fieldError}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="button-primary w-fit"
        >
          {pending ? "Improving bullet" : "Improve"}
        </button>
      </form>
      {requestError ? (
          <div className="px-5 pb-6 sm:px-7">
          <ErrorMessage>{requestError}</ErrorMessage>
        </div>
      ) : null}
      {result ? (
        <div className="border-t border-[var(--line)] bg-[var(--accent-soft)] px-5 py-6 sm:px-7">
          <p className="max-w-[58rem] text-lg font-semibold leading-8">{result.improvedBullet}</p>
          <p className="mt-3 max-w-[58rem] text-sm leading-6 text-[var(--text-muted)]">{result.rationale}</p>
          <button
            type="button"
            className="button-secondary mt-5 min-h-10 px-4 py-2 text-sm"
            onClick={copyResult}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
