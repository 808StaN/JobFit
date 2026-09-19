import { NextResponse } from "next/server";
import { analysisOutputFormat } from "@/lib/ai/output-formats";
import { createAnalysisPrompt, createRepairAnalysisPrompt } from "@/lib/ai/prompts";
import { AiServiceError, isRetryableAiOutputError, requestStructuredAi } from "@/lib/ai/provider";
import { extractCvText, CvFileError } from "@/lib/pdf";
import { formatAnalysisIssues, parseAnalysis } from "@/lib/schemas/normalize";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_JOB_DESCRIPTION_LENGTH = 20_000;

async function analyzeWithRetry(cvText: string, jobDescription: string) {
  let payload: unknown;

  try {
    payload = await requestStructuredAi(createAnalysisPrompt(cvText, jobDescription), analysisOutputFormat);
  } catch (error) {
    if (!isRetryableAiOutputError(error)) {
      throw error;
    }

    console.warn("[analyze] Retrying an invalid provider response", {
      cvLength: cvText.length,
      jobDescriptionLength: jobDescription.length,
    });
    payload = await requestStructuredAi(
      createRepairAnalysisPrompt(cvText, jobDescription, error.message),
      analysisOutputFormat,
    );
    const retryResult = parseAnalysis(payload);
    if (retryResult.success) {
      return retryResult.data;
    }

    console.warn("[analyze] Retry response failed validation", {
      cvLength: cvText.length,
      jobDescriptionLength: jobDescription.length,
      issues: formatAnalysisIssues(retryResult),
    });
    return null;
  }

  const firstPass = parseAnalysis(payload);
  if (firstPass.success) {
    return firstPass.data;
  }

  const issues = formatAnalysisIssues(firstPass);
  console.warn("[analyze] Retrying a response that failed validation", {
    cvLength: cvText.length,
    jobDescriptionLength: jobDescription.length,
    issues,
  });
  const repaired = await requestStructuredAi(
    createRepairAnalysisPrompt(cvText, jobDescription, issues, payload),
    analysisOutputFormat,
  );
  const secondPass = parseAnalysis(repaired);
  if (secondPass.success) {
    return secondPass.data;
  }

  console.warn("[analyze] Retry response also failed validation", {
    cvLength: cvText.length,
    jobDescriptionLength: jobDescription.length,
    issues: formatAnalysisIssues(secondPass),
  });
  return null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const cv = formData.get("cv");
    const jobDescription = formData.get("jobDescription");

    if (!(cv instanceof File)) {
      return NextResponse.json({ error: "Please upload your CV first." }, { status: 400 });
    }

    if (typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json({ error: "Please provide a job description." }, { status: 400 });
    }

    if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: "The job description is too long. Maximum size: 20,000 characters." }, { status: 400 });
    }

    const cvText = await extractCvText(cv);
    const analysis = await analyzeWithRetry(cvText, jobDescription.trim());

    if (!analysis) {
      return NextResponse.json(
        { error: "We could not validate the AI response. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    if (error instanceof CvFileError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof AiServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "We could not analyze your CV right now. Please try again." }, { status: 500 });
  }
}
