#!/usr/bin/env python3
"""Render resume.html from the résumé's resume.json artifact.

Résumé CONTENT lives in the Bachmann1234/resume repo (resume.yaml -> resume.json).
This script injects that content into the site's résumé layout.

Usage:
    python build_resume.py [path/to/resume.json]

Defaults to ../resume/build/resume.json (local sibling checkout). In CI, pass
the path to the resume.json fetched from the resume repo's release.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import jinja2

ROOT = Path(__file__).parent.resolve()
DEFAULT_JSON = ROOT.parent / "resume" / "build" / "resume.json"


def main() -> None:
    json_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_JSON
    if not json_path.exists():
        sys.exit(f"resume.json not found at {json_path} — build it in the resume repo first")

    data = json.loads(json_path.read_text(encoding="utf-8"))

    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(str(ROOT / "templates")),
        autoescape=jinja2.select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    rendered = env.get_template("resume.html.j2").render(**data)
    (ROOT / "resume.html").write_text(rendered, encoding="utf-8")
    print(f"Wrote {ROOT / 'resume.html'} from {json_path}")


if __name__ == "__main__":
    main()
