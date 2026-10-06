# Design notes

The portfolio should read like a concise analyst's notebook: a clear introduction, selected work with analytical previews, and case studies that explain how a question became a useful result. Employers should be able to scan the home page quickly and explore the evidence on project pages.

## Presentation

- Keep the background light, the typography readable, and the accent color restrained.
- Use whitespace and fine rules to separate information. Reserve charts and color for content that benefits from them.
- Give each project a clear title, question or summary, tools, and a link to a full case study.
- Make résumé, credentials, background, and contact reachable without burying project work.
- Preserve a comfortable mobile reading order and visible keyboard focus states.

The user's primary presentation reference is [Eugene Lee's portfolio](https://eugeneyjlee.github.io/portfolio/), with [8jun](https://8jun.github.io/) as a reference for restraint. These two sites were inaccessible during the initial build, so their visual treatment has not been verified. The accessible [Dominik Haitz portfolio](https://dhaitz.github.io/) and [Siddharth site](https://www.siddharth.info/) informed the emphasis on project summaries and deeper explanations. No reference-site assets or personal content are reused.

This first direction uses warm off-white, muted blue, fine rules, system sans-serif text, and Georgia display headings. Lightweight SVG illustrations suggest an analytical notebook. Replace illustrative charts with your actual work as projects are added.

## Page roles

| Page | Job |
| --- | --- |
| Home | Establish the analyst's focus and lead with selected projects |
| Projects | Let visitors scan the body of work and choose a case study |
| Case study | Explain the question, data, method, findings, decisions, and limits |
| About | Give context on the person, experience, and working approach |
| Credentials | Show verifiable education and qualifications |
| Writing | Expand on projects, analytical decisions, and lessons learned |
| Résumé | Offer a readable overview and résumé downloads |
| Contact | Provide direct ways to start a professional conversation |

## Technical choices

Eleventy builds the content into plain HTML. Markdown is the authoring format; JSON stores shared profile and credential data; Nunjucks templates provide consistent layouts. GitHub Actions builds and publishes to GitHub Pages. The visitor does not need a JavaScript framework to read the content or follow links.

Keep future additions proportional to the need. A new chart or article does not require a CMS. Link to hosted interactive dashboards when they help a case study; avoid placing several heavyweight embeds on the home page. A contact form would require a separate service and is not part of this starter.
