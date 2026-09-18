# Reflection

The hardest part was not calling an LLM. It was keeping the model from becoming a chatbot that invents experience. The useful product is a constrained comparison: PDF text in, job description in, Zod-checked object out. Once that contract existed, the UI had somewhere honest to land. Invalid JSON, empty PDFs, and missing keys all had to fail in the same calm way or the analysis screen would look more confident than the data.

Next time I would freeze the result schema before writing any React. The first pass of the workspace wanted extra sections because they sounded complete. The capstone is stronger when matched skills, gaps, suggestions, and an action plan are reliable, and when Improve is clearly a rewrite of existing text. I would also put a real PDF fixture in CI so extraction is tested beyond signature checks.

What surprised me was how much accessibility work improved the product copy. Writing a progress status that a screen reader can announce forced the loading state to explain the work instead of hiding it behind a spinner. The same constraint helped the score disclaimer: if the live region and the heading cannot say "you will get hired," the model prompt should not say it either.
