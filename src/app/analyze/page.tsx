import type { Metadata } from "next";
import { AnalyzeWorkspace } from "@/components/analyze/AnalyzeWorkspace";

export const metadata: Metadata = {
  title: "Analyze your CV",
  description: "Upload a PDF CV, paste a job description, and generate a structured fit review.",
};

export default function AnalyzePage() {
  return (
    <main id="main" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Analyze your CV</h1>
        <p className="mt-3 max-w-[65ch] leading-7 text-[var(--text-muted)]">
          Add a PDF and the job description. The result is an evidence-based review, not a hiring prediction.
        </p>
      </div>
      <div className="mt-10">
        <AnalyzeWorkspace />
      </div>
    </main>
  );
}
