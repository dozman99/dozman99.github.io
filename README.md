# Portfolio Site

Personal site: Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui (Base UI), deployed statically. See `CLAUDE.md` for the working rules (sanitization, sourcing) and `docs/PLAN.md` for the full vision and phased build plan.

`docs/` is gitignored — it holds private planning material, including an unsanitized FBT write-up with real client/account identifiers (`docs/fbt-original-PRIVATE.md`). Never remove it from `.gitignore`, and never copy content out of that specific file into anything public-facing; use the sanitized FBT notes in `docs/PLAN.md` instead.

## Status

**Phase 1 (Foundation): complete.**

- Brittany Chiang-style two-column layout: sticky left sidebar (name, role, tagline, nav, socials) beside scrolling page content; mobile collapses to a top bar + sheet menu
- Home, About, Experience (full timeline + certifications), Projects, Flagship Stories, Now/Next
- Content lives in `src/data/*.ts`, separate from page components, so it can be edited without touching the framework
- GitHub Actions workflow (`.github/workflows/deploy.yml`) that lints, builds, and deploys to GitHub Pages on push to `main`
- SPA routing works on GitHub Pages via the standard 404.html redirect trick (`public/404.html` + a small unpack script in `index.html`) — needed because node URLs must be shareable per the plan

**Phase 2 (canvas framework): in progress — 3 of 6 flagships built.**

- Reusable interactive canvas at `/flagships/:slug` (`src/components/canvas/FlagshipCanvas.tsx` + `NodePanel.tsx`): click a node, a shadcn Sheet panel opens with why/how/what-was-hard and a code link, and the URL updates to `?node=<id>` so any node is directly shareable/bookmarkable. A canvas can optionally carry `studying`/`writing` lists (rendered below the canvas on its detail page) — currently only the AI Inference Lab uses them.
- **FBT** (`src/data/canvases/fbt.ts`) is fully built from the sanitized notes in `docs/PLAN.md`. No sample repo exists yet, so every node shows "Sample repo coming soon" instead of a code link — per `CLAUDE.md`, don't add real (client-derived) code links here.
- **DozLab** (`src/data/canvases/dozlab.ts`) is fully built from DozLab's own public repos (`github.com/DozLab/*`, pulled via `gh api`, not invented) — architecture, tech stack, and code links are all real. This also resolved the open "what's the Firecracker story?" question: it's DozLab's `dozctl` + `dozlab-rootfs-manager` (Firecracker microVM lifecycle + image building). See `docs/PLAN.md`'s Supporting stories section.
- **AI Inference Infrastructure Lab** (`src/data/canvases/ai-inference-lab.ts`) — a 6th flagship, added after the original plan's five (see `docs/PLAN.md`'s note on this), covering GPU orchestration and LLM serving. Its 5 named sub-project repos don't exist publicly yet (confirmed via `gh api`, all 404), so every node is code-link-less for now, same as FBT. Linked from both `/flagships` and the Now/Next page.
- To add a flagship: create `src/data/canvases/<slug>.ts`, register it in `src/data/canvases/index.ts`, and it's automatically linked from `/flagships`, and from Experience/Projects/Now-Next if a `flagshipSlug` field points at it.
- Remaining: air-gapped portal (Samsung), Kafka strangler, research (Texas A&M) — still teaser cards on `/flagships`, no canvas yet.
- Not done: per-node sample repos for FBT or the AI Inference Lab, live build-status/uptime badge on the site itself.

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
- `src/data/site.ts` — whether to publish your phone number
- `src/data/projects.ts` — GitHub links for ECO-T, Sherloc, ML Infrastructure (DozLab and your profile links are already filled in from your resume's PDF link annotations)
- `src/data/experience.ts` — the Conclase bullets have several `[X]` placeholders (client counts, timings, percentages) that need real numbers before this goes public

## Open decisions from docs/PLAN.md

- Domain: not yet registered (plan wants a `.dev` domain via the GitHub Student Pack / Name.com). `vite.config.ts`'s `base: '/'` assumes a custom domain at the repo root — if you deploy to `<user>.github.io/<repo>` instead, change it to `/<repo>/` and update `public/404.html`'s `segmentCount` to `1`.
- Which role/dates the Kafka strangler migration belongs to (currently placed under the Conclase role in `src/data/experience.ts`, consistent with the plan's description, but not resume-confirmed dates)
- GitHub repo hasn't been created yet — this is a local-only git repo for now
- Skills should be labeled production vs. lab experience (`src/data/skills.ts` has the field; not filled in — that's a judgment call only you can make — and not yet wired into a page). A natural place to surface it: a Sai Terukula-style skill card grid with a status label per card, possibly on a future dedicated section.
- Mobile behavior for the sidebar/top-bar split is built on standard Tailwind breakpoints. Window resize still doesn't work in this sandboxed browser for deliberate testing, but a canvas page was incidentally verified at an 802px-wide tab (below the `lg` breakpoint) and the mobile header/sheet menu rendered and worked correctly there.

## Deploying

Once you're ready to push:

1. Create a GitHub repo and add it as `origin`
2. In the repo's Settings → Pages, set Source to "GitHub Actions"
3. If using a custom domain, add a `public/CNAME` file containing the domain, and configure DNS
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically
