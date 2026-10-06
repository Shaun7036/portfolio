# Design notes

The portfolio should read like a concise analyst's notebook: a clear introduction, selected work with analytical previews, and case studies that explain how a question became a useful result. Employers should be able to scan the home page quickly and explore the evidence on project pages.

## Presentation

- Keep the background warm white, the typography sans-serif and readable, and the accent colors sparse.
- Use whitespace, fine rules, numbered labels, and monospaced metadata to create an editorial data feel without making the site resemble a dashboard.
- Give each project a clear title, question or summary, tools, and a link to a full case study.
- Make résumé, credentials, background, and contact reachable without burying project work.
- Preserve a comfortable mobile reading order and visible keyboard focus states.

The primary presentation reference is [Eugene Lee's portfolio](https://eugeneyjlee.github.io/portfolio/). Its useful ideas are the asymmetric split introduction, immediate 2×2 profile facts, lowercase section titles, quiet monospaced metadata, generous spacing, and visual project cards. This site translates Eugene's playful line drawings into original analytic glyphs and inline charts; it does not reuse reference-site code, imagery, or personal content.

[Dominik Haitz's portfolio](https://dhaitz.github.io/) informs the direct project summaries and visible calls to action. [Siddharth Dayama's site](https://www.siddharth.info/) reinforces the value of showing real deliverables and employer context, while its visual density is deliberately avoided. [8jun](https://8jun.github.io/) is used only as a reminder to keep the site concise.

The resulting direction uses warm off-white, near-black type, a system sans-serif stack, monospaced labels, restrained teal/blue/violet accents, and original lightweight SVG charts. Project visuals are softened behind outcome-led copy, then shown clearly on the case-study page. Replace illustrative charts with actual work as projects are added.

## Home-page hierarchy

1. Split introduction: identity and quick links at left; value proposition, profile facts, and a small data illustration at right.
2. Three selected case studies with visible category, tools, summary, and a link to the full project page.
3. A compact employer-facing experience snapshot with role, scope, and a proof point.
4. A four-step working approach and a direct path to credentials.
5. Recent writing for project expansions and analytical notes.
6. A compact contact invitation and a large, simple footer.

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
