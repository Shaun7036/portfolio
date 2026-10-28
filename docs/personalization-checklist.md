# Personalization checklist

## Start here

- [ ] Complete `site/src/data/site.json`, including one primary `email` and any `alternateEmails`.
- [ ] Replace the three profile facts with your actual interests, toolkit, and coursework or approach.
- [ ] Replace every entry in `site/src/data/experience.json`; remove `example: true` after review.
- [ ] Read each public page and remove sections that do not fit your story.

## Projects

- [ ] Choose three flagship projects with different kinds of analytical value.
- [ ] Delete or rewrite the three sample files in `site/src/content/projects/`.
- [ ] Create new drafts with `uv run portfolio-content --root . new project YOUR-SLUG`.
- [ ] Give every project a unique `order`; mark up to three `featured: true`.
- [ ] Add a verified `highlight`, real project context, and supported outcomes.
- [ ] Add an optimized cover image under `site/public/assets/images/` with accurate alt text and dimensions.
- [ ] Set `draft: false` and remove `example: true` only when the case study is reviewed.

## Employer details

- [ ] Replace the About-page copy in `site/src/pages/about.astro`.
- [ ] Replace `site/src/data/credentials.json` entries and add verification links.
- [ ] Update `site/src/pages/resume.astro`, then set `resumeTemplate` to `false`.
- [ ] Update `site/public/assets/resume/resume.tex`, export a PDF, and set `resumePdf`.

## Writing

- [ ] Delete or rewrite the sample articles in `site/src/content/writing/`.
- [ ] Create drafts with `uv run portfolio-content --root . new article YOUR-SLUG`.
- [ ] Keep private material outside the repository, even when `draft: true`.

## Before publishing

- [ ] Run `uv run ruff check src tests` and `uv run pytest -q`.
- [ ] Run `npm run check` from `site/`.
- [ ] Run `ASTRO_BASE=/portfolio-check npm run check` from `site/`.
- [ ] Review every page and download on desktop and mobile.
- [ ] Set `url` in `site/src/data/site.json` to the published origin.
- [ ] Enable GitHub Pages with GitHub Actions and inspect the deployed URL in a private window.

See the [content guide](content-guide.md), [engineering guide](engineering-guide.md), and root [README](../README.md).
