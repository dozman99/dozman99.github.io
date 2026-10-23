import { canvases } from "@/data/canvases"
import { flagships } from "@/data/flagships"

// One vocabulary for a flagship's state, wherever it's shown.
export function flagshipStatus(slug: string): string {
  if (slug in canvases) return "Architecture deep dive"
  if (slug === "air-gapped-portal") return "Overview, under NDA"
  return "Overview"
}

/** Flagships with a built canvas first, teasers after; stable within each group. */
export const orderedFlagships = [...flagships].sort(
  (a, b) => Number(b.slug in canvases) - Number(a.slug in canvases),
)
