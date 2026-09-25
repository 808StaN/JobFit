# Audit results

Production audit evidence was captured on September 24, 2026, and the corrected home-page WAVE result was captured on September 25, 2026. The screenshots use the `jobfit-ai-app.vercel.app` Vercel alias; its content matched the canonical production URL, `https://jobfit-one-alpha.vercel.app`, at the time of the audit. The canonical URL is confirmed by the production `robots.txt` and sitemap.

## Accessibility

Method: WAVE Evaluation Tool on the deployed `/` and `/analyze` routes. WAVE satisfies the required accessibility-audit method; axe was not run separately.

Implementation checks:

1. **Button contrast.** Primary actions and focus indicators use the blue `--accent-button` token against white surfaces.
2. **Missing labels.** File input and job description use visible labels, helper text, and `aria-describedby` for errors.
3. **Status updates.** Analysis progress uses `role="status"` and `aria-live="polite"` instead of a spinner with no text.
4. **Focus.** `:focus-visible` is a 3px accent outline on interactive controls. A skip link moves keyboard users to `#main`.

| Tool | Route | Errors | Contrast errors | Alerts | AIM score | Evidence |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| WAVE | `/` | 0 | 0 | 5 | 9.9 / 10 | [`wave_mainPage.png`](./wave_mainPage.png) |
| WAVE | `/analyze` | 0 | 0 | 1 | 10 / 10 | [`wave_analyze.png`](./wave_analyze.png) |

### Alert review

The remaining WAVE items are advisory alerts rather than detected WCAG errors. On `/`, two possible-heading alerts identify prominent display text inside illustrative content, two redundant-link alerts reflect repeated navigation destinations, and one very-small-text alert identifies a short decorative status label. `/analyze` reports one redundant-link alert. The pages retain semantic section headings, accessible link names, keyboard access, and `0` WAVE contrast errors.

## Lighthouse

Target: 85+ Performance, with 90+ as the stretch goal and mobile emphasized by the brief. The attached evidence records mobile audits.

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

The initial WAVE scan found six low-contrast microcopy labels in the process illustration. Those six labels now use a scoped darker blue (`#174260`) without changing the shader, layout, or global palette. The repeat audit improved `/` from six contrast errors and an AIM score of 7.8 to zero contrast errors and an AIM score of 9.9.
