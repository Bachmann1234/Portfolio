# Portfolio — mattbachmann.dev

Personal site: software projects, hardware builds, and my résumé. Built with
[Astro](https://astro.build) (static output — plain HTML/CSS, no client JS
framework), deployed to Cloudflare Workers Static Assets.

## Structure

```
src/
  pages/             One file per route: index, software, hardware, resume
  layouts/Base.astro   Shared chrome (nav + footer) — defined once
  components/          Nav, Footer, ProjectCard, BuildCard
  content.config.ts    Content collections + Zod schemas (validated at build)
  data/
    projects.yaml      The Software list  (add a project = append an entry)
    builds.yaml        The Hardware list  (add a build  = append an entry)
public/
  assets/             site.css, site.js, favicon, screenshots, project images
```

Adding to the running lists is data-only: append an entry to
`src/data/projects.yaml` or `src/data/builds.yaml`. The schema in
`content.config.ts` validates it at build time, so a typo'd field or a missing
required key fails `npm run build` instead of rendering broken.

## Résumé

Résumé **content** is NOT stored here. It is single-sourced from the
[Bachmann1234/resume](https://github.com/Bachmann1234/resume) repo
(`resume.yaml` → `resume.json` + `cv.pdf`, published to that repo's rolling
`latest` release). `src/pages/resume.astro` reads `resume.json` at build time:

- **CI** fetches `resume.json` (and `cv.pdf` → `public/resume.pdf`) from the
  release before building.
- **Local dev** falls back to the sibling checkout at `../resume/build/resume.json`.

So the résumé page and PDF stay in sync with one source of truth.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

`resume.json` is gitignored; local dev reads it from the sibling `resume`
checkout (`../resume`). To preview the PDF link locally, drop a `resume.pdf`
into `public/`.

## Build & deploy

```bash
npm run build      # static site → dist/
```

`.github/workflows/deploy.yml` runs on push to `main`: installs deps, fetches
the résumé artifacts, `npm run build`, then `wrangler deploy` (Cloudflare
Workers Static Assets, configured in `wrangler.toml` — serves `./dist`). The
résumé repo can trigger a redeploy via a `resume-updated` repository dispatch.

Required repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Hosting

Served from the apex `mattbachmann.dev` (DNS on Cloudflare). `workers.dev` and
preview URLs are intentionally disabled in `wrangler.toml`.
