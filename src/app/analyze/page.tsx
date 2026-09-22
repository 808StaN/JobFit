import type { Metadata } from "next";
import { AnalyzeWorkspace } from "@/components/analyze/AnalyzeWorkspace";
import { AmbientSectionShader } from "@/components/visual/AmbientSectionShader";

export const metadata: Metadata = {
  title: "Analyze your CV",
  description: "Upload a PDF CV, paste a job description, and generate a structured fit review.",
  alternates: { canonical: "/analyze" },
};

export default function AnalyzePage() {
  return (
    <main id="main" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[74rem] overflow-hidden sm:h-[66rem] lg:h-[62rem]">
        <AmbientSectionShader />
      </div>
      <div className="page-shell relative z-10 pb-24 pt-28 sm:pb-32 sm:pt-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="max-w-[12ch] text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.065em] sm:text-6xl">
              Review one application.
            </h1>
          </div>
          <p className="max-w-[36rem] text-pretty leading-7 text-[var(--text-muted)] lg:col-span-4">
            Add a PDF and the full job description. You will get an evidence-led report with clear priorities, not a hiring prediction.
          </p>
        </div>
        <div className="mt-10 sm:mt-12">
          <AnalyzeWorkspace />
        </div>
      </div>
    </main>
  );
}
