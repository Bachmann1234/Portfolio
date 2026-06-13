# mattbachmann.dev

Personal portfolio — a static "Maker's Journal" site showcasing software
projects, hardware builds, and my résumé.

Built from a [Claude Design](https://claude.ai/design) mockup. Plain
HTML/CSS/JS, no build framework.

## Structure

```
index.html        Home — hero + an "about me" moment (the dog)
software.html     Software project grid
hardware.html     Hardware builds (drag-and-drop photo slots)
resume.html       Full résumé, rendered on the page
assets/
  site.css        Design system: 3 color themes × light/dark, 2 font sets
  site.js         Theme / font / mode switching, persisted to localStorage
  image-slot.js   Drag-and-drop photo slots used on the Hardware page
  bernese.jpg     About-me photo
```

Default look is **dark + Forest & Rust**; visitors can switch themes, fonts,
and light/dark from the nav (their choice is remembered).

## Résumé PDF

The downloadable résumé (`resume.pdf`) is **not** checked in. It is built from
the LaTeX source in [Bachmann1234/resume](https://github.com/Bachmann1234/resume)
and dropped into the deploy at publish time, so the résumé has a single source
of truth. (Deploy pipeline: TODO.)

## Hosting

Static site deployed to **Cloudflare Pages**, served from the apex
`mattbachmann.dev` (DNS on Cloudflare). (Deploy pipeline: TODO.)

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Still to fill in

- Real résumé content (experience / education / talks) — currently scaffolding.
- Final software & hardware project lineup + write-ups.
- Contact email (placeholder `you@example.com` in footers).
