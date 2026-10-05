// Homepage hero. Numbers match the Conclase bullets in experience.ts; change both together.

export const hero = {
  intro: [
    "I build cloud platforms and the pipelines that deploy to them.",
    "M.Sc. Computer Science, Texas A&M University, December 2026.",
    "Open to full-time roles from January 2027.",
  ],
  // What I work on, kept vendor-neutral.
  areas: [
    { label: "Cloud", items: ["Infrastructure as code", "Container orchestration", "Networking and security", "Observability"] },
    { label: "On-prem", items: ["Air-gapped environments", "Self-hosted clusters", "Virtual machines", "Offline CI/CD"] },
    { label: "AI / ML", items: ["ML pipelines", "Model serving", "GPU scheduling", "Retrieval (RAG)"] },
    { label: "Software", items: ["Backend APIs", "Web apps", "Automation", "Developer tooling"] },
  ],
  stats: [
    { value: "40+ clients", label: "and 85+ production services" },
    { value: "3 days → 2 hours", label: "to create a new environment" },
    { value: "35% fewer", label: "integration defects in staging" },
  ],
}
