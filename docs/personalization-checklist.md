# Personalization checklist

Use this as the handoff list for turning the starter into your portfolio. The site is designed to stay publishable while you replace one section at a time.

## Start here

- [ ] Add your name, professional title, one-sentence value proposition, location, and availability in `src/_data/site.json`.
- [ ] Replace the three home-page facts with your real focus, toolkit, and working approach.
- [ ] Add complete LinkedIn and GitHub URLs plus a plain email address.
- [ ] Replace the entries in `src/_data/experience.json` with your actual roles, scope, and one supported proof point; delete unused entries and remove `example: true` after checking the facts.
- [ ] Read every public page once and remove any content block that does not fit your story. Deleting a whole core page also requires removing its navigation links and checker entry.

## Projects

- [ ] Choose three flagship projects that demonstrate different kinds of analytical value.
- [ ] Delete or rewrite the three published sample project files so they do not remain ahead of your work.
- [ ] Copy `templates/project.md` for each project and replace every placeholder field.
- [ ] Give every project a unique `order`; mark the three home-page projects `featured: true`.
- [ ] Add a short, verified `highlight` proof point. If there is no measured impact, name the decision, workflow, or audience the work helped.
- [ ] Lead each title and summary with the question, result, or decision—not only the tool used.
- [ ] Add one optimized cover image or chart with real alt text, dimensions, and a useful caption.
- [ ] Support every metric or outcome and state important limitations.
- [ ] When the full case study is accurate and reviewed, set `draft: false` and remove `example: true` so it is published without the example label.

## Employer details

- [ ] Replace the About page with a short employer-focused biography and working style.
- [ ] Replace every entry in `src/_data/credentials.json`, add verification links where available, and remove `example: true` from verified entries.
- [ ] Update the web résumé in `src/resume.njk`, then set `resumeTemplate` to `false` in `src/_data/site.json`.
- [ ] Update `src/assets/resume/resume.tex`, compile a PDF, save it beside the source, and set `resumePdf` in `site.json`.

## Writing

- [ ] Delete or rewrite the two sample articles.
- [ ] Copy `templates/article.md` for future project notes or longer explanations.
- [ ] Keep unfinished posts as drafts; draft source is still visible in a public repository. Set `draft: false` and remove `example: true` when an article is ready to publish.

## Before publishing

- [ ] Confirm there is no confidential client, employer, or dataset information.
- [ ] Remove the starter notices and placeholder résumé text after replacing the examples. Search the repository for `placeholder`, `example`, `starter`, and `template`; review every result before deleting a notice.
- [ ] Run `npm run check` and `PATH_PREFIX=/portfolio-check/ npm run check`.
- [ ] Review the home page, every project, résumé downloads, and contact links on desktop and mobile.
- [ ] Create the GitHub repository, push this repository's contents, and enable GitHub Pages with GitHub Actions.
- [ ] Set `url` in `src/_data/site.json` to the published origin, such as `https://your-name.github.io`; do not include a repository subpath.
- [ ] Open the published URL in a private window and check every link one last time.

For exact field definitions, image guidance, and publishing details, continue with [the content guide](content-guide.md) and the root [README](../README.md).
