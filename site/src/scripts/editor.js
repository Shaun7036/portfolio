import { editorKinds, generateEntry, getEditorGroups, initialValues, slugify } from "./editor-model.js";

const root = document.querySelector("[data-entry-editor]");

if (root) {
  const config = JSON.parse(root.dataset.editorConfig || "{}");
  const { kind, nextOrder } = config;
  const definition = editorKinds[kind];
  const form = root.querySelector("[data-editor-form]");
  const fields = getEditorGroups(kind).flatMap((group) => group.fields);
  const storageKey = `portfolio-editor:v1:${config.scope}:${kind}`;
  const saveStatus = root.querySelector("[data-editor-save-status]");
  const actionStatus = root.querySelector("[data-editor-action-status]");
  const destination = root.querySelector("[data-editor-destination]");
  const summary = root.querySelector("[data-editor-errors]");
  const errorList = root.querySelector("[data-editor-error-list]");
  const preview = root.querySelector("[data-editor-preview]");
  const previewContent = root.querySelector("[data-editor-preview-content]");
  const source = root.querySelector("[data-editor-source]");
  const sourceDetails = root.querySelector("[data-editor-source-details]");
  const stale = root.querySelector("[data-editor-stale]");
  let slugIsManual = false;
  let dirty = false;

  const inputFor = (name) => form.elements.namedItem(name);
  function valuesFromForm() {
    return Object.fromEntries(fields.map((field) => {
      const input = inputFor(field.name);
      return [field.name, field.control === "checkbox" ? input.checked : input.value];
    }));
  }
  function applyValues(values) {
    for (const field of fields) {
      const input = inputFor(field.name);
      if (field.control === "checkbox") input.checked = values[field.name] === true;
      else input.value = typeof values[field.name] === "string" ? values[field.name] : "";
    }
  }
  function showDestination() {
    const slug = inputFor("slug").value.trim();
    destination.textContent = `site/src/content/${definition.collection}/${/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100 ? slug : "your-file-name"}.md`;
  }
  function saveDraft() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, kind, values: valuesFromForm(), savedAt: new Date().toISOString() }));
      saveStatus.textContent = "Draft saved in this browser.";
    } catch {
      saveStatus.textContent = "This browser could not save your draft. Download a file before leaving.";
    }
  }
  function clearErrors() {
    summary.hidden = true;
    errorList.replaceChildren();
    for (const field of fields) {
      inputFor(field.name).removeAttribute("aria-invalid");
      const message = root.querySelector(`[data-editor-error-for="${field.name}"]`);
      if (message) message.textContent = "";
    }
  }
  function showErrors(errors) {
    clearErrors();
    for (const error of errors) {
      const field = inputFor(error.field);
      field?.setAttribute("aria-invalid", "true");
      const message = root.querySelector(`[data-editor-error-for="${error.field}"]`);
      if (message) message.textContent = error.message;
      // A field may live in an optional group; reveal it before linking to it.
      const optionalGroup = field?.closest("details");
      if (optionalGroup) optionalGroup.open = true;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#editor-${error.field}`;
      link.textContent = error.message;
      link.addEventListener("click", () => field?.focus());
      item.append(link);
      errorList.append(item);
    }
    summary.hidden = false;
    summary.focus();
  }
  function appendText(tag, value, className = "") {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    previewContent.append(element);
    return element;
  }
  function showPreview(result) {
    previewContent.replaceChildren();
    const data = result.metadata;
    appendText("p", `${data.draft ? "Draft" : "Ready for review"} · Not yet published`, "editor-preview-status");
    appendText("h3", data.title || `${data.organization} · ${data.role}`);
    appendText("p", data.description, "editor-preview-description");
    if (data.start) appendText("p", `${data.start} — ${data.end}${data.location ? ` · ${data.location}` : ""}`, "editor-preview-meta");
    else appendText("p", `${data.category} · ${data.date || data.year}`, "editor-preview-meta");
    appendText("p", Object.values(data.filterTags).flat().join(" · "), "editor-preview-tags");
    if (data.outcome) appendText("p", data.outcome);
    if (data.responsibilities) {
      const list = appendText("ul", "");
      for (const bullet of data.responsibilities) {
        const item = document.createElement("li");
        item.textContent = bullet;
        list.append(item);
      }
    }
    if (result.body && (kind === "project" || kind === "article" || data.detailPage)) {
      // Plain text deliberately preserves all Markdown and HTML literally.
      // Never pass user-authored content to innerHTML or an HTML parser here.
      appendText("pre", result.body, "editor-preview-body");
    }
    if (result.body && ["work", "co-curricular"].includes(kind) && !data.detailPage) appendText("p", "The longer narrative is saved in the file; it stays hidden until this role has a detail page.", "editor-preview-meta");
    source.value = result.markdown;
    stale.hidden = true;
    preview.hidden = false;
  }
  function prepare() {
    const result = generateEntry(kind, valuesFromForm(), config);
    if (!result.ok) {
      showErrors(result.errors);
      actionStatus.textContent = "Finish the highlighted fields to preview or export.";
      return null;
    }
    clearErrors();
    showPreview(result);
    saveDraft();
    return result;
  }

  applyValues(initialValues(kind, nextOrder));
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && saved.version === 1 && saved.kind === kind && saved.values && typeof saved.values === "object") {
      applyValues({ ...initialValues(kind, nextOrder), ...saved.values });
      slugIsManual = Boolean(inputFor("slug").value);
      dirty = true;
      saveStatus.textContent = "Your previous draft was restored from this browser.";
    } else saveStatus.textContent = "Your changes will be saved in this browser.";
  } catch {
    saveStatus.textContent = "Saved drafts are unavailable here. Download a file before leaving.";
  }
  showDestination();
  form.hidden = false;
  root.querySelector("[data-editor-loading]").hidden = true;

  form.addEventListener("input", (event) => {
    dirty = true;
    if (event.target.name === "slug") slugIsManual = true;
    if (!slugIsManual && ["title", "organization", "role"].includes(event.target.name)) {
      const values = valuesFromForm();
      inputFor("slug").value = slugify(values.title || [values.organization, values.role].filter(Boolean).join(" "));
    }
    showDestination();
    if (!preview.hidden) stale.hidden = false;
    actionStatus.textContent = "";
    saveDraft();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (prepare()) {
      actionStatus.textContent = "Preview updated. Nothing has been published.";
      preview.focus();
    }
  });
  root.querySelector("[data-editor-copy]").addEventListener("click", async () => {
    const result = prepare();
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.markdown);
      actionStatus.textContent = "Markdown copied. Add it to the file shown above when you are ready.";
    } catch {
      sourceDetails.open = true;
      source.focus();
      source.select();
      actionStatus.textContent = "Automatic copying is unavailable. The Markdown is selected below; use your browser's Copy command.";
    }
  });
  root.querySelector("[data-editor-download]").addEventListener("click", () => {
    const result = prepare();
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result.markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = result.filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    actionStatus.textContent = `Download requested: ${result.filename}. If your browser blocks it, use Copy Markdown. The entry is not published yet.`;
  });
  root.querySelector("[data-editor-reset]").addEventListener("click", () => {
    if (!window.confirm("Start a new entry? This clears the current form and its saved draft in this browser. Download or copy it first if you want to keep it.")) return;
    try {
      localStorage.removeItem(storageKey);
      saveStatus.textContent = "New entry. The previous draft was cleared from this browser.";
    } catch { saveStatus.textContent = "The form was cleared, but this browser could not remove its saved draft."; }
    applyValues(initialValues(kind, nextOrder));
    slugIsManual = false;
    dirty = false;
    clearErrors();
    showDestination();
    preview.hidden = true;
    source.value = "";
    actionStatus.textContent = "";
    inputFor(fields[0].name).focus();
  });
  window.addEventListener("pagehide", () => { if (dirty) saveDraft(); });
}
