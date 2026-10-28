from pathlib import Path

import pytest

from portfolio_tools.content import scaffold_content, validate_repository

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
