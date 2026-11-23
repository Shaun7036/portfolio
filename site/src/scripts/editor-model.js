// Pure form definitions and Markdown generation, shared by Astro, the browser, and tests.
export const editorKinds = {
  project: { label: "Project", plural: "projects", collection: "projects", description: "A case study, dashboard, analysis, or technical build." },
  work: { label: "Work experience", plural: "work experience", collection: "experiences", description: "A professional or research role, with responsibilities and results." },
  "co-curricular": { label: "Co-curricular experience", plural: "co-curricular experience", collection: "experiences", description: "Student leadership, volunteering, clubs, or community work." },
  article: { label: "Article", plural: "articles", collection: "writing", description: "A longer explanation, project reflection, or practical lesson." },
};

const field = (name, label, options = {}) => ({ name, label, control: "input", type: "text", ...options });
const textarea = (name, label, options = {}) => field(name, label, { control: "textarea", rows: 3, ...options });
const checkbox = (name, label, options = {}) => field(name, label, { control: "checkbox", ...options });
const orderField = field("order", "Display order", { type: "number", required: true, min: 1, help: "Starts after entries in the last site build. Use a different number for each new project or experience entry." });
const slugField = field("slug", "File name", { required: true, placeholder: "a-clear-project-name", help: "Lowercase words separated by hyphens. This also becomes the page address when the entry has a detail page." });
const tagsGroup = {
  title: "Help visitors find it",
  help: "Separate tags with commas. Use skills and roles you can demonstrate; duplicate tags are combined.",
  fields: [
    field("roles", "Role tags", { required: true, placeholder: "Data analyst, Research assistant" }),
    field("skills", "Skill tags", { required: true, placeholder: "Python, SQL, Data visualization" }),
    field("experience", "Experience tags", { required: true, placeholder: "Project, Research" }),
  ],
};
const publishingGroup = {
  title: "Review status",
  fields: [
    checkbox("draft", "Keep this entry as a draft", { help: "Draft files stay out of the published site. Downloading or copying never publishes an entry." }),
    checkbox("example", "Mark this as example or unverified content", { help: "Shows the site's example/review label. Leave checked while any claims still need verification." }),
  ],
};

export function getEditorGroups(kind) {
  if (!editorKinds[kind]) return [];
  if (kind === "project") return [
    { title: "The essentials", fields: [
      field("title", "Project title", { required: true, placeholder: "A clear, specific title" }), slugField,
      textarea("description", "Short summary", { required: true, help: "One or two sentences for the project card." }),
      field("highlight", "Key result or proof point", { help: "Optional. Include a number only if you can support it." }),
      field("category", "Category", { required: true, placeholder: "Business intelligence" }),
      field("year", "Year or date range", { required: true, placeholder: "2026 or 2025–2026" }),
      field("tools", "Tools used", { placeholder: "Python, SQL, Tableau", help: "Separate tools with commas." }), orderField,
      checkbox("featured", "Feature this project on the home page", { help: "The home page shows the first three featured projects in display order." }),
    ] },
    { title: "Your contribution", fields: [
      field("role", "Your role", { required: true, placeholder: "What you contributed" }),
      field("duration", "Duration", { required: true, placeholder: "For example, September–November 2026" }),
      textarea("dataset", "Data and source", { required: true, help: "Source, scope, and any important permission or licensing context." }),
      textarea("outcome", "Deliverable or outcome", { required: true, help: "What the work produced or informed." }),
    ] },
    { title: "The case study", help: "Write in plain text or Markdown. Section headings are added for you. Empty optional sections are left out.", fields: [
      textarea("question", "Business question", { required: true, rows: 4, help: "Who needed an answer, and what decision did they face?" }),
      textarea("preparation", "Data and preparation", { rows: 4 }),
      textarea("approach", "Approach", { rows: 4 }),
      textarea("findings", "Findings", { rows: 4 }),
      textarea("recommendation", "Recommendation", { rows: 4 }),
      textarea("limitations", "Limitations", { rows: 3 }),
    ] },
    tagsGroup,
    { title: "Links and cover", optional: true, help: "Optional. Local image files must be added to the repository separately.", fields: [
      field("repository", "Repository URL", { type: "url", placeholder: "https://github.com/…" }),
      field("dashboard", "Dashboard or demo URL", { type: "url", placeholder: "https://…" }),
      field("cover", "Cover image path", { placeholder: "/assets/images/my-project.webp", help: "Save the image under site/public/assets/images/." }),
      field("coverAlt", "Image description", { help: "Required when a cover image is set. Describe the information the image conveys." }),
      field("coverWidth", "Image width in pixels", { type: "number", min: 1 }),
      field("coverHeight", "Image height in pixels", { type: "number", min: 1 }),
      field("visualCaption", "Image caption or source"),
      field("chart", "Fallback illustration", { control: "select", options: [
        { value: "revenue", label: "Revenue trend" }, { value: "retention", label: "Retention cohorts" }, { value: "mobility", label: "Urban mobility" },
      ], help: "Sample illustration and card color. Only example case-study pages show demonstration charts; actual projects use neutral card art until a cover is added." }),
    ] },
    publishingGroup,
  ];
  if (kind === "article") return [
    { title: "The essentials", fields: [
      field("title", "Article title", { required: true }), slugField,
      textarea("description", "Short summary", { required: true, help: "What will the reader learn?" }),
      field("date", "Article date", { type: "date", required: true, help: "Dates control sorting, not scheduled publishing." }),
      field("category", "Category", { required: true, placeholder: "Analytics practice" }),
    ] },
    { title: "The article", fields: [
      textarea("body", "Article text", { required: true, rows: 18, help: "Plain text and Markdown are supported. Start section headings with ##; the page already supplies the title. Use relative links for portfolio pages and images." }),
    ] }, tagsGroup, publishingGroup,
  ];
  return [
    { title: "The essentials", fields: [
      field("organization", "Organization", { required: true }),
      field("role", "Role or position", { required: true }), slugField,
      field("location", "Location", { placeholder: "City, country or Remote" }),
      field("start", "Start month", { type: "month", required: true }),
      field("end", "End month", { required: true, placeholder: "2026-11 or present", help: "Use YYYY-MM, or present for an ongoing role." }),
      textarea("description", "Short summary", { required: true, help: "One sentence for the experience card." }),
      textarea("responsibilities", "Responsibilities and results", { required: true, rows: 7, help: "One bullet per line. Focus on verified contributions, deliverables, and outcomes." }), orderField,
    ] }, tagsGroup,
    { title: "More detail", optional: true, help: "Most roles only need the expandable card. Add a detail page or a link to existing work when useful.", fields: [
      checkbox("detailPage", "Give this role its own detail page"),
      textarea("body", "Longer narrative", { rows: 10, help: "Required for a detail page. Use ## section headings. Otherwise, this text is saved in the file but is not displayed." }),
      field("detailPath", "Or link to an existing portfolio page", { placeholder: "/projects/my-project/", help: "Use a path beginning with /. Leave empty when creating a detail page." }),
      field("detailLabel", "Link label", { placeholder: "Explore the related project" }),
    ] }, publishingGroup,
  ];
}

