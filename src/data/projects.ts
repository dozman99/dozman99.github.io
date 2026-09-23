export interface Project {
  name: string
  description: string
  tags: string[]
  // TODO: add real repo URLs as they become public/shareable. Empty = no link rendered.
  githubUrl: string
}

export const projects: Project[] = [
  {
    name: "DozLab",
    description:
      "Cloud-native Kubernetes SaaS platform for DevOps/cybersecurity education: microservice architecture with sidecar containers, VM-based hands-on labs, and real-time WebSocket proxying.",
    tags: ["Kubernetes", "Microservices", "WebSockets"],
    githubUrl: "https://github.com/DozLab",
  },
  {
    name: "ECO-T",
    description:
      "Full-stack GHG accounting platform covering Scope 1/2/3 emissions, API integrations with EPA, ERP systems and energy grids, carbon pricing & offsets, and Sankey diagram production. Built while leading engineering at EDAT.",
    tags: ["Full-Stack", "AI/ML Pipelines", "ESG"],
    githubUrl: "",
  },
  {
    name: "Sherloc",
    description:
      "AI-powered root cause analysis platform enhancing team collaboration and incident communication.",
    tags: ["AI/ML", "Incident Response"],
    githubUrl: "",
  },
  {
    name: "ML Infrastructure",
    description:
      "Optimized Kubernetes-based ML workflows using Kubeflow for pipeline orchestration and reproducibility.",
    tags: ["Kubeflow", "MLOps", "Kubernetes"],
    githubUrl: "",
  },
]
