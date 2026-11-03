# Personalization checklist

## Start here

- [ ] Complete `site/src/data/site.json`, including one primary `email` and any `alternateEmails`.
- [ ] Replace the three profile facts with your actual interests, toolkit, and coursework or approach.
- [ ] Review every entry in `site/src/content/experiences/`; remove `example: true` after review.
- [ ] Review every experience `filterTags` value and keep only roles and skills supported by the entry.
- [ ] Verify the starter co-curricular descriptions and responsibility bullets against your actual work.
- [ ] Read each public page and remove sections that do not fit your story.

## Projects

- [ ] Choose three flagship projects with different kinds of analytical value.
- [ ] Delete or rewrite the three sample files in `site/src/content/projects/`.
- [ ] Create new drafts with `uv run portfolio-content --root . new project YOUR-SLUG`.
- [ ] Give every project a unique `order`; mark up to three `featured: true`.
- [ ] Add a verified `highlight`, real project context, and supported outcomes.
- [ ] Curate each project's Role, Skills, and Experience filter tags.
- [ ] Add an optimized cover image under `site/public/assets/images/` with accurate alt text and dimensions.
- [ ] Set `draft: false` and remove `example: true` only when the case study is reviewed.

## Employer details

- [ ] Review the résumé-backed About-page copy in `site/src/pages/about.astro`.
- [ ] Review `site/src/data/credentials.json` and add verification links if desired.
- [ ] Review every entry in `site/src/data/resumes.json`, especially the `Older edition` notice.
- [ ] After editing a `.tex` source in `site/public/assets/resume/`, replace its PDF and update the version's `updated` month.
- [ ] Test the Sports, Engineering, and Full tabs, direct PDF links, downloads, and keyboard navigation.

## Writing

- [ ] Delete or rewrite the sample articles in `site/src/content/writing/`.
- [ ] Create drafts with `uv run portfolio-content --root . new article YOUR-SLUG`.
- [ ] Add accurate filter tags to every published article.
- [ ] Keep private material outside the repository, even when `draft: true`.

## Before publishing

- [ ] Run `uv run ruff check src tests` and `uv run pytest -q`.
- [ ] Run `npm run check` from `site/`.
- [ ] Run `ASTRO_BASE=/portfolio-check npm run check` from `site/`.
- [ ] Review every page and download on desktop and mobile.
- [ ] Set `url` in `site/src/data/site.json` to the published origin.
- [ ] Enable GitHub Pages with GitHub Actions and inspect the deployed URL in a private window.

See the [content guide](content-guide.md), [engineering guide](engineering-guide.md), and root [README](../README.md).
