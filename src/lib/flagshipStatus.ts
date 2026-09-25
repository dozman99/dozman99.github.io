import { canvases } from "@/data/canvases"

// One vocabulary for a flagship's state, wherever it's shown.
export function flagshipStatus(slug: string): string {
  if (slug in canvases) return "Interactive canvas"
  if (slug === "air-gapped-portal") return "Under NDA"
  return "Coming soon"
}
