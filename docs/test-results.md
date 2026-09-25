# Test results

Final local verification was run on September 25, 2026 with Node.js 24.21.0.

## Command

```bash
npm run test:coverage
```

## Output

```text
Test Files  21 passed (21)
Tests       86 passed (86)

Coverage summary
Statements : 73.40% (563/767)
Branches   : 68.57% (419/611)
Functions  : 76.66% (115/150)
Lines      : 73.68% (546/741)
```

The configured threshold is 50% for statements, branches, functions, and lines. All four metrics pass.

## Critical flow evidence

- `AnalyzeWorkspace.test.tsx`: missing-input validation, keyboard traversal, loading state, successful structured analysis, safe API failure, and replacement-analysis behavior.
- `CvUpload.test.tsx` and `JobDescriptionField.test.tsx`: file handling, invalid input, text entry, and character counting.
- `ImproveBullet.test.tsx`: existing-bullet validation, AI rewrite result, and clipboard action.
- `error.test.tsx`: route-level retry and return-home recovery actions.
- API and provider tests: malformed model output, schema validation, missing configuration, Groq-to-OpenRouter fallback, timeouts, and safe error responses.
- UI tests: analysis results, progress announcements, navigation, custom cursor behavior, and accessible action controls.