export function initialValues(kind, nextOrder = 1, today = new Date()) {
  const values = Object.fromEntries(getEditorGroups(kind).flatMap((group) => group.fields).map((item) => [item.name, item.control === "checkbox" ? false : ""]));
  const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  return {
    ...values,
    draft: true,
    example: true,
    ...(kind === "project" ? { order: String(nextOrder), year: String(today.getFullYear()), chart: "revenue", experience: "Project" } : {}),
    ...(kind === "article" ? { date: `${month}-${String(today.getDate()).padStart(2, "0")}`, experience: "Writing" } : {}),
    ...(["work", "co-curricular"].includes(kind) ? { order: String(nextOrder), end: "present", experience: kind === "work" ? "Professional" : "Community" } : {}),
  };
}

export function slugify(value) {
  return String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100).replace(/-+$/g, "");
}

export function splitTags(value) {
  const seen = new Set();
  return String(value || "").split(",").map((tag) => tag.trim()).filter((tag) => {
    const key = tag.toLocaleLowerCase();
    if (!tag || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const clean = (value) => String(value ?? "").replace(/\r\n?/g, "\n").trim();
const quoted = (value) => JSON.stringify(value).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
const validMonth = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
const validDay = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const validPath = (value) => /^\/(?!\/)[a-zA-Z0-9_./-]+\/?$/.test(value) && !value.split("/").some((part) => part === "." || part === "..");
const positiveInteger = (value) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0;

function yamlValue(key, value, indent = "") {
  if (Array.isArray(value)) return value.length ? `${indent}${key}:\n${value.map((entry) => `${indent}  - ${quoted(entry)}`).join("\n")}` : `${indent}${key}: []`;
  if (value && typeof value === "object") return `${indent}${key}:\n${Object.entries(value).map(([child, item]) => yamlValue(child, item, `${indent}  `)).join("\n")}`;
  return `${indent}${key}: ${typeof value === "string" ? quoted(value) : value}`;
}

export function generateEntry(kind, input, context = {}) {
  if (!editorKinds[kind]) return { ok: false, errors: [{ field: "slug", message: "Choose a supported entry type." }] };
  const values = Object.fromEntries(getEditorGroups(kind).flatMap((group) => group.fields).map((item) => [item.name, item.control === "checkbox" ? input[item.name] === true : clean(input[item.name])]));
  const errors = [];
  const error = (name, message) => errors.push({ field: name, message });
  for (const item of getEditorGroups(kind).flatMap((group) => group.fields)) {
    if (item.required && !values[item.name]) error(item.name, `Enter ${item.label.toLowerCase()}.`);
  }
  const slug = values.slug;
  if (slug && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100)) error("slug", "Use 1–100 lowercase letters, numbers, and single hyphens. Paths and file extensions are not allowed.");
  if ((context.existingSlugs || []).includes(slug)) error("slug", "That file name already exists in this collection. Choose a new name.");
  if (kind !== "article" && values.order && !positiveInteger(values.order)) error("order", "Use a positive whole number for display order.");
  if (kind !== "article" && (context.usedOrders || []).includes(Number(values.order))) error("order", "That display order is already used. Choose another number.");
  const filterTags = Object.fromEntries(["roles", "skills", "experience"].map((name) => [name, splitTags(values[name])]));
  for (const [name, tags] of Object.entries(filterTags)) if (!tags.length && values[name]) error(name, "Add at least one tag; commas alone do not count.");

  for (const name of ["repository", "dashboard"]) {
    if (!values[name]) continue;
    try {
      const url = new URL(values[name]);
      if (!["https:", "http:"].includes(url.protocol) || !url.hostname || url.username || url.password || /\s/.test(values[name])) throw new Error("invalid URL");
    } catch { error(name, "Use a complete http:// or https:// URL without embedded credentials."); }
  }
  if (kind === "article" && values.date && !validDay(values.date)) error("date", "Enter a real date in YYYY-MM-DD format.");
  if (["work", "co-curricular"].includes(kind)) {
    if (values.start && !validMonth(values.start)) error("start", "Use a month in YYYY-MM format.");
    if (values.end && values.end !== "present" && !validMonth(values.end)) error("end", "Use YYYY-MM or the word present.");
    if (validMonth(values.start) && validMonth(values.end) && values.end < values.start) error("end", "The end month cannot be before the start month.");
    if (values.detailPage && !values.body) error("body", "Add the narrative for this detail page, or turn off its detail page.");
    if (values.detailPage && values.detailPath) error("detailPath", "Choose either a detail page or a related-page link, not both.");
    if (values.detailPath && !validPath(values.detailPath)) error("detailPath", "Use a local path such as /projects/my-project/ without traversal, spaces, queries, or fragments.");
    if (values.detailLabel && !values.detailPath) error("detailLabel", "Add a related-page path for this link label, or clear the label.");
  }
  if (kind === "project") {
    if (!["revenue", "retention", "mobility"].includes(values.chart)) error("chart", "Choose one of the fallback illustrations.");
    if (values.cover && (!validPath(values.cover) || !/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(values.cover))) error("cover", "Use a local image path such as /assets/images/my-project.webp.");
    if (values.cover && !values.coverAlt) error("coverAlt", "Describe the cover image for readers who cannot see it.");
    for (const name of ["coverWidth", "coverHeight"]) {
      if ((values.cover || values[name]) && !positiveInteger(values[name])) error(name, "Enter the actual image size as a positive whole number.");
    }
  }

  const responsibilities = clean(values.responsibilities).split("\n").map((line) => line.replace(/^\s*[-*•]\s*/, "").trim()).filter(Boolean);
  if (["work", "co-curricular"].includes(kind) && values.responsibilities && !responsibilities.length) error("responsibilities", "Add at least one responsibility or result, not just bullet markers.");
  if (errors.length) return { ok: false, errors };

  let metadata;
  let body;
  const status = { example: values.example, draft: values.draft };
  if (kind === "project") {
    metadata = {
      title: values.title, description: values.description,
      ...(values.highlight ? { highlight: values.highlight } : {}),
      category: values.category, tools: splitTags(values.tools), filterTags, year: values.year,
      order: Number(values.order), featured: values.featured, chart: values.chart,
      ...(values.cover ? { cover: values.cover, coverAlt: values.coverAlt, coverWidth: Number(values.coverWidth), coverHeight: Number(values.coverHeight) } : {}),
      ...(values.visualCaption ? { visualCaption: values.visualCaption } : {}),
      ...status, outcome: values.outcome, role: values.role, duration: values.duration, dataset: values.dataset,
      repository: values.repository, dashboard: values.dashboard,
    };
    body = [["question", "Business question"], ["preparation", "Data & preparation"], ["approach", "Approach"], ["findings", "Findings"], ["recommendation", "Recommendation"], ["limitations", "Limitations"]]
      .filter(([name]) => values[name]).map(([name, title]) => `## ${title}\n\n${values[name]}`).join("\n\n");
  } else if (kind === "article") {
    metadata = { title: values.title, description: values.description, date: values.date, category: values.category, filterTags, ...status };
    body = values.body;
  } else {
    metadata = {
      organization: values.organization, role: values.role, section: kind === "work" ? "work" : "co-curricular",
      start: values.start, end: values.end,
      ...(values.location ? { location: values.location } : {}),
      description: values.description, responsibilities, filterTags, order: Number(values.order), detailPage: values.detailPage,
      ...(values.detailPath ? { detailPath: values.detailPath, detailLabel: values.detailLabel || "Explore related work" } : {}),
      ...status,
    };
    body = values.body;
  }
  const markdown = `---\n${Object.entries(metadata).map(([key, value]) => yamlValue(key, value)).join("\n")}\n---\n${body ? `\n${body}\n` : ""}`;
  return { ok: true, errors: [], markdown, metadata, body, filename: `${slug}.md`, destination: `site/src/content/${editorKinds[kind].collection}/${slug}.md` };
}
