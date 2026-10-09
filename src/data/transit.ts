// The Home network map: each flagship is a transit line, each component a station named in
// plain words. Station details (why / how / what was hard / code) come from the flagship's
// canvas data, so the map and the flagship page never disagree; this file only adds the
// plain-language layer a recruiter reads first.

export type LineColor = "blue" | "green" | "orange" | "purple" | "yellow" | "brown"

export interface Station {
  /** Node id in the flagship's canvas data. */
  nodeId: string
  /** Short code printed on the map, in line order. */
  code: string
  /** What the station does, in plain words. Tool names stay in the canvas label. */
  name: string
}

export interface ServiceNote {
  text: string
  /** Where the figure comes from, shown beside it. */
  origin: string
}

export interface Line {
  slug: string
  color: LineColor
  name: string
  where: string
  /** One plain sentence: what this system does for people. */
  summary: string
  stations: Station[]
  /** A short second track in the same colour (e.g. the teardown path). */
  branch?: { name: string; stations: Station[] }
  notes: ServiceNote[]
}

// FBT first: paid work with outcomes a recruiter can read. DozLab second: the proof
// anyone can click into.
export const homeLines: Line[] = [
  {
    slug: "fbt",
    color: "blue",
    name: "An environment for every branch",
    where: "Client work at Conclase",
    summary:
      "Every test branch gets its own isolated copy of the product, built when the branch is pushed and deleted when it merges.",
    stations: [
      { nodeId: "api-gateway", code: "F1", name: "Receives the branch push" },
      { nodeId: "webhook-filter", code: "F2", name: "Keeps only test branches" },
      { nodeId: "sqs-fifo", code: "F3", name: "Lines up one build per ticket" },
      { nodeId: "build-lambda", code: "F4", name: "Builds the environment" },
      { nodeId: "per-branch-ecs", code: "F5", name: "The branch's own copy of the product" },
    ],
    branch: {
      name: "Teardown",
      stations: [
        { nodeId: "api-gateway-destroy", code: "T1", name: "Hears the merge" },
        { nodeId: "teardown", code: "T2", name: "Deletes everything it built" },
      ],
    },
    notes: [
      { text: "New environments in 2 hours instead of 3 days", origin: "Conclase, 2022–2025" },
      { text: "35% fewer integration defects reaching staging", origin: "Conclase, 2022–2025" },
      { text: "40+ clients, 85+ production services", origin: "Conclase, 2022–2025" },
      { text: "Client code is private", origin: "Shown as a system, not a repo" },
    ],
  },
  {
    slug: "dozlab",
    color: "green",
    name: "A lab for every student",
    where: "My own platform, DozLab",
    summary:
      "Every student gets the same lab in the browser, on a virtual machine of their own, with nothing to install.",
    stations: [
      { nodeId: "frontend", code: "D1", name: "Opens the lab in the browser" },
      { nodeId: "api", code: "D2", name: "Signs you in and records the session" },
      { nodeId: "controller", code: "D3", name: "Builds and tracks the lab" },
      { nodeId: "init-container", code: "D4", name: "Prepares the lab's disk" },
      { nodeId: "vm", code: "D5", name: "Your own isolated machine" },
      { nodeId: "sidecars", code: "D6", name: "Terminal and editor in the browser" },
    ],
    notes: [
      { text: "The code is public", origin: "github.com/DozLab" },
      { text: "Screenshots of it running", origin: "Taken October 1, 2026" },
      { text: "Runs in my home lab, not always on", origin: "Live UI linked on the story" },
    ],
  },
]

// Lines that aren't drawn on the Home map: colour and a letter no other line uses.
export const otherLines: Record<string, { color: LineColor; letter: string }> = {
  "kafka-strangler": { color: "orange", letter: "K" },
  "ai-inference-lab": { color: "purple", letter: "I" },
  "air-gapped-portal": { color: "yellow", letter: "P" },
  research: { color: "brown", letter: "R" },
}
