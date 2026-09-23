// Personal content for the About page. Facts here are limited to what's confirmed —
// the TODOs mark spots that need your specifics, not placeholders to publish as-is.

export const aboutIntro = [
  "I'm a DevOps/MLOps engineer who likes systems with real failure modes: infrastructure that has to survive an air-gapped network, a branch-per-feature testing pipeline that a whole engineering team depends on, a Jetson board that has to make navigation decisions in real time.",
  "I'm finishing an M.Sc. in Computer Science at Texas A&M (expected Dec 2026), researching machine unlearning, privacy, and autonomous systems, on top of several years building and running production infrastructure across healthcare, fintech, and semiconductor environments.",
]

export const dream =
  "The long-term goal is to build a genuinely robust organization: one that takes on hard, real problems and has the engineering discipline to actually solve them, not just ship around them. Everything from feature-branch testing pipelines to ESG accounting platforms has been practice for that: build it so it holds up under real use, real load, real failure."

export interface Interest {
  title: string
  // TODO: this is the one-line placeholder. Replace with your own specifics —
  // e.g. what you're actually working on in chess, what draws you to it, competitive level, etc.
  description: string
}

export const interests: Interest[] = [
  {
    title: "Chess",
    description:
      "TODO: add your specifics, such as rating/level, what you're studying right now, and what the game scratches that engineering doesn't.",
  },
  {
    title: "Basketball",
    description:
      "TODO: add your specifics, such as pickup, league, position, and what you like about it.",
  },
  {
    title: "What fascinates me",
    description:
      "TODO: name the actual topics (e.g. distributed systems, agentic AI, autonomous systems), whatever genuinely pulls your attention outside of work hours.",
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
