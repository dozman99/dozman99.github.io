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
      "Terraform owns the persistent shared infrastructure. For each feature branch, a Bitbucket webhook triggers Lambda-rendered CloudFormation that creates and later deletes a fully isolated, disposable environment.",
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
    where: "Conclase",
    depth: "Distributed systems, event-driven design",
    teaser:
      "Moving a monolith off RabbitMQ's push delivery, strangler style: responsibility shifted into microservices one environment at a time, with Kafka as a pull-based backbone so one stuck worker can't stall the whole pipeline.",
  },
  {
    slug: "dozlab",
    title: "DozLab",
    where: "Side project",
    depth: "Building a platform on Kubernetes",
    teaser:
      "I built DozLab after I tutored DevOps students and had to fix each student's Mac, Linux or Windows setup before a lab could start. DozLab is a multi-tenant SaaS platform that I built on Kubernetes, with sidecar containers, VM-backed hands-on labs, and real-time WebSocket proxying for a DevOps/security education product.",
  },
  {
    slug: "ai-inference-lab",
    title: "AI Inference Infrastructure Lab",
    where: "Side project",
    depth: "GPU orchestration and LLM serving",
    teaser:
      "An end-to-end LLM serving lab on Kubernetes: open-weight models deployed across multiple serving engines, GPUs shared with MIG and time slicing. I measure latency and cost per request for each model.",
  },
  {
    slug: "research",
    title: "Machine Unlearning + Autonomous Vehicle Research",
    where: "Texas A&M",
    depth: "Privacy, security, and autonomous systems",
    teaser:
      "Graduate research spanning machine unlearning for privacy and security, PKI/blockchain approaches to decentralizing Certificate Authorities, and a Jetson-based autonomous vehicle proof of concept running YOLOv8 and LaneNet.",
  },
]
