"use client";

import { useState } from "react";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { AnalysisProgress } from "@/components/analyze/AnalysisProgress";
import { CvUpload } from "@/components/analyze/CvUpload";
import { ErrorMessage } from "@/components/analyze/ErrorMessage";
import { ImproveBullet } from "@/components/analyze/ImproveBullet";
import { JobDescriptionField } from "@/components/analyze/JobDescriptionField";
import { GravityButton } from "@/components/ui/GravityLink";
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
  const [analyzedJobDescription, setAnalyzedJobDescription] = useState("");

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
    const submittedJobDescription = jobDescription.trim();
    body.append("jobDescription", submittedJobDescription);

    setPending(true);

    try {
      const response = await fetch("/api/analyze", { method: "POST", body });
      const payload = (await response.json().catch(() => null)) as AnalyzeResponse | null;

      if (!response.ok || !payload?.analysis) {
        setRequestError(payload?.error ?? "We could not analyze your CV right now. Please try again.");
        return;
      }

      setAnalysis(payload.analysis);
      setAnalyzedJobDescription(submittedJobDescription);
    } catch {
      setRequestError("We could not analyze your CV right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-12 sm:gap-16">
      <section aria-labelledby="inputs-heading" className="analysis-inputs-panel overflow-hidden">
        <div className="analysis-inputs-header flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 id="inputs-heading" className="text-xl font-semibold tracking-[-0.025em]">Compare your documents</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)]">PDF up to 5 MB · 20,000 characters</p>
        </div>

        <form className="grid" onSubmit={onSubmit} noValidate>
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="border-b border-[var(--line)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <CvUpload
                file={cvFile}
                error={cvError}
                disabled={pending}
                onFileChange={(file) => {
                  setCvFile(file);
                  setCvError(null);
                }}
              />
            </div>
            <div className="p-5 sm:p-7">
              <JobDescriptionField
                value={jobDescription}
                error={jobError}
                disabled={pending}
                onChange={(value) => {
                  setJobDescription(value);
                  setJobError(null);
                }}
              />
            </div>
          </div>
          <div className="analysis-action-bar flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="max-w-xl text-sm leading-6 text-[var(--text-muted)]">
              The result measures evidence in this CV, not your overall suitability or hiring odds.
            </p>
            <GravityButton
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto"
              text={pending ? "Analyzing" : analysis ? "Run a new review" : "Analyze my fit"}
              variant="primary"
              icon="arrow-right"
              sizing={{ paddingX: 24, paddingY: 14, borderRadius: 14, fontSize: 14 }}
              colors={{
                background: "var(--accent-button)",
                backgroundHover: "var(--accent-button)",
                border: "rgba(255, 255, 255, 0.46)",
                text: "#ffffff",
                shadow: "rgba(47, 118, 181, 0.3)",
              }}
            />
          </div>
        </form>
      </section>

      {pending ? <AnalysisProgress hasPreviousResult={Boolean(analysis)} /> : null}
      {requestError ? <ErrorMessage>{requestError}</ErrorMessage> : null}
      {analysis ? (
        <div className="grid gap-16">
          <AnalysisResults analysis={analysis} />
          <ImproveBullet jobDescription={analyzedJobDescription} />
        </div>
      ) : null}
    </div>
  );
}
