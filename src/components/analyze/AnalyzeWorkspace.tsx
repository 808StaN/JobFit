"use client";

import { useMemo, useState } from "react";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { AnalysisProgress } from "@/components/analyze/AnalysisProgress";
import { CvUpload } from "@/components/analyze/CvUpload";
import { ErrorMessage } from "@/components/analyze/ErrorMessage";
import { ImproveBullet } from "@/components/analyze/ImproveBullet";
import { JobDescriptionField } from "@/components/analyze/JobDescriptionField";
import type { Analysis } from "@/lib/schemas/analysis";
import { validateCvFile, validateJobDescription } from "@/lib/validation";

interface AnalyzeResponse {
  analysis?: Analysis;
  error?: string;
}

export function AnalyzeWorkspace() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [cvError, setCvError] = useState<string | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [progressStep, setProgressStep] = useState(0);

  const canSubmit = useMemo(() => !pending, [pending]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextCvError = validateCvFile(cvFile);
    const nextJobError = validateJobDescription(jobDescription);
    setCvError(nextCvError);
    setJobError(nextJobError);
    setRequestError(null);

    if (nextCvError || nextJobError || !cvFile) {
      return;
    }

    const body = new FormData();
    body.append("cv", cvFile);
    body.append("jobDescription", jobDescription.trim());

    setPending(true);
    setAnalysis(null);
    setProgressStep(0);
    const timer = window.setInterval(() => {
      setProgressStep((step) => Math.min(step + 1, 3));
    }, 900);

    try {
      const response = await fetch("/api/analyze", { method: "POST", body });
      const payload = (await response.json().catch(() => null)) as AnalyzeResponse | null;

      if (!response.ok || !payload?.analysis) {
        setRequestError(payload?.error ?? "We could not analyze your CV right now. Please try again.");
        return;
      }

      setAnalysis(payload.analysis);
    } catch {
      setRequestError("We could not analyze your CV right now. Please try again.");
    } finally {
      window.clearInterval(timer);
      setPending(false);
    }
  }

  return (
    <div className="grid gap-10">
      <form className="grid gap-6" onSubmit={onSubmit} noValidate>
        <CvUpload
          file={cvFile}
          error={cvError}
          disabled={pending}
          onFileChange={(file) => {
            setCvFile(file);
            setCvError(null);
          }}
        />
        <JobDescriptionField
          value={jobDescription}
          error={jobError}
          disabled={pending}
          onChange={(value) => {
            setJobDescription(value);
            setJobError(null);
          }}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-fit rounded-[12px] bg-[var(--accent-button)] px-5 py-3 font-semibold text-[var(--accent-button-text)] transition hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Analyzing" : "Analyze my fit"}
        </button>
      </form>

      {pending ? <AnalysisProgress activeStep={progressStep} /> : null}
      {requestError ? <ErrorMessage>{requestError}</ErrorMessage> : null}
      {analysis ? (
        <div className="grid gap-10">
          <AnalysisResults analysis={analysis} />
          <ImproveBullet jobDescription={jobDescription} />
        </div>
      ) : null}
    </div>
  );
}
