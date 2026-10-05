export interface Project {
  name: string
  description: string
  tags: string[]
  // TODO: add real repo URLs as they become public/shareable. Empty = no link rendered.
  githubUrl: string
  /** Slug into src/data/canvases, if this project has a full interactive flagship canvas. */
  flagshipSlug?: string
}

export const projects: Project[] = [
  {
    name: "DozLab",
    description:
      "I built DozLab after I tutored DevOps students. Too much lab time went to fixing each student's machine (Mac, Linux, Windows, different OS versions). DozLab gives every student the same environment in the browser. A custom LabSession CRD and controller create one pod per student session, with a Firecracker microVM, a WebSocket terminal sidecar, and a VS Code sidecar. It is built with Go, Nuxt.js/Vue, and PostgreSQL.",
    tags: ["Kubernetes", "Firecracker", "Go", "Nuxt/Vue", "WebSockets"],
    githubUrl: "https://github.com/DozLab",
    flagshipSlug: "dozlab",
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
