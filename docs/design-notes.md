# Design notes

The portfolio should read like a concise analyst's notebook: a clear introduction, selected work with analytical previews, and case studies that explain how a question became a useful result.

## Presentation

- Keep the warm-white background, readable system typography, and sparse accents.
- Use whitespace, fine rules, numbered labels, and monospaced metadata for an editorial data feel.
- Lead project cards with the question, result, or decision—not only the tool.
- Keep résumé, credentials, background, and contact easy to reach.
- Preserve mobile reading order, keyboard focus, reduced-motion support, and print styles.

The primary reference is [Eugene Lee's portfolio](https://eugeneyjlee.github.io/portfolio/): its asymmetric introduction, immediate profile facts, lowercase titles, quiet metadata, spacing, and visual cards inform the direction. This project uses original analytic glyphs, charts, code, and content.

[Dominik Haitz's portfolio](https://dhaitz.github.io/) informs direct project summaries and calls to action. [Siddharth Dayama's site](https://www.siddharth.info/) reinforces showing real deliverables and employer context. [8jun](https://8jun.github.io/) is a reminder to stay concise.

## Home-page hierarchy

1. Split identity/value introduction with four profile facts.
2. Three featured case studies.
3. Employer-facing experience with proof points.
4. Four-step working approach and credentials link.
5. Recent writing.
6. Contact invitation and footer.

## Technical choices

Astro renders the site to plain HTML. Markdown contains project/article bodies, JSON stores shared data, and typed content schemas catch bad frontmatter. One global CSS file preserves the visual system. A tiny vanilla script progressively enhances project filtering; the content remains usable without JavaScript.

Python is a maintenance layer, not a production server. It validates the content model and creates draft files from templates. GitHub Actions runs Python tests and Astro checks before publishing `site/dist/` to Pages.

Avoid adding a client framework, CMS, database, or heavy embedded dashboard unless a real requirement justifies it. Link to interactive work when helpful and keep the home page lightweight.
