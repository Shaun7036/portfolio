# Analytics portfolio

A minimal portfolio for analytics projects, professional credentials, a résumé, and short articles. Eleventy turns Markdown and small templates into static pages for GitHub Pages. There is no database, paid CMS, or server to maintain.

The starter contains clearly labeled example projects and writing. Replace those examples and the profile placeholders before using the site in job applications.

## Run locally

Install Node.js 22 or later. From this repository's root:

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal. Changes to source files rebuild the preview. Stop it with `Ctrl+C`.

```sh
npm run check                       # Build and check local pages and assets
PATH_PREFIX=/portfolio/ npm run check  # Also check a GitHub project-site path
```

The second command uses macOS/Linux shell syntax. In PowerShell, run `$env:PATH_PREFIX="/portfolio/"; npm run check`, then remove it with `Remove-Item Env:PATH_PREFIX`.

Generated files live in `_site/`; edit the source, not that folder. `npm run check` verifies expected pages, unique page titles, heading structure, IDs, image alt attributes, and local links/assets/fragments. It does not test remote websites or replace a browser accessibility review.

## Make it yours

| What to change | Where |
| --- | --- |
| Name, introduction, location, contact and profile links | `src/_data/site.json` |
| Professional experience snapshot | `src/_data/experience.json` |
| Qualifications and credentials | `src/_data/credentials.json` |
| Project descriptions and case studies | `src/projects/*.md` |
| Blog posts | `src/writing/*.md` |
| Page structure and shared layouts | `src/` and `src/_includes/` |
| Styling, local assets and résumé files | `src/assets/` |

Start with the [personalization checklist](docs/personalization-checklist.md), then use the [content guide](docs/content-guide.md) for field-by-field details. Copy the files in `templates/` when adding a project or article. They start as drafts and are outside the published source folder.

The site includes Home, Projects, About, Credentials, Writing, Résumé, Contact, and a 404 page. Projects and articles receive their own pages. Writing is edited in Markdown and published with a commit; there is no in-browser authoring dashboard. Contact uses the links you supply rather than a hosted form.

## Publish on GitHub Pages

1. Choose the site address: name the repository `YOUR-USERNAME.github.io` for `https://YOUR-USERNAME.github.io/`, or use a name such as `portfolio` for `https://YOUR-USERNAME.github.io/portfolio/`.
2. Publish this existing local repository with either command-line Git or GitHub Desktop:

   - **Command line:** first create an **empty public repository** on GitHub. Do not initialize it with a README, license, or `.gitignore`. Then, from this repository's root, replace the example URL below with the new repository URL:

     ```sh
     git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
     git push -u origin main
     ```

   - **GitHub Desktop:** skip creating a repository on github.com. Choose **File → Add Local Repository**, select this `portfolio` folder, then choose **Publish repository** and leave **Keep this code private** unchecked.

   With either method, keep `package.json` and `.github/` at the repository root; do not upload the surrounding project mirror as an extra parent folder. Commit `package-lock.json`; do not commit `node_modules/` or `_site/`.
3. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source.
4. The publish workflow runs on pushes to `main`. After enabling Pages, run **Actions → Publish portfolio → Run workflow**, or push another commit to `main`. If your default branch has a different name, update the trigger in `.github/workflows/pages.yml`.
5. Open the deployment URL shown by the workflow and check the site on desktop and mobile.

The workflow reads the site's actual base path from `actions/configure-pages` and passes it to the build as `PATH_PREFIX`. The same source supports both a root site and a repository subpath. Keep local links behind Eleventy's `url` filter; the [content guide](docs/content-guide.md#links-and-images) includes examples.

GitHub Pages is available for public repositories on GitHub Free. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). The workflow uses the official [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), [configure-pages](https://github.com/actions/configure-pages), [upload-pages-artifact](https://github.com/actions/upload-pages-artifact), and [deploy-pages](https://github.com/actions/deploy-pages) actions.

## Keep it maintainable

- Add content in Markdown and data in JSON. Most changes do not need template edits.
- Keep screenshots compressed and sized for their displayed width; link out to live dashboards rather than embedding them on every page.
- Before publishing, run the checker and inspect the preview at a narrow mobile width. Open the résumé download and every contact link.
- Commit related changes together with a descriptive message. Pull requests run the checker at both a root URL and a repository subpath.
- Review dependency updates deliberately, commit the updated lockfile, and rerun checks. The runtime version is in `.nvmrc`; the site dependency is pinned in `package.json`.

For routine updates: edit the source files, run `npm run check`, review the local preview, then `git add` the intended files, commit, and push. A push to `main` publishes the new version automatically after GitHub Pages is enabled.

See [design notes](docs/design-notes.md) for the intended presentation and content hierarchy.
