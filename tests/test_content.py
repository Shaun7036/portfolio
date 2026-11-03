from pathlib import Path

import pytest

from portfolio_tools.content import (
    _validate_collection,
    _validate_filter_tags,
    _validate_resume_versions,
    scaffold_content,
    validate_repository,
)

ROOT = Path(__file__).resolve().parents[1]


def test_repository_content_is_valid() -> None:
    assert validate_repository(ROOT) == []


def test_scaffold_rejects_unsafe_slug(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="kebab-case"):
        scaffold_content(tmp_path, "project", "../unsafe")


def test_scaffold_copies_the_selected_template(tmp_path: Path) -> None:
    templates = tmp_path / "templates"
    templates.mkdir()
    (templates / "article.md").write_text("---\ndraft: true\n---\n", encoding="utf-8")

    destination = scaffold_content(tmp_path, "article", "clear-question")

    assert destination == tmp_path / "site" / "src" / "content" / "writing" / "clear-question.md"
    assert destination.read_text(encoding="utf-8") == "---\ndraft: true\n---\n"


def test_scaffold_creates_experience_content(tmp_path: Path) -> None:
    templates = tmp_path / "templates"
    templates.mkdir()
    (templates / "experience.md").write_text("---\ndetailPage: false\n---\n", encoding="utf-8")

    destination = scaffold_content(tmp_path, "experience", "student-lead")

    assert destination == tmp_path / "site" / "src" / "content" / "experiences" / "student-lead.md"
    assert destination.read_text(encoding="utf-8") == "---\ndetailPage: false\n---\n"


def test_experience_without_detail_page_may_have_empty_body(tmp_path: Path) -> None:
    (tmp_path / "card-only.md").write_text(
        "---\ndetailPage: false\norder: 1\n---\n",
        encoding="utf-8",
    )

    assert _validate_collection(tmp_path, {"detailPage", "order"}, "experience") == []


def test_experience_detail_page_requires_body(tmp_path: Path) -> None:
    source = tmp_path / "detailed-role.md"
    source.write_text("---\ndetailPage: true\norder: 1\n---\n", encoding="utf-8")

    assert any("content body is empty" in error for error in _validate_collection(
        tmp_path, {"detailPage", "order"}, "experience"
    ))


def _resume_registry(tmp_path: Path) -> dict[str, object]:
    assets = tmp_path / "site" / "public" / "assets" / "resume"
    assets.mkdir(parents=True)
    (assets / "sports.pdf").write_bytes(b"%PDF-1.4\n")
    (assets / "sports.tex").write_text("resume source", encoding="utf-8")
    return {
        "default": "sports",
        "versions": [
            {
                "id": "sports",
                "label": "Sports",
                "title": "Sports resume",
                "description": "A targeted version.",
                "status": "Current",
                "updated": "2026-11",
                "pdf": "/assets/resume/sports.pdf",
                "tex": "/assets/resume/sports.tex",
                "notice": "Reviewed copy.",
                "draft": False,
            }
        ],
    }


def test_resume_registry_accepts_existing_version_assets(tmp_path: Path) -> None:
    assert _validate_resume_versions(tmp_path, _resume_registry(tmp_path)) == []


def test_resume_registry_rejects_duplicate_ids(tmp_path: Path) -> None:
    registry = _resume_registry(tmp_path)
    registry["versions"].append(dict(registry["versions"][0]))

    assert any("duplicate id" in error for error in _validate_resume_versions(tmp_path, registry))


def test_resume_registry_rejects_missing_published_asset(tmp_path: Path) -> None:
    registry = _resume_registry(tmp_path)
    registry["versions"][0]["pdf"] = "/assets/resume/missing.pdf"

    assert any("does not exist" in error for error in _validate_resume_versions(tmp_path, registry))


def test_resume_registry_requires_published_default(tmp_path: Path) -> None:
    registry = _resume_registry(tmp_path)
    registry["default"] = "engineering"

    assert any("default must match" in error for error in _validate_resume_versions(tmp_path, registry))


def test_resume_registry_validates_optional_latex_asset(tmp_path: Path) -> None:
    registry = _resume_registry(tmp_path)
    registry["versions"][0]["tex"] = "/assets/resume/missing.tex"

    assert any("tex does not exist" in error for error in _validate_resume_versions(tmp_path, registry))


@pytest.mark.parametrize(
    ("value", "message"),
    [
        ({"roles": ["Analyst"], "skills": ["SQL"]}, "filterTags.experience"),
        ({"roles": [], "skills": ["SQL"], "experience": ["Project"]}, "filterTags.roles"),
        ({"roles": ["Analyst"], "skills": [""], "experience": ["Project"]}, "blank"),
        (
            {"roles": ["Analyst", "analyst"], "skills": ["SQL"], "experience": ["Project"]},
            "duplicate",
        ),
    ],
)
def test_filter_tag_validation(value: object, message: str) -> None:
    assert any(message in error for error in _validate_filter_tags(value, "item"))
