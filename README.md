# Portfolio Site

Personal site: Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui (Base UI), deployed statically. See `CLAUDE.md` for the working rules (sanitization, sourcing) and `docs/PLAN.md` for the full vision and phased build plan.

`docs/` is gitignored — it holds private planning material, including an unsanitized FBT write-up with real client/account identifiers (`docs/fbt-original-PRIVATE.md`). Never remove it from `.gitignore`, and never copy content out of that specific file into anything public-facing; use the sanitized FBT notes in `docs/PLAN.md` instead.

## Status: Phase 1 (Foundation) complete

- Layout, nav (with mobile sheet menu), and footer
- Home, About, Experience (full timeline + certifications), Projects, Flagship Stories (teaser list — no interactive canvases yet), Now/Next
- Content lives in `src/data/*.ts`, separate from page components, so it can be edited without touching the framework
- GitHub Actions workflow (`.github/workflows/deploy.yml`) that lints, builds, and deploys to GitHub Pages on push to `main`
- SPA routing works on GitHub Pages via the standard 404.html redirect trick (`public/404.html` + a small unpack script in `index.html`) — needed because node URLs must be shareable per the plan

## Not done yet (Phase 2+)

- The five flagship interactive architecture canvases (FBT, air-gapped portal, Kafka strangler, DozLab, research) — currently just teaser cards on `/flagships`
- Per-node sample repos and code links
- Live build-status / uptime badge on the site itself

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run lint
```

### npm cache permissions

This machine's global npm cache (`~/.npm`) has some root-owned files from a prior `sudo npm` run, which blocks plain `npm install`. Fix once with:

```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```

Until then, installs in this repo were run with `npm_config_cache=/tmp/npm-cache-portfolio npm install ...` to avoid touching the broken cache.

## Content you should fill in

These are marked `TODO` directly in the data files — search for `TODO` under `src/data/`:

- `src/data/about.ts` — chess/basketball specifics, what actually fascinates you
- `src/data/nowNext.ts` — the specific agentic-AI project(s) you want to highlight
- `src/data/site.ts` — whether to publish your phone number
- `src/data/projects.ts` — GitHub links for ECO-T, Sherloc, ML Infrastructure (DozLab and your profile links are already filled in from your resume's PDF link annotations)

## Open decisions from docs/PLAN.md

- Domain: not yet registered (plan wants a `.dev` domain via the GitHub Student Pack / Name.com). `vite.config.ts`'s `base: '/'` assumes a custom domain at the repo root — if you deploy to `<user>.github.io/<repo>` instead, change it to `/<repo>/` and update `public/404.html`'s `segmentCount` to `1`.
- Which role/dates the Kafka strangler migration belongs to (currently placed under the Conclase role in `src/data/experience.ts`, consistent with the plan's description, but not resume-confirmed dates)
- What the Firecracker story is, if any
- GitHub repo hasn't been created yet — this is a local-only git repo for now
- **Layout mismatch:** `docs/PLAN.md`'s "Design references and final decisions" section specifies a Brittany Chiang-style two-column layout (sticky left intro/nav, scrolling right content). What's built is a conventional top-nav single-column layout instead — this predates that section landing in the plan. Not yet reconciled; see chat.
- Skills should be labeled production vs. lab experience (`src/data/skills.ts` now has the field, not yet filled in or wired into a page — same reason, holding for the layout decision)

## Deploying

Once you're ready to push:

1. Create a GitHub repo and add it as `origin`
2. In the repo's Settings → Pages, set Source to "GitHub Actions"
3. If using a custom domain, add a `public/CNAME` file containing the domain, and configure DNS
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically
