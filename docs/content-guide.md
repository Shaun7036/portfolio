# Content guide

## Profile, experience, and credentials

Edit `src/_data/site.json` without changing its field names. Use your full name, short role, one-sentence introduction, location, and availability. The `facts` array supplies the first three numbered facts in the home-page introduction; keep its `number`, `label`, and `value` keys, but replace the example focus, toolkit, and approach. The fourth fact uses `availability` and `location` automatically. Use a plain email address for `email` and complete `https://` URLs for `github` and `linkedin`. Leave an optional link as `""` until you have a real destination. JSON requires double quotes and does not allow trailing commas.

Edit the objects in `src/_data/credentials.json` for your own education, certifications, and professional development. Each object has `type`, `title`, `issuer`, `year`, `description`, and an optional verification `url`. Delete examples that do not apply and remove `example: true` from verified replacements; the page's template notice disappears automatically when no example entries remain. Page copy in `src/` can be revised alongside these shared data files.

Edit `src/_data/experience.json` for the employer-facing experience snapshot on the home page. Each entry has `organization`, `role`, `period`, `summary`, and `highlight`. The highlight should be one supported outcome, deliverable, or measure of scale; for work without a measured impact, name the decision, workflow, or audience it helped. Delete unused entries and remove `example: true` only after the entry is accurate.

## Add a project

Copy `templates/project.md` into `src/projects/`, for example as `forecasting-demand.md`. The filename creates `/projects/forecasting-demand/`. Use lowercase words separated by hyphens and keep filenames stable after sharing a URL.

The section between `---` markers is metadata, often called front matter. The text below it is the case study. Fields supported by the starter:

| Field | Purpose |
| --- | --- |
| `title`, `description` | Project heading and concise listing/search description |
| `highlight` | Short verified proof point shown before the project title; a non-metric result is fine |
| `category` | Project classification, such as Business intelligence |
| `tools` | YAML list of the tools actually used |
| `year` | Display year; quote it if using text such as `"2025–2026"` |
| `order` | Ascending project order; lower values appear first |
| `featured` | Marks a project for the home page |
| `chart` | Starter preview illustration: `revenue`, `retention`, or `mobility` |
| `cover` | Optional image path, such as `/assets/images/project.webp`; replaces the starter chart on cards and the case study |
| `coverAlt`, `visualCaption` | Description of the image and a caption with context or source |
| `coverWidth`, `coverHeight` | Your cover image's actual pixel dimensions |
| `example` | Keeps the example label visible when `true` |
| `outcome` | A concise, evidence-based deliverable or result |
| `role`, `duration`, `dataset` | The context shown with the case study |
| `repository`, `dashboard` | Optional complete external URLs; empty strings hide unavailable links |
| `draft` | `true` excludes the page from built output and collections |

Keep `layout: layouts/project.njk` and `tags: projects`. Replace the scaffold with your actual business question, data, preparation, approach, findings, recommendation, and limitations. The generated page supplies the main heading; start body sections at `##`, not `#`.

The home page shows the first three projects with `featured: true`, sorted by ascending `order`. Give every project a unique order. When replacing the starter, delete or rewrite the three published sample files; copied templates start with `draft: true` and will not appear until you set `draft: false`.

The starter preview charts are decorative demonstrations, not your analytical findings. Save a real screenshot or chart in `src/assets/images/` and set the `cover` fields above to replace a project's preview without editing templates. Include additional figures with captions in the case study body. Keep `example: true` until the content has been replaced and reviewed. Set `draft: false` to publish.

## Add an article

Copy `templates/article.md` into `src/writing/`, for example as `what-a-cohort-chart-misses.md`. It becomes `/writing/what-a-cohort-chart-misses/`. Set `title`, `description`, `date` in `YYYY-MM-DD` format, and `category`. Keep `layout: layouts/post.njk` and `tags: posts`.

Articles are ordered newest first. Write the body in Markdown, using `##` section headings, links, lists, quotes, and fenced code blocks as needed. An article can link to a related case study. Keep `draft: true` while editing; change it to `false` and remove example status when ready.

Dates control ordering, not scheduled publication. A future-dated post is still published when `draft` is false. Drafts are omitted from site output, but their source is visible in a public GitHub repository. Keep confidential material outside the repository.

## Links and images

Use the `url` filter for local links so they work on both `username.github.io` and `username.github.io/portfolio`:

```md
[View the case study]({{ '/projects/forecasting-demand/' | url }})

![Demand by week, with the largest peak in December]({{ '/assets/images/demand.webp' | url }})
```

Save that image as `src/assets/images/demand.webp`. Create the folder if needed. For loading hints and explicit image dimensions, HTML is also supported in Markdown:

```html
<img src="{{ '/assets/images/demand.webp' | url }}"
     alt="Demand by week, with the largest peak in December"
     width="1200" height="750" loading="lazy" decoding="async">
```

Use the image's actual dimensions. Choose informative alt text and put source, units, period, and relevant caveats in the surrounding caption or text. Compress images before adding them. External URLs such as `https://github.com/your-name/your-project` do not need the filter.

Avoid `href="#"` placeholders. Leave optional data links blank and omit unfinished body links. If you link to an on-page section, give it an explicit HTML ID such as `<h2 id="findings">Findings</h2>`; the checker will validate the fragment.

## Résumé

Edit `src/assets/resume/resume.tex` as your résumé source. The file is offered as a LaTeX download. For employers, also export a PDF with your LaTeX editor, save it as `src/assets/resume/resume.pdf`, and set `resumePdf` in `src/_data/site.json` to `/assets/resume/resume.pdf`. After replacing the web résumé placeholders in `src/resume.njk`, set `resumeTemplate` to `false` in `site.json` to remove its template label and notice.

The portfolio build copies assets but does not compile LaTeX. Regenerate the PDF after source changes. Keep `resumePdf` empty until the PDF exists; the site checker rejects a local link to a missing file. The web résumé lives in `src/resume.njk` and is edited separately from the LaTeX source. Review both before sharing.

When you know the published address, set `site.url` to the origin only (for example `https://your-name.github.io`), without a repository path. This enables canonical and `og:url` metadata; the build adds the GitHub Pages project subpath automatically.

## Before sharing with employers

Replace the name, location, profile links, experience, credentials, résumé, and all example projects/articles. Remove content blocks that do not apply. If you delete an entire core page, also remove its header/footer links and its expected-page entry in `scripts/check-site.mjs`. Confirm any results you state are supported by your work. Run `npm run check`, preview the pages on desktop and mobile, and test the published URL after deployment.
