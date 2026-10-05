// Personal content for the About page. Facts here are limited to what's confirmed.

export const aboutIntro = [
  "I'm a DevOps / MLOps engineer. I start with how a system can fail, then design it to keep working when that happens. I change systems in small, reversible steps and measure the result before I trust it. When something breaks, I find the root cause, fix it, and write down what I learned so the team can use it.",
  "I'm finishing an M.Sc. in Computer Science at Texas A&M University (expected Dec 2026), where I research machine unlearning, privacy, and autonomous systems. I have also spent six years building and running production infrastructure across healthcare, fintech, and semiconductor environments.",
]

export const dream =
  "My goal is to lead an engineering organization that solves hard problems correctly. Each project taught me to design for load and failure."

export interface Interest {
  title: string
  // Kept intentionally brief where specifics aren't filled in yet — replace
  // with real detail (rating, league, etc.) whenever you want to.
  description: string
}

export const interests: Interest[] = [
  {
    title: "Chess",
    description: "Casual games, always chasing the next good one.",
  },
  {
    title: "Basketball",
    description: "Pickup ball whenever I can get a run in.",
  },
  {
    title: "What fascinates me",
    description:
      "I study distributed systems and AI infrastructure.",
  },
]

export const education = [
  {
    school: "Texas A&M University",
    degree: "M.Sc., Computer Science",
    detail: "GPA 3.85 · Expected Dec 2026",
  },
  {
    school: "University of Port Harcourt",
    degree: "B.Eng., Mechanical Engineering",
    detail: "",
  },
]

// Mirrors the "next role" answer on the user's job-board profile; keep them in sync.
export const lookingFor = {
  intro: "I'm looking for a team, a people, a company to believe in.",
  points: [
    {
      label: "Role",
      text: "DevOps, platform, or MLOps/AI infrastructure engineering, where I own infrastructure end to end: IaC, CI/CD, Kubernetes, observability and on-call.",
    },
    {
      label: "Tech",
      text: "AWS, Azure, Terraform, Kubernetes, Go and Python, and increasingly GPU orchestration and LLM serving.",
    },
    {
      label: "Team",
      text: "Engineers who build systems to hold up under production use, load and failure, who write things down, and who treat incidents as something to learn from.",
    },
    {
      label: "Timing",
      text: "I finish my master's in Computer Science at Texas A&M University in December 2026.",
    },
  ],
}
