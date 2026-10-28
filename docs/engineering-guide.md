# Engineering guide

This document explains how the portfolio works, where to make changes, and how to debug it without treating the project as a black box.

## System model

```text
JSON profile data ───────┐
Markdown collections ───┼─> Python validation ─> Astro build ─> site/dist/ ─> GitHub Pages
Astro pages/components ─┤
CSS + small browser JS ─┘
```

There is no production Python or Node server. Python and Node run during development and CI; visitors receive static files.

## Repository layout

```text
portfolio/
├── pyproject.toml, uv.lock       Python tooling and locked environment
├── src/portfolio_tools/          validator and content scaffolder
├── tests/                        Python tests
├── site/                         Astro application
│   ├── astro.config.mjs          static output and base-path configuration
│   ├── src/content.config.ts     frontmatter schemas
│   ├── src/content/              projects and writing
│   ├── src/data/                 shared JSON
│   ├── src/pages/                URL-producing pages
│   ├── src/layouts/              shared page shells
│   ├── src/components/           reusable project visuals/cards
│   ├── src/lib/                  URL and collection helpers
│   ├── src/styles/site.css       global design system
│   ├── src/scripts/site.js       progressive project filtering
│   └── public/                   copied static files
├── scripts/check-site.mjs        generated-HTML/link checker
├── templates/                    draft Markdown templates
└── .github/workflows/            pull-request checks and Pages deployment
```

## What happens during a build

1. `npm run build` in `site/` calls the Python validator through `uv`.
2. `astro check` type-checks Astro components and validates collection frontmatter against `content.config.ts`.
3. `astro build` resolves every page and dynamic route to static files in `site/dist/`.
4. `scripts/check-site.mjs` reads the generated HTML, checks required routes/headings/titles/IDs/alt text, and verifies local links and fragments.

The Python validator covers repository-level rules that are awkward in a component schema: valid primary/alternate emails, three profile facts, unique project order, safe slugs, required Markdown fields, and referenced résumé assets.

## Routing and content collections

Files in `site/src/pages/` create routes. For example, `about.astro` becomes `/about/`, while Astro's special `404.astro` becomes `/404.html`.

Project and article detail routes are dynamic at source but static after the build:

- `pages/projects/[slug].astro` loads every non-draft project and emits `/projects/<filename>/`.
- `pages/writing/[slug].astro` does the same for articles.

`lib/content.ts` is the single place for collection ordering and filtering. Projects sort by `order`; posts sort newest first. Drafts are filtered before route generation, so they cannot leak into the generated site.

## Layout and component flow

`BaseLayout.astro` owns the document `<head>`, metadata, skip link, header, navigation, footer, global CSS, and browser script. Every public page should use it.

`ProjectLayout.astro` and `PostLayout.astro` wrap rendered Markdown. `ProjectCard.astro` renders the same project metadata on the home page and project archive. `ProjectVisual.astro` owns the three lightweight fallback illustrations.

Astro escapes expressions by default. Markdown content is rendered by Astro's content pipeline rather than inserted as arbitrary HTML.

## GitHub Pages base paths

A GitHub user site runs at `/`; a project repository usually runs at `/portfolio/`. `astro.config.mjs` reads `ASTRO_BASE`, and `lib/urls.ts` exposes `withBase()` for internal component links and public assets.

Rules:

- Use `withBase("/projects/")` inside `.astro` files.
- Use relative URLs inside Markdown bodies.
- Use complete `https://` URLs for external sites.
- Never add a `<base>` element or hardcode `/portfolio/`.

Always test both URL shapes:

```sh
cd site
npm run check
ASTRO_BASE=/portfolio-check npm run check
```

## Styling patterns

`site.css` is intentionally global. Existing class names form the design system, so preserving them is safer than adding component-scoped styles during ordinary edits.

- CSS custom properties at the top control colors, type, spacing, and radii.
- `.page-shell` controls maximum width and page gutters.
- Repeated sections use `.section-heading`, `.eyebrow`, `.text-link`, `.tag-list`, and `.page-cta`.
- Breakpoints are concentrated at 960, 760, 640, and 410 pixels, with one wide-screen rule at 1000 pixels.
- Reduced-motion and print rules live near the end of the file.

When changing layout, inspect desktop, 390px mobile, keyboard focus, and print. Check `document.documentElement.scrollWidth` against `clientWidth` if horizontal overflow appears.

## Browser JavaScript

The browser script only enhances the project archive. All project cards render first; JavaScript reveals the filter buttons, toggles cards with `hidden`, updates `aria-pressed`, and announces the result count. If JavaScript fails, visitors still see every project.

Avoid replacing this with a framework island unless the interaction becomes substantially more complex.

## Common customizations

### Change shared profile information

Edit `site/src/data/site.json`. Use exactly one primary `email`; place additional addresses in `alternateEmails`.

### Add a new page

Create `site/src/pages/example.astro`, wrap the content in `BaseLayout`, and use exactly one `<h1>`. Add navigation only if the page belongs in the primary visitor journey.

### Change navigation

Edit the `links` array and footer navigation in `BaseLayout.astro`. If you remove a core page, also update the expected-page list in `scripts/check-site.mjs`.

### Add a project field

1. Add the field to `site/src/content.config.ts`.
2. Add it to `templates/project.md`.
3. Render it in `ProjectCard.astro`, `ProjectLayout.astro`, or both.
4. Update the Python validator only when the field needs a cross-file rule.
5. Document it in `docs/content-guide.md`.

### Replace the visual theme

Start with custom properties and typography in `site.css`. Then adjust reusable section/card classes. Avoid rewriting page markup and CSS simultaneously; keeping one side stable makes regressions easier to isolate.

## Debugging guide

### Astro reports invalid content

Read the file and field in the error. The accepted types are defined in `site/src/content.config.ts`. Common causes are a quoted boolean, malformed YAML list, missing required field, or invalid `chart` value.

### A page is missing

Check `draft`, filename/slug, and `getStaticPaths()` in the relevant `[slug].astro`. Run a normal build to replace generated output.

### Links work locally but fail on GitHub

Run the prefixed check. In Astro components, replace root-relative paths with `withBase()`. In Markdown, replace them with correct relative links.

### Styling changed unexpectedly

Inspect the rendered class names first. Astro markup must retain the classes expected by `site.css`. Then check the nearest responsive rule and CSS custom-property value.

### Project filters do not appear

The controls deliberately begin with `hidden`. Check the browser console and `site/src/scripts/site.js`. Confirm the archive contains `data-project-list`, `data-filter-controls`, `data-project`, and matching `data-category`/`data-filter` values.

### CI fails but local checks pass

Reproduce the exact commands in `.github/workflows/check.yml`, verify committed lockfiles, and confirm generated or local-only files were not referenced. CI uses Python 3.12 and Node 24.

## Dependency and deployment rules

- Pin site dependencies in `site/package.json` and commit `site/package-lock.json`.
- Pin Python dependencies through `pyproject.toml` and commit `uv.lock`.
- Pull requests test Python plus root and prefixed Astro builds.
- Pushes to `main` deploy only after validation and generated-site checks pass.
- The deploy artifact is `site/dist/`; source and dependencies are never served.
