# Deployment checklist

Project: JobFit  
Environment: production (Vercel)  
Owner: 808StaN

Status: ready for submission; production flow, automated verification, mobile Lighthouse, and WAVE audits passed

## Before deploy

- [x] `npm install` completes on a clean tree
- [x] `npm test` is the required verification command
- [x] `npm run build` is the production compile command
- [x] `.env.example` lists Groq, OpenRouter, and application environment variables
- [x] No secret is committed. `.env*` is gitignored except `.env.example`
- [x] API routes keep Groq and OpenRouter keys on the server
- [x] PDF upload is limited to 5 MB and application/pdf
- [x] Invalid model JSON is rejected by Zod before it reaches the UI
- [x] `/` is the landing page and `/analyze` is the working product
- [x] Rollback path is documented: redeploy previous Vercel deployment or previous `main` commit
- [x] GitHub Actions verifies lint, coverage thresholds, and production build on `main` and pull requests

## Vercel setup

1. Create a GitHub repository and push `main`.
2. Import the repo in Vercel as a Next.js project.
3. Add environment variables for Production and Preview:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODELS`
   - `GROQ_API_KEY`
   - `GROQ_MODEL`
   - `APP_URL` (the production origin, for example `https://jobfit.vercel.app`)
4. Deploy.

## After deploy

- [x] Open `/` and confirm the hero visual and Analyze my fit CTA
- [x] Confirm keyboard access through CV upload, job description, and submit (`AnalyzeWorkspace.test.tsx`)
- [x] Submit without a file and confirm inline errors (`AnalyzeWorkspace.test.tsx` and production API verification)
- [x] Submit a real text-based PDF plus a job description and confirm a structured result
- [x] Trigger Improve on one existing bullet
- [x] Confirm a missing-key or provider error renders the fallback message instead of a blank page (provider and workspace tests)
- [x] Confirm route-level error recovery renders retry and home actions instead of a blank page (`src/app/error.test.tsx`)
- [x] Paste the live URL into README.md
- [x] Paste the GitHub repository URL into the portfolio entry
- [x] Run mobile Lighthouse and WAVE against the production URL, then record the results in `docs/audit-results.md`

## Monitoring

Vercel deployment events and runtime logs are the monitoring surface for this MVP. Check the failed `/api/analyze` request in Vercel logs if a user reports a 5xx. Do not log CV contents.

Production verification on 2026-09-22:

- `POST /api/analyze` without a file returned `400` with a safe validation message.
- `POST /api/analyze` with a public text PDF returned `200` with a validated analysis object.
- `POST /api/improve-bullet` returned `200` with a validated rewrite object.

Audit evidence on 2026-09-24 and 2026-09-25:

- Mobile Lighthouse: `/` scored `90 / 100 / 100 / 100`; `/analyze` scored `89 / 100 / 100 / 100` for Performance, Accessibility, Best Practices, and SEO.
- WAVE: both `/` and `/analyze` had `0` errors and `0` contrast errors. The corrected `/` audit reached an AIM score of `9.9 / 10`.

Final verification on 2026-09-25:

- `npm run test:coverage`: 21 test files and 86 tests passed; all coverage metrics exceeded the 50% threshold.
- `npm run lint`: passed.
- `npm run build`: passed with all application routes generated successfully.

## Rollback

If a release is broken:

1. In Vercel, open the project Deployments list.
2. Promote the last successful production deployment, or redeploy the previous git SHA from `main`.
3. Confirm `/analyze` returns a safe error or a valid analysis before announcing recovery.

Sign-off: 808StaN, 2026-09-25. Production URL, rollback path, monitoring, audits, error recovery, and automated verification are documented and ready for submission.
