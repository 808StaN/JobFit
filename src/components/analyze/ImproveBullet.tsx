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
    <section className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-6" aria-labelledby="improve-heading">
      <h2 id="improve-heading" className="text-2xl font-semibold tracking-tight">
        Improve a CV bullet
      </h2>
      <p className="mt-2 max-w-[65ch] text-[var(--text-muted)]">
        Paste one existing bullet. JobFit can rewrite it for this role, but it will not invent new experience.
      </p>
      <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
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
            className="w-full rounded-[12px] border border-[var(--line)] bg-[var(--background)] px-4 py-3 leading-7"
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
          className="w-fit rounded-[12px] bg-[var(--accent-button)] px-4 py-2.5 font-semibold text-[var(--accent-button-text)] transition hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Improving bullet" : "Improve"}
        </button>
      </form>
      {requestError ? (
        <div className="mt-4">
          <ErrorMessage>{requestError}</ErrorMessage>
        </div>
      ) : null}
      {result ? (
        <div className="mt-5 rounded-[12px] bg-[var(--surface-muted)] p-4">
          <p className="font-semibold">Suggested rewrite</p>
          <p className="mt-2 leading-7">{result.improvedBullet}</p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">{result.rationale}</p>
          <button
            type="button"
            className="mt-4 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--background)] active:scale-[0.98]"
            onClick={copyResult}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
