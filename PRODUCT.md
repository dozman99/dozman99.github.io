# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: recruiters.** Non-technical screeners deciding in about 30 seconds whether Chiedozie fits a DevOps, platform, or MLOps/AI-infrastructure role. They need role fit, outcomes, and availability in plain words before anything else.

**Secondary: hiring managers and engineers.** Technical interviewers who click into engineering depth: architecture, trade-offs, what broke, and real code. The depth stays one click away from what recruiters see; it never leads at their expense.

## Product Purpose

Chiedozie Onyekwum's personal portfolio. It exists to get him a full-time role from January 2027, after he finishes his M.Sc. in Computer Science at Texas A&M University (December 2026).

Success is a convinced visitor emailing him. The résumé, LinkedIn, and GitHub support that action; they are not the goal.

The site should also show him as a person (chess, basketball, what fascinates him) and his dream: to lead an engineering organization that solves hard problems correctly.

## Positioning

"The infrastructure is the proof." Flagship stories are interactive architecture canvases built from real systems: a visitor clicks a node and gets why it exists, how it works, and what was hard, with a link to real code where it can be public and a shareable link for that node. The site itself is built from data files and deployed by a real pipeline (GitHub Actions lints, builds, and deploys it to GitHub Pages).

## Operating Context

- Visitors arrive from a job application, LinkedIn, or a shared node link, often on a phone, and skim before deciding whether to read.
- Recruiters forward the site or the résumé to hiring managers; a shared `?node=` link must land on the right part of the story.
- Every route is prerendered to static HTML so crawlers, link-preview bots, and AI agents that don't run JavaScript see the real content.
- DozLab runs on a home-lab k3s cluster that is not always on; its dated screenshots are the lasting proof, with a link to the live UI.

## Capabilities and Constraints

- Static site on GitHub Pages; no backend. Content lives in `src/data/*.ts`, separate from components.
- Six flagship stories: Feature Branch Testing + Environment Replication (Conclase), Air-Gapped Ban / Alerting Portal (Samsung), Strangler Migration with Kafka (Conclase), DozLab (side project), AI Inference Infrastructure Lab (side project), Machine Unlearning + Autonomous Vehicle Research (Texas A&M). Four have interactive canvases today (FBT, Kafka strangler, DozLab, AI Inference Lab); the Samsung portal and the research story are summaries only.
- **Never publish client identifiers:** no account IDs, client names, internal domains, hostnames, bucket names, or ticket prefixes. The FBT client is "a client"; never state its industry.
- Follow the sanitization rules in `CLAUDE.md` for every FBT detail.
- Sample repos use fake names, fake CIDRs, and toy apps, never client code. FBT and the AI Inference Lab have no public sample repos yet.
- Don't invent experience, metrics, or dates. The private plan (`docs/PLAN.md`, gitignored, never published) and the résumé are the sources of truth.
- The site is live in production: no placeholders, "coming soon", or claims waiting for a fact. A missing fact means the claim is removed, not stubbed.
- Label skills honestly: production vs lab experience.
- The phone number stays off the site unless Chiedozie decides otherwise.
- **Open decision:** which flagship leads, and whether all six stay or the list is cut to the strongest.

## Brand Commitments

- **Voice: plain words, no tool names in headline claims.** Describe the work, not the vendor (the Home focus areas follow this rule). Tool names belong in the technical depth, not the first read.
- **The dream is part of the product:** leading an engineering organization that solves hard problems correctly.
- **Chess and basketball are part of who he is** and belong in the site's personality, not only as a line on About.
- Name: Chiedozie Onyekwum. Role: DevOps / MLOps Engineer. Based in Austin, TX.

## Evidence on Hand

- Résumé: `public/resume.pdf` (includes the phone number).
- Headshot: `public/chiedozie.webp`.
- Conclase figures in `src/data/experience.ts`: 40+ clients (supplied by Chiedozie); 85+ production services, new environments in 2 hours instead of 3 days, and 35% fewer integration defects in staging are estimates written at his request and flagged there for a sanity check. None of them appears on the résumé. On 2026-10-09 Chiedozie decided all four stay on the site; cite them as Conclase figures, never as résumé facts.
- DozLab proof: dated screenshots (October 1, 2026) in `public/dozlab/`, architecture diagrams (`public/dozlab/*.webp`, `public/dozlab/diagrams/`), public code at `github.com/DozLab`, and a live UI that is not always on.
- Experience timeline, education (Texas A&M M.Sc., GPA 3.85; University of Port Harcourt B.Eng.), leadership roles, and five certifications in `src/data/`.
- **Absent, never fabricate:** testimonials, references, client logos, uptime or traffic numbers, public FBT or AI Inference Lab code, and a live build-status display (planned, not built).

## Product Principles

1. **Recruiter first, depth one click away.** The first read answers fit, outcomes, and availability in plain language; engineering depth is always reachable and never hidden, but never leads.
2. **Proof over claims.** Show the working system, the dated screenshot, the real code, and the honest status. An unbacked claim is cut, not softened.
3. **Every path ends at an email.** A convinced visitor should never have to look for how to reach him.
4. **Sanitized and true.** Real work, no client identifiers, no invented numbers.
5. **A person, not a résumé.** The dream, chess, and basketball are part of the story.
