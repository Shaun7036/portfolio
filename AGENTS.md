# Portfolio maintenance

This is the standalone analytics portfolio repository. Read README.md and docs/content-guide.md for authoring and GitHub Pages setup.

- Keep the published output static, lightweight, and compatible with GitHub Pages.
- Prefer existing Eleventy, Markdown, plain CSS, and small JavaScript files over adding frameworks or services.
- Edit src/; _site/ is generated. Shared profile and credential data live in src/_data/.
- Keep placeholder projects and articles explicitly labeled until the owner supplies real content. Do not invent credentials, experience, or measured impact.
- Pass internal URLs through the `url` filter so project-site subpaths work.
- Use `npm run check` for content/template changes. Also verify a PATH_PREFIX build when changing URLs or publishing configuration.
- For visual changes, inspect desktop and mobile rendering when browser access is available. Do not represent source checks as browser verification.
- Keep the LaTeX résumé, its exported PDF (if present), and the separately edited HTML résumé consistent when updating résumé content.
