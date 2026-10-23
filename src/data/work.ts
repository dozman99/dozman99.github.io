// Photos for the flagship stories, in the order the grid shows them. Each has an
// upright tile (4:5) for grids and a wide crop (16:9) for the story's header.
// Sources and crop notes: ~/Pictures/portfolio-lexington/README.md (not in the repo).

export interface WorkImage {
  slug: string
  alt: string
}

export const workImages: WorkImage[] = [
  { slug: "dozlab", alt: "Rows of blue cubes marked with the Kubernetes logo, joined by light" },
  { slug: "fbt", alt: "Water channels branching across wet sand" },
  { slug: "research", alt: "A pencil eraser rubbing marks off white paper" },
  { slug: "kafka-strangler", alt: "Blue network cables fanning out from a lit patch panel" },
  { slug: "air-gapped-portal", alt: "A row of server drive bays with green status lights" },
  { slug: "ai-inference-lab", alt: "Close-up of a silicon chip's grid, glowing copper" },
]

export const tileSrc = (slug: string) => `/work/${slug}-tile.webp`
export const wideSrc = (slug: string) => `/work/${slug}-wide.webp`
export const workImage = (slug: string) => workImages.find((w) => w.slug === slug)
