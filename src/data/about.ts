// Personal content for the About page. Facts here are limited to what's confirmed.

export const aboutIntro = [
  "I'm a DevOps/MLOps engineer who likes systems with real failure modes: infrastructure that has to survive an air-gapped network, a branch-per-feature testing pipeline that a whole engineering team depends on, a Jetson board that has to make navigation decisions in real time.",
  "I'm finishing an M.Sc. in Computer Science at Texas A&M (expected Dec 2026), researching machine unlearning, privacy, and autonomous systems, on top of several years building and running production infrastructure for clients and in semiconductor environments.",
]

export const dream =
  "The long-term goal is to build a genuinely robust organization: one that takes on hard, real problems and has the engineering discipline to actually solve them, not just ship around them. Everything from feature-branch testing pipelines to ESG accounting platforms has been practice for that: build it so it holds up under real use, real load, real failure."

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
      "Distributed systems and AI infrastructure: the intersection is where I've been spending my attention lately.",
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
