# Portfolio site — Claude Code instructions

This repo is Chiedozie Onyekwum's personal portfolio. The full plan, every decision made so far, and all source material live in `docs/PLAN.md`. Read it before doing anything, and treat it as the source of truth.

## Who this is for

Chiedozie is a DevOps / MLOps / AI engineer (M.Sc. CS at Texas A&M, previously Samsung, Conclase, Gwrite). The site should make interviewers curious: they skim in 30 seconds or click into real engineering depth. It should also show him as a person: chess, basketball, what fascinates him, and his dream of building a robust organization that solves real problems.

## Core idea

The infrastructure is the proof. The site is deployed through a real pipeline, and each flagship story is an interactive architecture canvas: click a node, a panel explains why, how, and what broke, with a link to code and a shareable URL for that node.

## Stack and hosting

- Static site on GitHub Pages, custom `.dev` domain, deployed by GitHub Actions (lint, build, link check, deploy).
- Static site generator (Astro preferred) or plain HTML/JS. No backend.
- Story content lives in data files (one per flagship), separate from the canvas component.
- Layout: Brittany Chiang-style two-column (sticky left intro/nav, scrolling right content), mobile-first.

## Build order

1. Phase 1: Home, About, Experience, Projects, Now/Next, Actions pipeline.
2. Phase 2: canvas framework, built with FBT as the first flagship.
3. Phase 3: remaining flagships (air-gapped Samsung, Kafka strangler, DozLab, research).
4. Phase 4: shareable node links, build status on the site, "ask my portfolio" agent.

Ship Phase 1 live before starting Phase 2.

## Rules

- **Never publish client identifiers.** No AWS account IDs, client names, internal domains, hostnames, bucket names, or ticket prefixes. The FBT client is "a healthcare client." Follow the sanitization checklist in `docs/PLAN.md`.
- **Never describe the open FBT webhook** except as a generic hardening lesson, and only once Chiedozie confirms it's fixed.
- Sample repos use fake names, fake CIDRs and toy apps, never client code.
- Don't invent experience, metrics or dates. If a fact isn't in `docs/PLAN.md` or `docs/resume.pdf`, ask.
- Keep `docs/` out of the public build (it contains private notes). Add it to the site's ignore/exclude config.
- Label skills honestly (production vs lab experience).

## Open questions (ask before assuming)

- Which local code can be shared publicly, and what must be sanitized?
- Which role and dates does the Kafka strangler migration belong to?
- What is the Firecracker story?
- Should any flagship have a live runnable demo, or are canvases plus code enough?
