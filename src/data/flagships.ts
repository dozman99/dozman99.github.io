// The flagship interactive architecture canvases. Not all of these have a
// built canvas yet — see src/data/canvases/index.ts for which ones do;
// Flagships.tsx checks membership there directly rather than a status flag.

export interface Flagship {
  slug: string
  title: string
  where: string
  depth: string
  teaser: string
}

export const flagships: Flagship[] = [
  {
    slug: "fbt",
    title: "Feature Branch Testing + Environment Replication",
    where: "Conclase",
    depth: "Platform engineering, Terraform at scale",
    teaser:
      "A hybrid system where Terraform owns persistent shared infrastructure and Lambda-rendered CloudFormation spins up and tears down fully isolated, disposable per-branch environments, triggered straight off Bitbucket webhooks.",
  },
  {
    slug: "air-gapped-portal",
    title: "Air-Gapped Ban / Alerting Portal",
    where: "Samsung",
    depth: "Shipping into a network with no internet",
    teaser:
      "A full-stack portal (React, FastAPI, PostgreSQL) with SAML/SSO and AI-driven opt-out detection, deployed via a custom PowerShell CI/CD pipeline into a secured, air-gapped environment with full audit logging.",
  },
  {
    slug: "kafka-strangler",
    title: "Strangler Migration with Kafka",
    where: "Not yet on the resume",
    depth: "Distributed systems, event-driven design",
    teaser:
      "Peeling responsibility off a large monolith piece by piece: new microservices, a Kafka topology built from scratch, dual writes, and the ordering and state-drift problems that come with it.",
  },
  {
    slug: "dozlab",
    title: "DozLab",
    where: "Side project",
    depth: "Building a platform on Kubernetes",
    teaser:
      "Not just running Kubernetes, but building a multi-tenant SaaS platform on it: sidecar containers, VM-backed hands-on labs, and real-time WebSocket proxying for a DevOps/security education product.",
  },
  {
    slug: "ai-inference-lab",
    title: "AI Inference Infrastructure Lab",
    where: "Side project",
    depth: "GPU orchestration and LLM serving, measured not assumed",
    teaser:
      "An end-to-end LLM serving lab on Kubernetes: open-weight models deployed across multiple serving engines, GPUs shared with MIG and time slicing, and every token's latency and cost tracked against real metrics, not claims.",
  },
  {
    slug: "research",
    title: "Machine Unlearning + Autonomous Vehicle Research",
    where: "Texas A&M",
    depth: "A rare differentiator for a DevOps profile",
    teaser:
      "Graduate research spanning machine unlearning for privacy and security, PKI/blockchain approaches to decentralizing Certificate Authorities, and a Jetson-based autonomous vehicle proof of concept running YOLOv8 and LaneNet.",
  },
]
