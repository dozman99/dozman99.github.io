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

export const workImage = (slug: string) => workImages.find((w) => w.slug === slug)

// Each shape is exported at several widths: the first is the full size
// (name.webp), the rest are name-<width>.webp for phones and small columns.
export const shapes = {
  tile: { ratio: 4 / 5, widths: [1300, 700] },
  wide: { ratio: 16 / 9, widths: [2680, 1400, 800] },
  landscape: { ratio: 4 / 3, widths: [1600, 800] },
  portrait: { ratio: 3 / 4, widths: [1200, 700] },
} as const
export type Shape = keyof typeof shapes

/** src, srcSet, width and height for `base` (a path without .webp) in a shape. */
export function imageSet(base: string, shape: Shape) {
  const { ratio, widths } = shapes[shape]
  const file = (w: number, i: number) => (i === 0 ? `${base}.webp` : `${base}-${w}.webp`)
  return {
    src: file(widths[0], 0),
    srcSet: widths.map((w, i) => `${file(w, i)} ${w}w`).join(", "),
    width: widths[0],
    height: Math.round(widths[0] / ratio),
  }
}

export const workSet = (slug: string, shape: Shape) => imageSet(`/work/${slug}-${shape}`, shape)
export const tileSrc = (slug: string) => workSet(slug, "tile").src
