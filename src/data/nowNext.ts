export const now = [
  {
    title: "Finishing my M.Sc. in Computer Science at Texas A&M University",
    detail:
      "Expected December 2026. Coursework and research centered on machine unlearning, privacy, and autonomous systems.",
  },
  {
    title: "Building this site",
    detail:
      "The site is built from data files. A GitHub Actions pipeline lints it, builds it, and deploys it to GitHub Pages.",
    links: [
      { label: "Source", href: "https://github.com/dozman99/dozman99.github.io" },
      { label: "Pipeline", href: "https://github.com/dozman99/dozman99.github.io/actions/workflows/deploy.yml" },
    ],
  },
  {
    title: "Leading engineering at EDAT",
    detail:
      "VP of Engineering (volunteer), designing ECO-T (a full-stack GHG accounting and ESG-verification platform) and directing the engineering team.",
  },
  {
    // Kept brief until there's a specific project to point to.
    title: "Building retrieval-augmented generation (RAG) systems",
    detail: "I build RAG systems that answer from retrieved documents.",
  },
]

export const next = [
  {
    title: "Extending into AI infrastructure and inference engineering",
    detail:
      "This work builds on my Kubernetes experience. I share GPUs with MIG and time slicing, and serve models with engines such as vLLM and SGLang. I compare quantization trade-offs. I track the metrics that matter for inference: time to first token, KV cache usage, and GPU utilization.",
    flagshipSlug: "ai-inference-lab",
  },
]
