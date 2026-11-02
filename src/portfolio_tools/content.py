from __future__ import annotations

import json
import re
import shutil
from pathlib import Path
from typing import Any

EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FIELD = re.compile(r"^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$", re.MULTILINE)

PROJECT_REQUIRED = {
    "title",
    "description",
    "category",
    "tools",
    "filterTags",
    "year",
    "order",
    "featured",
    "chart",
    "outcome",
    "role",
    "duration",
    "dataset",
}
POST_REQUIRED = {"title", "description", "date", "category", "draft", "filterTags"}
EXPERIENCE_REQUIRED = {
    "organization",
    "role",
    "section",
    "start",
    "end",
    "description",
    "responsibilities",
    "filterTags",
    "order",
    "detailPage",
    "draft",
}
FILTER_GROUPS = ("roles", "skills", "experience")


def _load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def _frontmatter(path: Path) -> tuple[dict[str, str], str]:
    source = path.read_text(encoding="utf-8")
    if not source.startswith("---\n"):
        return {}, source
    try:
        raw, body = source[4:].split("\n---\n", 1)
    except ValueError:
        return {}, source
    return {match.group(1): (match.group(2) or "").strip() for match in FIELD.finditer(raw)}, body


def _unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def _validate_collection(directory: Path, required: set[str], kind: str) -> list[str]:
    errors: list[str] = []
    seen_orders: dict[int, Path] = {}
    for path in sorted(directory.glob("*.md")):
        fields, body = _frontmatter(path)
        missing = sorted(required - fields.keys())
        if missing:
            errors.append(f"{path}: missing frontmatter fields: {', '.join(missing)}")
        detail_page = _unquote(fields.get("detailPage", "")).lower() if kind == "experience" else "true"
        if kind == "experience" and detail_page not in {"true", "false"}:
            errors.append(f"{path}: detailPage must be true or false")
        if detail_page == "true" and not body.strip():
            errors.append(f"{path}: content body is empty")
        if not SLUG.fullmatch(path.stem):
            errors.append(f"{path}: filename must be a lowercase kebab-case slug")
        if kind in {"project", "experience"} and "order" in fields:
            try:
                order = int(_unquote(fields["order"]))
            except ValueError:
                errors.append(f"{path}: order must be an integer")
            else:
                if order in seen_orders:
                    errors.append(f"{path}: order {order} duplicates {seen_orders[order]}")
                seen_orders[order] = path
    return errors


def _validate_filter_tags(value: object, source: str) -> list[str]:
    errors: list[str] = []
    if not isinstance(value, dict):
        return [f"{source}: filterTags must be an object"]

    for group in FILTER_GROUPS:
        tags = value.get(group)
        if not isinstance(tags, list) or not tags:
            errors.append(f"{source}: filterTags.{group} must be a non-empty list")
            continue
        invalid = [tag for tag in tags if not isinstance(tag, str) or not tag.strip()]
        if invalid:
            errors.append(f"{source}: filterTags.{group} contains a blank or non-string tag")
            continue
        normalized = [tag.strip().casefold() for tag in tags]
        if len(normalized) != len(set(normalized)):
            errors.append(f"{source}: filterTags.{group} contains duplicate tags")
    return errors


def validate_repository(root: Path) -> list[str]:
    """Return validation errors for the data and Markdown that Astro publishes."""

    root = root.resolve()
    data_dir = root / "site" / "src" / "data"
    errors: list[str] = []

    try:
        site = _load_json(data_dir / "site.json")
        credentials = _load_json(data_dir / "credentials.json")
    except (OSError, json.JSONDecodeError) as error:
        return [f"portfolio data could not be read: {error}"]

    for field in ("name", "role", "description", "intro", "storytime", "location", "availability"):
        if not isinstance(site.get(field), str) or not site[field].strip():
            errors.append(f"site.json: {field} must be a non-empty string")

    primary_email = site.get("email", "")
    if primary_email and (not isinstance(primary_email, str) or not EMAIL.fullmatch(primary_email)):
        errors.append("site.json: email must contain one plain email address")
    alternate_emails = site.get("alternateEmails", [])
    if not isinstance(alternate_emails, list) or any(
        not isinstance(email, str) or not EMAIL.fullmatch(email) for email in alternate_emails
    ):
        errors.append("site.json: alternateEmails must be a list of plain email addresses")
    elif len(set(alternate_emails + ([primary_email] if primary_email else []))) != len(
        alternate_emails + ([primary_email] if primary_email else [])
    ):
        errors.append("site.json: email addresses must be unique")

    if not isinstance(site.get("facts"), list) or len(site["facts"]) != 3:
        errors.append("site.json: facts must contain exactly three entries")
    if not isinstance(credentials, list):
        errors.append("credentials.json: expected a list")
    resume_pdf = site.get("resumePdf", "")
    if resume_pdf:
        resume_path = root / "site" / "public" / str(resume_pdf).lstrip("/")
        if not resume_path.is_file():
            errors.append(f"site.json: resumePdf does not exist: {resume_path}")

    errors.extend(
        _validate_collection(root / "site" / "src" / "content" / "projects", PROJECT_REQUIRED, "project")
    )
    errors.extend(_validate_collection(root / "site" / "src" / "content" / "writing", POST_REQUIRED, "post"))
    errors.extend(
        _validate_collection(
            root / "site" / "src" / "content" / "experiences", EXPERIENCE_REQUIRED, "experience"
        )
    )
    return errors


def scaffold_content(root: Path, kind: str, slug: str) -> Path:
    """Create draft portfolio content from the matching repository template."""

    content_types = {
        "project": ("projects", "project"),
        "article": ("writing", "article"),
        "experience": ("experiences", "experience"),
    }
    if kind not in content_types:
        raise ValueError("kind must be 'project', 'article', or 'experience'")
    if not SLUG.fullmatch(slug):
        raise ValueError("slug must use lowercase kebab-case")

    root = root.resolve()
    collection, template = content_types[kind]
    destination = root / "site" / "src" / "content" / collection / f"{slug}.md"
    if destination.exists():
        raise FileExistsError(f"content already exists: {destination}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(root / "templates" / f"{template}.md", destination)
    return destination
