import { NextResponse } from "next/server";
import { createAnalysisPrompt } from "@/lib/ai/prompts";
import { AiServiceError, requestStructuredAi } from "@/lib/ai/openrouter";
import { extractCvText, CvFileError } from "@/lib/pdf";
import { analysisSchema } from "@/lib/schemas/analysis";

export const runtime = "nodejs";

const MAX_JOB_DESCRIPTION_LENGTH = 20_000;

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
    const payload = await requestStructuredAi(createAnalysisPrompt(cvText, jobDescription.trim()));
    const parsed = analysisSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "We could not validate the AI response. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ analysis: parsed.data });
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
