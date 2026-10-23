import { Link } from "react-router-dom"
import { flagships } from "@/data/flagships"
import { workImages, workSet, type Shape } from "@/data/work"
import { flagshipStatus } from "@/lib/flagshipStatus"
import { cn } from "@/lib/utils"

const aspect: Record<Shape, string> = {
  tile: "aspect-[4/5]",
  wide: "aspect-video",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
}

// Home: three top-aligned rows on the 12-column grid, each pairing a wide and
// a tall shape so neither row is a wall of same-size tiles (the template's
// home section). Spans add to 12 per row.
const homeLayout: Record<string, { shape: Shape; span: string; sizes: string }> = {
  dozlab: { shape: "landscape", span: "md:col-span-7", sizes: "(min-width: 768px) min(56vw, 800px), 100vw" },
  fbt: { shape: "tile", span: "md:col-span-5", sizes: "(min-width: 768px) min(40vw, 560px), 100vw" },
  "ai-inference-lab": { shape: "landscape", span: "md:col-span-7", sizes: "(min-width: 768px) min(56vw, 800px), 100vw" },
  "kafka-strangler": { shape: "tile", span: "md:col-span-5", sizes: "(min-width: 768px) min(40vw, 560px), 100vw" },
  research: { shape: "portrait", span: "md:col-span-4", sizes: "(min-width: 768px) min(32vw, 460px), 100vw" },
  "air-gapped-portal": { shape: "wide", span: "md:col-span-8", sizes: "(min-width: 768px) min(64vw, 900px), 100vw" },
}

/**
 * The flagship stories as photo tiles. `home` is the curated mixed-shape
 * layout; `index` (Projects) is two equal 4:5 columns with the right one
 * dropped, like the template's work index. `anchors` gives each tile an id,
 * so /projects#slug scrolls to it.
 */
export function WorkGrid({ layout = "index", anchors = false }: { layout?: "home" | "index"; anchors?: boolean }) {
  const items = workImages.flatMap((w, i) => {
    const f = flagships.find((x) => x.slug === w.slug)
    return f ? [{ ...w, f, n: String(i + 1).padStart(2, "0") }] : []
  })
  const home = layout === "home"

  return (
    <ul
      className={
        home
          ? "grid items-start gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-24"
          : "grid gap-x-6 gap-y-14 md:grid-cols-2 md:gap-x-8 md:gap-y-24 md:pb-48"
      }
    >
      {items.map(({ slug, alt, f, n }, i) => {
        const cell = home ? homeLayout[slug] : undefined
        const shape: Shape = cell?.shape ?? "tile"
        const img = workSet(slug, shape)
        return (
          <li
            key={slug}
            id={anchors ? slug : undefined}
            className={cn("scroll-mt-24", cell?.span, !home && i % 2 === 1 && "md:translate-y-48")}
          >
            <Link to={`/flagships/${slug}`} className="group block">
              <div data-reveal className="relative overflow-hidden bg-muted">
                <img
                  {...img}
                  sizes={cell?.sizes ?? "(min-width: 768px) min(48vw, 680px), 100vw"}
                  alt={alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className={cn(
                    aspect[shape],
                    "h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none",
                  )}
                />
                <span className="absolute top-4 left-4 bg-background/85 px-1.5 py-0.5 text-xs text-foreground tabular-nums">
                  {n}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-2xl leading-tight font-medium tracking-tight text-pretty transition-colors group-hover:text-primary sm:text-[1.75rem]">
                  {f.title}
                </h3>
                <span className="shrink-0 text-sm text-muted-foreground">{f.where}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {f.depth} / {flagshipStatus(slug)}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
