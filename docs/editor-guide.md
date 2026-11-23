# Add content in the browser

Open **About → Add an entry**, or visit `/editor/` on the portfolio. Choose Project, Work experience, Co-curricular experience, or Article. Each template creates the Markdown format used by the site.

## Write, preview, download

1. Fill in the fields marked Required. Separate tags and tools with commas; enter experience bullets on separate lines.
2. Check the suggested file name. Use lowercase words separated by hyphens. The destination folder updates above the form as you type.
3. Select **Preview entry** to review the text and resolve any errors. The preview keeps Markdown and HTML literal; it does not run embedded code or reproduce the final page layout.
4. Select **Download .md** or **Copy Markdown**. Neither action changes the repository or publishes the entry.
5. Move the downloaded file into its destination in your working copy. Inspect the site locally, then commit and push when ready.

| Template | Destination |
| --- | --- |
| Project | `site/src/content/projects/<file-name>.md` |
| Work experience | `site/src/content/experiences/<file-name>.md` |
| Co-curricular experience | `site/src/content/experiences/<file-name>.md` |
| Article | `site/src/content/writing/<file-name>.md` |

New entries default to **draft** and **example/unverified**. Turn off example status once the content is accurate. Turn off draft status when the entry should appear on the site. You can make either change in the editor before exporting, or change `example` and `draft` in the downloaded file afterward.

Draft files do not appear on the portfolio, but committed source is visible in a public repository. Article dates control ordering, not scheduled publication.

## Saved drafts

The editor automatically saves one draft per template in this browser on this device. Returning to a template restores it. Work and co-curricular forms keep separate drafts. Switching templates does not erase another template's draft.

**Start a new entry** asks before clearing that form and its local draft. Download or copy the current entry first if you want to keep it. Browser storage is not a backup: clearing site data or changing browser, device, or site address may remove or separate saved drafts. If storage or clipboard access is unavailable, the editor reports it; downloading and manual copying remain available.

## Order, tags, and detail pages

The suggested display order is one higher than the highest value in the last site build, including drafts. Projects have their own sequence. Work and co-curricular entries share one sequence. If you create several files before rebuilding, increase the number for each file; this static editor cannot see files you have only downloaded. It also cannot detect new file names added since the last build.

All three filter groups—Role, Skills, and Experience—need at least one tag. Duplicate tags are combined without changing the first spelling. Tags should reflect the entry's actual content.

An experience entry can stay as an expandable card. To add a longer page, select **Give this role its own detail page** and fill in the narrative. Alternatively, link to an existing portfolio page using a path such as `/projects/my-project/`. Use one option at a time.

Project cover images must be added separately under `site/public/assets/images/`. Enter the corresponding `/assets/images/...` path, image description, and actual dimensions. The editor validates the path format; the site build verifies that the file exists. Without a cover image, actual projects use neutral card art. Only example case-study pages show demonstration charts; the illustration choice also controls the card color.

## Before publishing

From the repository root, run the normal checks after adding the file:

```sh
uv run portfolio-content --root . validate
cd site
npm run check
```

Review the rendered page or card locally. For a draft detail page, temporarily set `draft: false` to see it locally; restore draft status if it is not ready. Commit and push the reviewed files when you want the deployment workflow to publish them.

The editor is a public static page, marked `noindex` to discourage search indexing. That is not authentication or access control. It makes no remote content writes and needs no account token. Form data stays in local browser storage until you copy or download it.

## Maintaining the editor

`site/src/scripts/editor-model.js` owns the form definitions, validation, defaults, and Markdown generation. `site/src/scripts/editor.js` owns browser storage, preview, copy, download, and reset. Routes live under `site/src/pages/editor/`; editor styles and JavaScript load only on editor pages.

If a content schema changes, update the matching form and generator alongside `site/src/content.config.ts` and the Python validator. Run the focused generator checks from the repository root:

```sh
node --test scripts/editor-generator.test.mjs
```

The tests cover required fields, frontmatter escaping, body delimiters, file-name/path safety, dates, ordering, and generated output against the repository's Python collection rules. They use the existing `.venv` Python environment; set `PYTHON` to another environment's Python executable if needed.
