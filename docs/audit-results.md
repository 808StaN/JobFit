# Audit results

Production audit evidence was captured on September 24, 2026. The screenshots use the `jobfit-ai-app.vercel.app` Vercel alias; its content matched the canonical production URL, `https://jobfit-one-alpha.vercel.app`, at the time of the audit. The canonical URL is confirmed by the production `robots.txt` and sitemap.

## Accessibility

Method: WAVE Evaluation Tool on the deployed `/` and `/analyze` routes. WAVE satisfies the required accessibility-audit method; axe was not run separately.

Implementation checks:

1. **Button contrast.** Primary actions and focus indicators use the blue `--accent-button` token against white surfaces.
2. **Missing labels.** File input and job description use visible labels, helper text, and `aria-describedby` for errors.
3. **Status updates.** Analysis progress uses `role="status"` and `aria-live="polite"` instead of a spinner with no text.
4. **Focus.** `:focus-visible` is a 3px accent outline on interactive controls. A skip link moves keyboard users to `#main`.

| Tool | Route | Errors | Contrast errors | Alerts | AIM score | Evidence |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| WAVE | `/` | 0 | 6 | 5 | 7.8 / 10 | [`wave_mainPage.png`](./wave_mainPage.png) |
| WAVE | `/analyze` | 0 | 0 | 1 | 10 / 10 | [`wave_analyze.png`](./wave_analyze.png) |

### Known accessibility limitation

The WAVE scan of `/` reports six very-low-contrast findings in the hero. They are low-emphasis supporting text over the light animated visual. The current visual treatment is intentional and remains readable in the manually reviewed rendered page, but this is not equivalent to passing WCAG contrast requirements. The issue is recorded rather than hidden or reported as a clean accessibility result. The `/analyze` route has no WAVE errors or contrast errors.

WAVE also reports non-blocking advisory alerts: five on `/` and one redundant-link alert on `/analyze`. They do not represent WAVE errors.

## Lighthouse

Target: 85+ on mobile and desktop, with 90+ as the stretch goal. The attached evidence records mobile audits; no desktop screenshot is included in this audit set.

Local production build command:

```bash
npm run build
npm run start
```

Chrome Lighthouse, mobile mode, deployed application:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Speed Index | Evidence |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 90 | 100 | 100 | 100 | 0.9 s | 1.7 s | 410 ms | 0 | 1.3 s | [`lighthouse_mobile_mainPage.png`](./lighthouse_mobile_mainPage.png) |
| `/analyze` | 89 | 100 | 100 | 100 | 0.9 s | 2.1 s | 420 ms | 0 | 1.4 s | [`lighthouse_mobile_analyze.png`](./lighthouse_mobile_analyze.png) |

Both mobile Performance scores exceed the 85 acceptance threshold. The remaining performance concern is Total Blocking Time, which is 410 ms on `/` and 420 ms on `/analyze`.

Expected strengths: no client-side LLM SDK, client-only WebGPU visuals with CSS fallbacks, and CSS variables controlling the visual system.

## One concrete improvement from the audit

The visual runtime was simplified before the final Lighthouse pass: unnecessary hero layers were removed and Next.js now optimizes imports from `shaders/react`. The recorded mobile Performance scores are 90 on `/` and 89 on `/analyze` while preserving the existing visual design.
