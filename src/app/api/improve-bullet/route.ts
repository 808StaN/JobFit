import { NextResponse } from "next/server";
import { improveBulletOutputFormat } from "@/lib/ai/output-formats";
import { AiServiceError, requestStructuredAi } from "@/lib/ai/provider";
import { createImproveBulletPrompt } from "@/lib/ai/prompts";
import { improveBulletSchema } from "@/lib/schemas/analysis";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BULLET_LENGTH = 1_000;
const MAX_JOB_DESCRIPTION_LENGTH = 20_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bullet?: unknown; jobDescription?: unknown };
    const bullet = typeof body.bullet === "string" ? body.bullet.trim() : "";
    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";

    if (!bullet) {
      return NextResponse.json({ error: "Add an existing CV bullet to improve it." }, { status: 400 });
    }

    if (!jobDescription) {
      return NextResponse.json({ error: "Add a job description before improving a CV bullet." }, { status: 400 });
    }

    if (bullet.length > MAX_BULLET_LENGTH || jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: "One of the submitted fields is too long." }, { status: 400 });
    }

    const payload = await requestStructuredAi(
      createImproveBulletPrompt(bullet, jobDescription),
      improveBulletOutputFormat,
    );
    const parsed = improveBulletSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "We could not validate the AI response. Please try again." }, { status: 502 });
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    if (error instanceof AiServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "We could not improve this bullet right now. Please try again." }, { status: 500 });
  }
}
