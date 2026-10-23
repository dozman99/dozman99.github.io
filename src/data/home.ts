// Homepage hero. Numbers match the Conclase bullets in experience.ts; change both together.

// The large statement on the home page: the first three sentences of
// aboutIntro[0] in about.ts. Change both together.
export const statement =
  "I'm a DevOps / MLOps engineer. I start with how a system can fail, then design it to keep working when that happens. I change systems in small, reversible steps and measure the result before I trust it."

export const hero = {
  intro: [
    "I own systems end to end: built secure, run reliably, shipped fast. Applications and AI services that recover without a page at 3 a.m.",
    "M.Sc. Computer Science, Texas A&M University, December 2026.",
    "Open to full-time roles from January 2027.",
  ],
  // What I work on, in plain words. No tool names: the work, not the vendor.
  areas: [
    { label: "Cloud", text: "Platforms that scale with demand and recover on their own." },
    { label: "Infrastructure as code", text: "Every environment written down, reviewed, and rebuilt the same way every time." },
    { label: "AI and machine learning", text: "Models taken from experiment to a service that teams can depend on." },
    { label: "Software engineering", text: "Clear, tested code that the next engineer can read and change safely." },
  ],
  stats: [
    { value: "40+ clients", label: "and 85+ production services" },
    { value: "3 days → 2 hours", label: "to create a new environment" },
    { value: "35% fewer", label: "integration defects in staging" },
  ],
}
