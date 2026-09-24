# Portfolio Site

**Live at [dozman99.github.io](https://dozman99.github.io/).**

Personal site: Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui (Base UI), deployed statically. See `CLAUDE.md` for the working rules (sanitization, sourcing) and `docs/PLAN.md` for the full vision and phased build plan.

`docs/` is gitignored — it holds private planning material, including an unsanitized FBT write-up with real client/account identifiers (`docs/fbt-original-PRIVATE.md`). Never remove it from `.gitignore`, and never copy content out of that specific file into anything public-facing; use the sanitized FBT notes in `docs/PLAN.md` instead.

## Status

**Phase 1 (Foundation): complete.**

- Brittany Chiang-style two-column layout: sticky left sidebar (name, role, tagline, nav, socials) beside scrolling page content; mobile collapses to a top bar + sheet menu
- Home, About, Experience (full timeline + certifications), Projects, Flagship Stories, Now/Next
- Content lives in `src/data/*.ts`, separate from page components, so it can be edited without touching the framework
- GitHub Actions workflow (`.github/workflows/deploy.yml`) that lints, builds, and deploys to GitHub Pages on push to `main`
- SPA routing works on GitHub Pages via the standard 404.html redirect trick (`public/404.html` + a small unpack script in `index.html`) — needed because node URLs must be shareable per the plan
- Every route is prerendered to static HTML at build time (`src/entry-server.tsx` + `scripts/prerender.mjs`, run automatically as part of `npm run build`), so a plain fetch — crawlers, link-preview bots, AI agents that don't execute JavaScript — sees real content instead of an empty `<div id="root">`. Not hydration: the client bundle still does a normal `createRoot().render()` over the prerendered markup, so the app stays fully interactive; see the comment at the top of `src/entry-server.tsx`.

**Phase 2 (canvas framework): in progress — 3 of 6 flagships built.**

- Reusable interactive canvas at `/flagships/:slug` (`src/components/canvas/FlagshipCanvas.tsx` + `NodePanel.tsx`): click a node, a shadcn Sheet panel opens with why/how/what-was-hard and a code link, and the URL updates to `?node=<id>` so any node is directly shareable/bookmarkable. A canvas can optionally carry `studying`/`writing` lists (rendered below the canvas on its detail page) — currently only the AI Inference Lab uses them.
- Every flagship page also has a "Full breakdown" section (`FlagshipDetail.tsx`'s `NodeBreakdown`) with the same why/how/what-was-hard content written out in full, always in the page's HTML. The Sheet panels are empty in the DOM until JS opens them, so this is the only way that content reaches a plain fetch (crawlers, AI agents) — and it's a better read for humans skimming everything at once too.
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
npm run build    # type-check, build, SSR build, and prerender every route to dist/
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
- `src/data/experience.ts` — the Conclase bullets' metrics (client/account/team counts, timings, percentages) are plausible estimates the user asked to have filled in, not remembered facts — verify each one against what actually happened before this goes public (see the NOTE comment above the bullets array)

## Open decisions from docs/PLAN.md

- Custom `.dev` domain (plan wants one via the GitHub Student Pack / Name.com): not yet registered. Currently live at `dozman99.github.io` instead, which also serves from the root, so `vite.config.ts`'s `base: '/'` needs no change either way. If this ever moves to `<user>.github.io/<repo>` (a non-user-site repo) instead, change `base` to `/<repo>/` and `public/404.html`'s `segmentCount` to `1`.
- Which role/dates the Kafka strangler migration belongs to (currently placed under the Conclase role in `src/data/experience.ts`, consistent with the plan's description, but not resume-confirmed dates)
- Skills should be labeled production vs. lab experience (`src/data/skills.ts` has the field; not filled in — that's a judgment call only you can make — and not yet wired into a page). A natural place to surface it: a Sai Terukula-style skill card grid with a status label per card, possibly on a future dedicated section.
- Mobile behavior for the sidebar/top-bar split is built on standard Tailwind breakpoints. Window resize still doesn't work in this sandboxed browser for deliberate testing, but a canvas page was incidentally verified at an 802px-wide tab (below the `lg` breakpoint) and the mobile header/sheet menu rendered and worked correctly there.

## Deploying

Live via the `dozman99.github.io` user-site repo, which serves from the root (`https://dozman99.github.io/`) — matching `vite.config.ts`'s `base: '/'`, no path-prefix changes needed. Two gotchas hit while setting this up, in case this ever needs redoing (e.g. a repo rename or a fresh account):

1. **Pages defaults to the legacy Jekyll/branch build**, not our Actions workflow, the moment a `<user>.github.io` repo is pushed to, even though `.github/workflows/deploy.yml` also fires. Both deploy, and whichever finishes last wins — which was the legacy one, serving the raw unbuilt `index.html`. Fix: `gh api -X PUT repos/<user>/<repo>/pages -f build_type=workflow`, then re-run the Actions workflow so only it deploys from then on.
2. **The 404.html-redirect SPA-routing trick had a bug from Phase 1** that nothing caught until a real deep link was tested against real GitHub Pages: `404.html` encoded the path as `?p=/path`, but `index.html`'s decode script expects the bare `?/path` format with no key. Deep links (`/flagships/fbt`, `?node=<id>` links) silently landed on Home instead of erroring, so this was easy to miss. Fixed in both files — they now match the standard rafgraph/spa-github-pages format exactly. Verified live: a compound link like `/flagships/fbt?node=sqs-fifo` correctly opens that exact node's panel.

If using a custom domain instead: add a `public/CNAME` file containing the domain and configure DNS; `base: '/'` needs no change since the domain also serves from the root.
