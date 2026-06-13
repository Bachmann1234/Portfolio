# mattbachmann.dev

Personal portfolio — a static "Maker's Journal" site for my résumé and, in time,
write-ups of my software and hardware projects.

Built from a [Claude Design](https://claude.ai/design) mockup. Plain
HTML/CSS/JS, no build framework.

## Branches

- **`main`** — what's deployed: a minimal landing page + the full résumé. This
  is intentionally slim while the rest is built out.
- **`full-site`** — work in progress: the full four-page design (home, software,
  hardware, résumé) with placeholder content being replaced page by page. Merges
  into `main` when ready.

## Structure (`main`)

```
index.html        Minimal landing page
resume.html       Full résumé, rendered from the resume repo's resume.json
templates/
  resume.html.j2  Résumé layout template (content comes from resume.json)
build_resume.py   Renders resume.html from resume.json
assets/
  site.css        Design system: 3 color themes × light/dark, 2 font sets
  site.js         Theme / font / mode switching, persisted to localStorage
```

Default look is **dark + Forest & Rust**; visitors can switch themes, fonts,
and light/dark from the nav (their choice is remembered).

## Résumé content & PDF

The résumé has a single source of truth in
[Bachmann1234/resume](https://github.com/Bachmann1234/resume) (`resume.yaml`).
That repo's CI publishes two artifacts to its `latest` release:

- `resume.json` — rendered into `resume.html` by `build_resume.py`
- `cv.pdf` — the downloadable résumé, dropped in as `resume.pdf` at deploy time
  (git-ignored here)

```
https://github.com/Bachmann1234/resume/releases/download/latest/resume.json
https://github.com/Bachmann1234/resume/releases/download/latest/cv.pdf
```

Refresh the résumé locally:

```sh
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
# point at a local resume.json (sibling checkout) or a downloaded one
.venv/bin/python build_resume.py [path/to/resume.json]
```

## Hosting

Static site deployed to **Cloudflare Pages**, served from the apex
`mattbachmann.dev` (DNS on Cloudflare). (Deploy pipeline: TODO.)

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Still to build (on `full-site`)

- Software project lineup + real write-ups.
- Hardware builds + photos.
- Restore full home page (hero, about, dog) and 4-way nav.
- Contact email (placeholder `you@example.com` in footers).
