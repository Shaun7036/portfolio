from pathlib import Path

import pytest

from portfolio_tools.content import _validate_filter_tags, scaffold_content, validate_repository

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
