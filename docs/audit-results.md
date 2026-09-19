# Audit results

These notes capture the accessibility and performance baseline for the JobFit MVP. Re-run the tools against the deployed URL after Vercel is connected and replace the local figures if they change.

## Accessibility

Method: keyboard walkthrough plus axe DevTools / WAVE on `/` and `/analyze`.

Findings addressed before this document:

1. **Button contrast.** Light mint-on-white text would have failed in dark mode. Primary actions now use `--accent-button: #05664f` and `--accent-button-text: #f6fffb` in both themes.
2. **Missing labels.** File input and job description use visible labels, helper text, and `aria-describedby` for errors.
3. **Status updates.** Analysis progress uses `role="status"` and `aria-live="polite"` instead of a spinner with no text.
4. **Focus.** `:focus-visible` is a 3px accent outline on interactive controls. A skip link moves keyboard users to `#main`.

Recheck after deploy:

- WAVE: 0 errors on `/` and `/analyze`
- axe: no WCAG AA contrast, name, or label violations on the analyze form

## Lighthouse

Target: 85+ on mobile and desktop, with 90+ as the stretch goal.

Local production build checklist:

```bash
npm run build
npm run start
```

Then run Chrome Lighthouse against `http://localhost:3000` and `http://localhost:3000/analyze` in mobile mode.

Expected strengths: no client-side LLM SDK, a client-only WebGPU hero with a CSS fallback, and CSS variables controlling the visual system.

Attach screenshots from the live Vercel URL here after the first production audit.

## One concrete improvement from the audit

The current palette uses one consistent light theme. Medium blue action and focus tokens retain sufficient contrast against white while the surrounding surfaces stay pale and low-noise.
