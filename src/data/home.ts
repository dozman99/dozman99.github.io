// Homepage hero. Numbers match the Conclase bullets in experience.ts; change both together.

export const hero = {
  intro: [
    "I build cloud platforms and the pipelines that deploy to them.",
    "M.Sc. Computer Science, Texas A&M University, December 2026.",
    "Open to full-time roles from January 2027.",
  ],
  // Where I work. Every item appears in Experience, Projects or the flagship stories.
  areas: [
    { label: "Cloud", items: ["AWS", "Azure", "Terraform", "Kubernetes"] },
    { label: "On-prem", items: ["Air-gapped deploys", "k3s", "Firecracker microVMs", "PowerShell CI/CD"] },
    { label: "AI / ML", items: ["Kubeflow", "MLflow", "vLLM and SGLang", "GPU sharing with MIG"] },
    { label: "Software", items: ["Go", "Python", "TypeScript", "React and FastAPI"] },
  ],
  stats: [
    { value: "40+ clients", label: "and 85+ production services on AWS" },
    { value: "3 days → 2 hours", label: "to create a new environment" },
    { value: "35% fewer", label: "integration defects in staging" },
  ],
}
