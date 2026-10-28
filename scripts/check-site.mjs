import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

// A dependency-free check of this site's generated markup, not a general HTML validator.
const output = path.resolve(process.argv[2] || "site/dist");
const configuredPrefix = process.env.ASTRO_BASE || process.env.PATH_PREFIX || "";
const prefix = `/${configuredPrefix.replace(/^\/+|\/+$/g, "")}/`.replace(/\/{2,}/g, "/");
const origin = "https://portfolio-check.invalid";
const errors = [];
const documents = new Map();
const titles = new Map();
const references = [];

const decode = (value) => value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
  if (entity.startsWith("#")) {
    const number = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return number <= 0x10ffff ? String.fromCodePoint(number) : "�";
  }
  return ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " })[entity.toLowerCase()];
});
const text = (value) => decode(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const fail = (file, message) => errors.push(`${file}: ${message}`);

async function walk(directory, relative = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), name));
    else if (entry.isFile()) files.push(name);
  }
  return files;
}

function attributes(tag) {
  const values = new Map();
  const pattern = /([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of tag.replace(/^<\s*[\w:-]+/, "").matchAll(pattern)) {
    values.set(match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? ""));
  }
  return values;
}

function publicUrl(file) {
  return prefix + (file === "index.html" ? "" : file.replace(/index\.html$/, ""));
}

function cssReferences(css, file) {
  for (const match of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)) {
    references.push({ file, value: (match[1] ?? match[2] ?? match[3]).trim(), kind: "CSS URL" });
  }
}

let files;
try {
  files = new Set(await walk(output));
} catch (error) {
  console.error(`Cannot read ${output}. Build the site first. ${error.message}`);
  process.exit(1);
}

for (const expected of ["index.html", "projects/index.html", "about/index.html", "credentials/index.html", "writing/index.html", "resume/index.html", "contact/index.html", "404.html"]) {
  if (!files.has(expected)) fail(expected, "expected page is missing");
}

for (const file of files) {
  if (file.endsWith(".css")) {
    cssReferences(await readFile(path.join(output, file), "utf8"), file);
    continue;
  }
  if (!file.endsWith(".html")) continue;
  const html = (await readFile(path.join(output, file), "utf8")).replace(/<!--[\s\S]*?-->/g, "");
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  const pageTitles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  if (pageTitles.length !== 1 || !text(pageTitles[0]?.[1] || "")) {
    fail(file, "expected one nonempty page title");
  } else {
    const title = text(pageTitles[0][1]);
    if (titles.has(title)) fail(file, `page title duplicates ${titles.get(title)}`);
    titles.set(title, file);
  }

  for (const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) cssReferences(style[1], file);
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const headings = [...markup.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  if (headings.filter((heading) => heading[1] === "1").length !== 1) fail(file, "expected exactly one h1");
  let previousLevel = 0;
  for (const [, rawLevel, content] of headings) {
    const level = Number(rawLevel);
    if (!text(content)) fail(file, `h${level} is empty`);
    if (level > previousLevel + 1) fail(file, `heading hierarchy jumps from h${previousLevel} to h${level}`);
    previousLevel = level;
  }

  const ids = new Set();
  for (const match of markup.matchAll(/<[a-z][^>]*>/gi)) {
    const tag = match[0];
    const name = tag.match(/^<([\w:-]+)/)[1].toLowerCase();
    const attrs = attributes(tag);
    if (attrs.has("id")) {
      const id = attrs.get("id");
      if (!id || ids.has(id)) fail(file, `empty or duplicate id: ${JSON.stringify(id)}`);
      ids.add(id);
    }
    if (name === "img" && !attrs.has("alt")) fail(file, "image is missing an alt attribute");
    if (name === "base") fail(file, "base elements are unsupported; use withBase() or relative URLs");
    for (const attribute of ["href", "src", "poster", "xlink:href"]) {
      if (attrs.has(attribute)) references.push({ file, value: attrs.get(attribute), kind: `${name} ${attribute}` });
    }
    if (attrs.has("style")) cssReferences(attrs.get("style"), file);
    if (attrs.has("srcset") && !attrs.get("srcset").includes("data:")) {
      for (const candidate of attrs.get("srcset").split(",")) {
        references.push({ file, value: candidate.trim().split(/\s+/)[0], kind: "srcset" });
      }
    }
  }
  documents.set(file, { ids });
}

for (const { file, value, kind } of references) {
  if (!value || value === "#") {
    fail(file, `${kind} has an empty destination`);
    continue;
  }
  if (/^(?:mailto|tel|data|blob):/i.test(value)) continue;
  if (/^javascript:/i.test(value)) {
    fail(file, `${kind} uses a javascript URL`);
    continue;
  }
  let url;
  try {
    url = new URL(value, origin + publicUrl(file));
  } catch {
    fail(file, `${kind} has an invalid URL: ${value}`);
    continue;
  }
  if (url.origin !== origin) continue; // External availability requires a separate network check.
  let pathname;
  let fragment;
  try {
    pathname = decodeURIComponent(url.pathname);
    fragment = decodeURIComponent(url.hash.slice(1));
  } catch {
    fail(file, `${kind} has invalid percent encoding: ${value}`);
    continue;
  }
  if (prefix !== "/" && pathname !== prefix.slice(0, -1) && !pathname.startsWith(prefix)) {
    fail(file, `${kind} escapes the configured base path ${prefix}: ${value}`);
    continue;
  }
  let target = pathname === prefix.slice(0, -1) ? "" : pathname.slice(prefix.length);
  if (target.endsWith("/") || target === "") target += "index.html";
  else if (!files.has(target) && files.has(`${target}/index.html`)) target += "/index.html";
  if (!files.has(target)) {
    fail(file, `${kind} points to missing file: ${value}`);
    continue;
  }
  if (fragment && documents.has(target) && !documents.get(target).ids.has(fragment)) {
    fail(file, `${kind} points to missing fragment: ${value}`);
  }
}

if (errors.length) {
  console.error(`Site check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Site check passed: ${documents.size} HTML pages, ${references.length} link/asset references, BASE_PATH=${prefix}`);
}
