# Content guide

## Profile, experience, and credentials

Edit `site/src/data/site.json` without renaming its fields. `email` is the primary address used in the footer and résumé. Put additional addresses in `alternateEmails`; the contact page renders each address as a separate valid link. The `facts` array supplies the first three home-page facts, status combines `availability` and `location`, and `storytime` introduces the professional experience grid.

Edit `site/src/data/credentials.json` for education, certifications, and professional development. Remove `example: true` after an entry is accurate. Work and co-curricular roles live in `site/src/content/experiences/` so the expandable card and any optional detail page share one source of truth.

JSON requires double quotes and forbids trailing commas. Run `uv run portfolio-content --root . validate` after changing shared data.

## Add an experience

From the repository root:

```sh
uv run portfolio-content --root . new experience student-leadership
```

This creates `site/src/content/experiences/student-leadership.md`. Every published entry becomes an expandable home-page card. Use `section: work` for professional or substantial research roles and `section: co-curricular` for student leadership, associations, and community work.

| Field | Purpose |
| --- | --- |
| `organization`, `role`, `location` | Card identity and context |
| `start`, `end` | `YYYY-MM`; use `present` for an active role |
| `description` | One-sentence card summary |
| `responsibilities` | Verified bullets revealed when the card opens |
| `filterTags` | Role, Skills, and Experience filter values |
| `order` | Unique display order across all experience cards |
| `detailPage` | Generates `/experience/<filename>/` when `true` |
| `detailPath`, `detailLabel` | Optional link to related work, usually a project page; do not combine with `detailPage: true` |
| `example` | Keep `true` for unverified starter copy; the card and detail page show a review warning |
| `draft` | Excludes the card and route while `true` |

For a lightweight role, leave `detailPage: false` and keep the Markdown body empty. For substantial work, set it to `true` and write the longer narrative below the frontmatter using `##` headings. A project-based role can instead use `detailPath: /projects/project-slug/` so the card links to the existing case study without duplicating it.

## Add a project

From the repository root:

```sh
uv run portfolio-content --root . new project forecasting-demand
```

This copies `templates/project.md` to `site/src/content/projects/forecasting-demand.md`. The filename creates `/projects/forecasting-demand/`; use lowercase kebab-case and avoid renaming a published slug.

| Field | Purpose |
| --- | --- |
| `title`, `description` | Page heading and concise listing/search description |
| `highlight` | Short, verified proof point shown before the title |
| `category` | Classification used by project filters |
| `tools` | YAML list of tools actually used |
| `filterTags` | Curated Role, Skills, and Experience tags used by the homepage filter |
| `year` | Display year; quote a range such as `"2025–2026"` |
| `order` | Unique ascending project order |
| `featured` | Includes the project in the home-page shortlist |
| `chart` | Fallback illustration: `revenue`, `retention`, or `mobility` |
| `cover` | Optional public path such as `/assets/images/project.webp` |
| `coverAlt`, `visualCaption` | Accessible description and visible context/source |
| `coverWidth`, `coverHeight` | Actual image dimensions |
| `example` | Shows an example label while `true` |
| `outcome` | Evidence-based deliverable or result |
| `role`, `duration`, `dataset` | Case-study context |
| `repository`, `dashboard` | Optional complete external URLs |
| `draft` | Excludes the page from all output while `true` |

The page layout supplies the main heading, so body sections start at `##`. The home page shows the first three `featured: true` projects after sorting by `order`.

## Homepage filter tags

Every home-page project, experience entry, and article has the same `filterTags` shape:

```yaml
filterTags:
  roles:
    - Data analyst
  skills:
    - Python
    - SQL
  experience:
    - Project
```

- `roles` describes the capacity you performed, such as Software Engineer, Research Assistant, or BI analyst.
- `skills` lists evidenced tools or capabilities. Do not add a skill only to make it appear in the filter.
- `experience` describes the context, such as Project, Professional, Research, Leadership, Community, or Writing.

Multiple selected tags within one filter use OR matching; selections across different filters use AND matching. Tag capitalization is preserved for display and ignored for matching. The menus are generated from the featured projects, experience entries, and recent articles actually rendered on the home page, so unused tags do not appear.

Experience, project, and article tags all live in their Markdown frontmatter. Keep every group nonempty and avoid duplicate spellings that differ only by capitalization.

Save real cover images in `site/public/assets/images/` and set `cover` to `/assets/images/filename.webp`. The Astro component applies the correct GitHub Pages base path. Keep example charts only as presentation placeholders, not evidence.

## Add an article

```sh
uv run portfolio-content --root . new article what-a-cohort-chart-misses
```

Articles live in `site/src/content/writing/`, are sorted newest first, and use `YYYY-MM-DD` dates. Use `##` headings in the body. Set `draft: false` and remove `example: true` when ready.

Future dates do not schedule publication; `draft` controls publication. Draft source remains visible in a public repository, so never commit confidential material.

## Links and images inside Markdown

Astro applies the deployment base path in components, but Markdown bodies do not execute the `withBase()` helper. Use relative links inside project and article Markdown so they work at both root and project-site URLs:

```md
[Related project](../../projects/revenue-intelligence/)

![Demand peaks in December](../../assets/images/demand.webp)
```

For a cover field in frontmatter, continue using `/assets/images/demand.webp`; `ProjectCard.astro` and `ProjectLayout.astro` pass it through `withBase()`.

Use meaningful alt text, real dimensions, compressed images, and captions with source, units, time period, and caveats. Avoid `href="#"` placeholders.

## Résumé

Edit `site/public/assets/resume/resume.tex`. Export a PDF beside it as `resume.pdf`, then set `resumePdf` in `site/src/data/site.json` to `/assets/resume/resume.pdf`. The build does not compile LaTeX.

The web résumé is `site/src/pages/resume.astro`. When its placeholders are replaced, set `resumeTemplate` to `false` to remove the template notice.

Set `site.url` to the published origin only, such as `https://your-name.github.io`, when known. The current Pages path is supplied separately by Astro's base configuration.

## Before sharing

Replace all example content, verify every outcome, and run:

```sh
uv run portfolio-content --root . validate
cd site
npm run check
ASTRO_BASE=/portfolio-check npm run check
```

If you delete a core page, also remove its navigation links and its expected entry in `scripts/check-site.mjs`.
