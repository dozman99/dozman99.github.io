// Homepage hero. Numbers match the Conclase bullets in experience.ts; change both together.

// The large statement on the home page: sentences two and three of
// aboutIntro[0] in about.ts. Change both together.
export const statement =
  "I start by identifying how infrastructure can fail, then design it to keep applications and AI services running when failures occur. I make changes in small, reversible steps and measure the results before trusting them."

// The closing contact panel on the home page.
export const contact = {
  headline: "Building something that has to stay up? Let's talk.",
  line: "Available for full-time platform, DevOps and AI infrastructure roles from January 2027.",
}

export const hero = {
  intro: [
    "I build and maintain the infrastructure that applications and AI services run on, from the first commit to long after launch. I keep it secure, stable, and quick to deploy to, and I design it to heal itself, so the services it hosts run with zero downtime.",
    "M.Sc. Computer Science, Texas A&M University, December 2026.",
    "Open to full-time roles from January 2027.",
  ],
  // What I work on, in plain words. No tool names: the work, not the vendor.
  areas: [
    { label: "Cloud platforms on AWS and Azure", text: "Platforms that scale with demand and recover on their own." },
    { label: "Infrastructure as code for 40+ clients", text: "Every environment written down, reviewed, and rebuilt the same way every time." },
    { label: "Kubernetes and AI inference", text: "Models taken from experiment to a service that teams can depend on." },
    { label: "Secure delivery, air-gapped included", text: "Clear, tested code that the next engineer can read and change safely." },
  ],
  stats: [
    { value: "40+ clients", label: "and 85+ production services" },
    { value: "3 days → 2 hours", label: "to create a new environment" },
    { value: "35% fewer", label: "integration defects in staging" },
  ],
}
