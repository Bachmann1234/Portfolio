#!/usr/bin/env python3
"""Render software.html from projects.yaml.

The software page is a running list of projects that grows over time. Content
lives in projects.yaml; layout lives in templates/software.html.j2. To add a
project, append an entry to projects.yaml and re-run this script.

Usage:
    python build_projects.py
"""
from __future__ import annotations

from pathlib import Path

import jinja2
import yaml

ROOT = Path(__file__).parent.resolve()
DATA = ROOT / "projects.yaml"


def main() -> None:
    if not DATA.exists():
        raise SystemExit(f"projects.yaml not found at {DATA}")

    data = yaml.safe_load(DATA.read_text(encoding="utf-8"))
    projects = data.get("projects", [])

    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(str(ROOT / "templates")),
        autoescape=jinja2.select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    rendered = env.get_template("software.html.j2").render(projects=projects)
    (ROOT / "software.html").write_text(rendered, encoding="utf-8")
    print(f"Wrote {ROOT / 'software.html'} from {DATA} ({len(projects)} projects)")


if __name__ == "__main__":
    main()
