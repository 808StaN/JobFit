# JobFit

## Project brief

JobFit helps frontend and software-engineering candidates compare one PDF CV with one job description and turn the evidence gap into a focused revision plan. I chose this idea because generic AI career tools often behave like chatbots and overstate a candidate's experience; JobFit instead constrains the model to structured, evidence-based recommendations and keeps missing experience missing.

## Live app

- Local: `http://localhost:3000`
- Production URL: https://jobfit-ai-app.vercel.app
- Source repository: https://github.com/808StaN/JobFit
- Analysis workspace: `/analyze`

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Use Node.js 22 or newer. Add at least one provider API key to `.env.local` before submitting an analysis.

Open `http://localhost:3000`, then go to **Analyze my fit**.

Required environment variables in `.env.local`:

```bash
GROQ_API_KEY=your_groq_key
GROQ_MODEL=openai/gpt-oss-20b
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODELS=google/gemma-4-26b-a4b-it:free,nex-agi/nex-n2.5-mini:free,google/gemma-4-31b-it:free
APP_URL=http://localhost:3000
```

API keys must stay server-side. Do not prefix them with `NEXT_PUBLIC_`. Groq is the primary provider. Every configured OpenRouter model must use its `:free` variant and is tried only when Groq is unavailable.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local Next.js server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest once |
| `npm run test:coverage` | Vitest with coverage |

## Architecture

```
CV PDF + job description
        |
        v
 /analyze form  ->  POST /api/analyze
        |                 |
        |                 +-- validate file and text
        |                 +-- extract PDF text
        |                 +-- Groq completion, then OpenRouter fallback
        |                 +-- Zod validation
        v
 structured analysis UI  ->  optional POST /api/improve-bullet
```

| Path | Role |
| --- | --- |
| `src/app/page.tsx` | Marketing landing and hero |
| `src/app/analyze/page.tsx` | Product workspace |
| `src/app/api/analyze/route.ts` | PDF extraction, prompt, Zod-checked analysis |
| `src/app/api/improve-bullet/route.ts` | Rewrites one existing CV bullet for the same role |
| `src/lib/ai/prompts.ts` | System instructions, untrusted-data delimiters, JSON contract |
| `src/lib/ai/groq.ts` | Groq structured JSON client |
| `src/lib/ai/openrouter.ts` | OpenRouter client, timeout, JSON cleanup |
| `src/lib/ai/provider.ts` | Groq-first provider orchestration and fallback |
| `src/lib/pdf.ts` | PDF type, size, signature, and text extraction |
| `src/lib/schemas/analysis.ts` | Zod contracts for analysis and bullet rewrite |
| `src/components/analyze/` | Accessible form, progress, errors, bullet rewrite |
| `src/components/analysis/` | Result presentation |

The landing page stays on `/`. The actual product lives on `/analyze` so the marketing story and the working tool can be reviewed separately.

## AI integration

JobFit uses Groq as its primary OpenAI-compatible provider and OpenRouter as a fallback from a Next.js Route Handler. The browser never receives either API key. CV and job-description text is sent to Groq first and to OpenRouter only if Groq cannot complete the request.

The analysis prompt asks the model to:

- treat CV and job-description text as untrusted reference data
- refuse instructions hidden in those documents
- avoid inventing skills, employers, metrics, or outcomes
- avoid predicting whether the candidate will be hired
- return JSON that matches `analysisSchema`

If Groq is unavailable, JobFit tries OpenRouter. If both providers fail, time out, or return invalid output, the API responds with a readable error and the UI stays on a safe error state.

The optional **Improve** action rewrites one existing bullet against the same job description. It can clarify language. It cannot add experience that the original bullet does not support.

## Failure behavior

| Situation | Result |
| --- | --- |
| No CV | Inline error: upload a PDF first |
| Empty job description | Inline error on the textarea |
| Non-PDF or invalid PDF | File error, analysis is not called |
| File over 5 MB | File error |
| Missing API key | HTTP 503, UI error state |
| Provider timeout or invalid JSON | HTTP 502/504, UI error state |

CV files are processed in memory for the current request. They are not written to disk or a database.

Visible failure behavior is verified by the analysis-workspace integration tests and the route-level recovery test. The UI renders inline validation, an API/provider fallback alert, and a recovery page with `Try again` and `Return home` actions instead of failing to a blank screen.

## Testing

```bash
npm test
npm run test:coverage
```

Coverage includes form validation, PDF rejection, schema fallback, API routes, the analysis workspace, results rendering, and the bullet rewrite flow. CI enforces a 50% minimum for statements, branches, functions, and lines.

Latest local verification on 2026-09-25: 86 passing tests; 73.40% statements, 68.57% branches, 76.66% functions, and 73.68% lines. The command output and critical-flow inventory are recorded in [`docs/test-results.md`](docs/test-results.md).

## Accessibility and performance

- Semantic headings, labels above inputs, visible focus, skip link
- `aria-live` progress and `role="alert"` errors
- Blue action and focus tokens are designed to retain contrast against white surfaces
- Mobile Lighthouse on September 24, 2026: `/` scored `90 / 100 / 100 / 100`; `/analyze` scored `89 / 100 / 100 / 100` for Performance, Accessibility, Best Practices, and SEO
- WAVE found `0` errors and `0` contrast errors on both audited routes after the process microcopy contrast was corrected
- Lighthouse and WAVE evidence live in `docs/audit-results.md`

## Deployment

See `docs/deployment-checklist.md`. The intended host is Vercel.

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Set `GROQ_API_KEY`, `GROQ_MODEL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODELS`, and `APP_URL`.
4. Deploy the production branch.
5. Confirm `/` and `/analyze` load, then run one real analysis.

Rollback: redeploy the previous production deployment from Vercel, or promote the last known-good commit on `main`.

## Known limitations

- PDF-only. Scanned image PDFs may have no extractable text.
- No account, history, or job-URL import.
- Requirement coverage is calculated from the extracted role requirements and evidence found in the CV. It is not a hiring prediction, and the AI classification of a requirement can still need human review.
- Free OpenRouter models can be rate-limited or slower than paid ones.
- The app is English-language in the UI and in the model prompt.

## Future improvements

- Import a job posting from a URL
- Saved analyses for signed-in users
- Side-by-side CV editor after the first review
- Stronger model routing with a paid fallback when the free model is unavailable
