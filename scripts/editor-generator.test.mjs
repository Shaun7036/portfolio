import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { generateEntry, initialValues, slugify } from "../site/src/scripts/editor-model.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const today = new Date(2026, 10, 22);
const common = { slug: "new-entry", description: "A clear summary.", roles: "Analyst", skills: "Python, SQL, python", experience: "Research" };
const values = (kind) => ({
  ...initialValues(kind, 30, today), ...common,
  ...(kind === "project" ? { title: "Demand forecast", category: "Analytics", role: "Analyst", duration: "Two months", dataset: "Public observations", outcome: "A documented forecast", question: "What explains demand?", tools: "Python, SQL" } : {}),
  ...(kind === "article" ? { title: "A useful question", category: "Practice", body: "## Start here\n\nAn explanation." } : {}),
  ...(["work", "co-curricular"].includes(kind) ? { organization: "An organization", role: "Researcher", start: "2026-01", responsibilities: "- Validated records\n• Documented the method" } : {}),
});

test("all four templates produce the required data and safe default status", () => {
  for (const kind of ["project", "work", "co-curricular", "article"]) {
    const result = generateEntry(kind, values(kind));
    assert.equal(result.ok, true, JSON.stringify(result.errors));
    assert.equal(result.metadata.draft, true);
    assert.equal(result.metadata.example, true);
    assert.deepEqual(result.metadata.filterTags.skills, ["Python", "SQL"]);
    assert.equal(result.filename, "new-entry.md");
    assert.match(result.markdown, /^---\n/);
    assert.match(result.markdown, /\n---\n/);
    if (kind === "project") {
      assert.equal(result.metadata.order, 30);
      assert.match(result.body, /^## Business question/);
    } else if (kind === "article") assert.equal(result.metadata.date, "2026-11-22");
    else {
      assert.equal(result.metadata.section, kind === "work" ? "work" : "co-curricular");
      assert.deepEqual(result.metadata.responsibilities, ["Validated records", "Documented the method"]);
      assert.equal(result.metadata.detailPage, false);
      assert.equal(result.body, "");
    }
  }
});

test("metadata escapes quotes, newlines, delimiters, HTML, and Unicode separators as one scalar", () => {
  const payload = 'A "quoted" \\ path\n---\ndraft: false\n<script>alert("x")</script>\u2028second\u2029third';
  const result = generateEntry("article", { ...values("article"), title: payload });
  assert.equal(result.ok, true);
  const titleLine = result.markdown.split("\n").find((line) => line.startsWith("title: "));
  assert.equal(JSON.parse(titleLine.slice("title: ".length)), payload);
  assert.equal(result.markdown.split("\n").filter((line) => line === "---").length, 2);
  assert.equal(result.markdown.split("\n").filter((line) => line.startsWith("draft:")).length, 1);
  assert.match(result.markdown, /draft: true\n/);
});

test("body delimiters stay after the frontmatter and cannot change metadata", () => {
  const body = '---\ndraft: false\n---\n<img src=x onerror="alert(1)">\n\n## Notes';
  const result = generateEntry("article", { ...values("article"), body });
  assert.equal(result.ok, true);
  assert.equal(result.metadata.draft, true);
  assert.equal(result.body, body);
  const closing = result.markdown.indexOf("\n---\n");
  assert.equal(result.markdown.slice(closing + 5).trim(), body);
});

test("file names reject traversal, encoding, extensions, empty values, and known slugs", () => {
  for (const slug of ["", "../escape", "../", "file.md", "one/two", "two--hyphens", "UPPER", "%2e%2e", "a\\b", "a".repeat(101)]) {
    const result = generateEntry("article", { ...values("article"), slug });
    assert.equal(result.ok, false, slug);
    assert.ok(result.errors.some((error) => error.field === "slug"));
  }
  assert.equal(generateEntry("article", values("article"), { existingSlugs: ["new-entry"] }).ok, false);
  assert.equal(slugify("  Café: Data / 2026! "), "cafe-data-2026");
});

test("required tags, bullets, dates, order, and conditional detail fields are checked", () => {
  const invalid = [
    ["article", { roles: ", ," }, "roles"],
    ["article", { skills: " " }, "skills"],
    ["article", { date: "2026-02-30" }, "date"],
    ["article", { date: "2026-13-01" }, "date"],
    ["work", { start: "2026-13" }, "start"],
    ["work", { end: "2025-12" }, "end"],
    ["work", { responsibilities: "-\n•" }, "responsibilities"],
    ["work", { detailPage: true, body: "" }, "body"],
    ["work", { detailPage: true, body: "Details", detailPath: "/projects/existing/" }, "detailPath"],
    ["project", { order: "0" }, "order"],
    ["project", { order: "3.5" }, "order"],
    ["project", { chart: "unknown" }, "chart"],
    ["project", { cover: "/assets/images/chart.webp" }, "coverAlt"],
  ];
  for (const [kind, changes, expectedField] of invalid) {
    const result = generateEntry(kind, { ...values(kind), ...changes });
    assert.equal(result.ok, false, JSON.stringify(changes));
    assert.ok(result.errors.some((error) => error.field === expectedField), JSON.stringify(result.errors));
  }
  assert.equal(generateEntry("project", values("project"), { usedOrders: [30] }).ok, false);
  assert.equal(generateEntry("article", { ...values("article"), date: "2024-02-29" }).ok, true);
});

test("external URLs and internal asset/detail paths cannot use scripts or traversal", () => {
  for (const repository of ["javascript:alert(1)", "data:text/html,hello", "https://user:pass@example.com", "https://example.com/a\nb"]) {
    assert.equal(generateEntry("project", { ...values("project"), repository }).ok, false);
  }
  for (const detailPath of ["//evil.example", "/../private", "/projects/../../secret", "/%2e%2e/", "/x?query", "/x#fragment"]) {
    assert.equal(generateEntry("work", { ...values("work"), detailPath }).ok, false);
  }
  assert.equal(generateEntry("project", { ...values("project"), repository: "https://github.com/example/repo" }).ok, true);
  assert.equal(generateEntry("work", { ...values("work"), detailPath: "/projects/related/" }).ok, true);
});

test("generated files pass the repository's Python collection and tag validators", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "portfolio-editor-test-"));
  try {
    const payload = [];
    for (const [index, kind] of ["project", "work", "co-curricular", "article"].entries()) {
      const result = generateEntry(kind, { ...values(kind), order: String(30 + index), title: 'A "quote"\n---\ndraft: false' });
      assert.equal(result.ok, true);
      const target = path.join(directory, kind);
      await mkdir(target);
      await writeFile(path.join(target, result.filename), result.markdown);
      payload.push({ directory: target, kind, tags: result.metadata.filterTags });
    }
    const python = process.env.PYTHON || path.join(root, ".venv", "bin", "python");
    const code = [
      "import json, sys",
      "from pathlib import Path",
      "from portfolio_tools.content import _validate_collection, _validate_filter_tags, PROJECT_REQUIRED, POST_REQUIRED, EXPERIENCE_REQUIRED",
      "errors = []",
      "for item in json.load(sys.stdin):",
      "    kind = 'project' if item['kind'] == 'project' else 'post' if item['kind'] == 'article' else 'experience'",
      "    fields = {'project': PROJECT_REQUIRED, 'post': POST_REQUIRED, 'experience': EXPERIENCE_REQUIRED}[kind]",
      "    errors += _validate_collection(Path(item['directory']), fields, kind)",
      "    errors += _validate_filter_tags(item['tags'], item['kind'])",
      "print(json.dumps(errors))",
      "sys.exit(bool(errors))",
    ].join("\n");
    const checked = spawnSync(python, ["-c", code], { input: JSON.stringify(payload), encoding: "utf8", env: { ...process.env, PYTHONPATH: path.join(root, "src") } });
    assert.equal(checked.error, undefined, `Install the project Python environment with uv sync first. ${checked.error || ""}`);
    assert.equal(checked.status, 0, checked.stdout + checked.stderr);
    assert.deepEqual(JSON.parse(checked.stdout), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
