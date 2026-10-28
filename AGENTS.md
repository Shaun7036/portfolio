# Portfolio maintenance

This is a standalone Python + Astro analytics portfolio. Read `README.md`, `docs/content-guide.md`, and `docs/engineering-guide.md` before changing architecture or publishing behavior.

- Keep the published output static, lightweight, and compatible with GitHub Pages.
- Python tooling lives in root `src/portfolio_tools/`; the Astro application lives in `site/`.
- Edit Astro source under `site/src/`. `site/dist/` and `site/.astro/` are generated and must not be edited or committed.
- Shared profile, credential, and experience data live in `site/src/data/`. Projects and articles live in `site/src/content/`.
- Keep placeholder projects and articles explicitly labeled until the owner supplies real content. Do not invent credentials, experience, or measured impact.
- In `.astro` files, pass internal links and public assets through `withBase()`. In Markdown bodies, use relative URLs so GitHub project-site paths work.
- Run `uv run ruff check src tests`, `uv run pytest -q`, and `npm run check` from `site/`. Also run `ASTRO_BASE=/portfolio-check npm run check` for URL or publishing changes.
- For visual changes, inspect desktop and 390px mobile rendering when browser access is available. Do not represent source checks as browser verification.
- Keep the LaTeX résumé, exported PDF (if present), and `site/src/pages/resume.astro` consistent.
- Avoid adding a client framework, CMS, database, or server runtime unless the requirement clearly justifies it.
