from __future__ import annotations

import argparse
from pathlib import Path

from .content import scaffold_content, validate_repository


def parser() -> argparse.ArgumentParser:
    command = argparse.ArgumentParser(prog="portfolio-content")
    command.add_argument("--root", type=Path, default=Path.cwd(), help="portfolio repository root")
    subcommands = command.add_subparsers(dest="command", required=True)
    subcommands.add_parser("validate", help="validate data and Markdown before an Astro build")
    new = subcommands.add_parser("new", help="create draft content from a template")
    new.add_argument("kind", choices=("project", "article"))
    new.add_argument("slug")
    return command


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    if args.command == "validate":
        errors = validate_repository(args.root)
        if errors:
            print("Content validation failed:")
            for error in errors:
                print(f"- {error}")
            return 1
        print("Content validation passed.")
        return 0

    try:
        destination = scaffold_content(args.root, args.kind, args.slug)
    except (FileExistsError, OSError, ValueError) as error:
        print(f"Could not create content: {error}")
        return 1
    print(f"Created draft: {destination}")
    return 0
