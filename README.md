# Analytics portfolio

A fast, static analytics portfolio built with Astro and supported by small Python content tools. Astro renders the website to plain HTML, CSS, and JavaScript; Python validates the content and scaffolds new projects or articles. GitHub Pages serves the generated files without a database or application server.

The starter still contains clearly labeled example projects, writing, experience, and résumé copy. Replace those examples before using the site in applications.

## Stack

- **Astro 7** for static pages, typed content collections, layouts, and components.
- **Python 3.11+** with `uv` for content validation and scaffolding.
- **Markdown** for projects and articles; **JSON** for shared profile data.
- **Vanilla CSS and JavaScript** for the visual system and project filtering.
- **GitHub Actions + GitHub Pages** for checks and deployment.

This matches the repository layout used by the related Python/Astro project: Python lives at the root and the Astro application lives in `site/`.

## Run locally

Install Node.js 24 and [`uv`](https://docs.astral.sh/uv/). From the repository root:

```sh
uv sync --extra dev --python 3.12
cd site
npm ci
npm run dev
```

Open the local address Astro prints. `npm run dev` validates the content first and then watches the site for changes.

Run the complete checks before committing:

```sh
uv run ruff check src tests
uv run pytest -q
cd site
npm run check
ASTRO_BASE=/portfolio-check npm run check
```

The second Astro check simulates a GitHub project site. Generated files live in `site/dist/`; never edit that folder.

## Make it yours

| What to change | Where |
| --- | --- |
| Name, introduction, contact, status, and profile links | `site/src/data/site.json` |
| Employer-facing experience | `site/src/data/experience.json` |
| Education and credentials | `site/src/data/credentials.json` |
| Project case studies | `site/src/content/projects/*.md` |
| Blog posts | `site/src/content/writing/*.md` |
| Page structure | `site/src/pages/` |
| Shared layouts and cards | `site/src/layouts/` and `site/src/components/` |
| Styling and browser behavior | `site/src/styles/site.css` and `site/src/scripts/site.js` |
| Static images and résumé files | `site/public/assets/` |
| Content rules and new-content commands | `src/portfolio_tools/` |

Start with the [personalization checklist](docs/personalization-checklist.md), then use the [content guide](docs/content-guide.md). The [engineering guide](docs/engineering-guide.md) explains the architecture, debugging workflow, and safe customization points.

Create draft content without copying files manually:

```sh
uv run portfolio-content --root . new project forecasting-demand
uv run portfolio-content --root . new article validating-a-dashboard
```

## Publish on GitHub Pages

The repository includes `.github/workflows/pages.yml`. It validates Python content, builds Astro with GitHub's actual Pages base path, checks the generated HTML, and uploads `site/dist/`.

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Push to `main`, or run **Actions → Publish portfolio → Run workflow**.
4. Open the deployment URL and check the site on desktop and mobile.

The same source works at both `username.github.io` and `username.github.io/repository`. Internal Astro links pass through `withBase()`; Markdown body links use relative paths. Do not add a `<base>` element or hardcode the repository name.

## Routine workflow

1. Edit JSON, Markdown, Astro, or CSS source.
2. Run the Python and Astro checks above.
3. Review `site/dist/` through `npm run preview` or the development server.
4. Commit related changes and push. A push to `main` deploys after Pages is enabled.

Keep `uv.lock` and `site/package-lock.json` committed. Do not commit `.venv/`, `site/node_modules/`, or `site/dist/`.
