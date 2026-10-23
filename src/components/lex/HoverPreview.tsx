import { workImage, workSet } from "@/data/work"

// The floating photo for a list marked data-preview-list={id}; rows marked
// data-preview-index={slug} show that story's photo. Moved by src/lib/motion.ts,
// hover devices only. Decorative: the rows carry the real links.
export function HoverPreview({ id, slugs }: { id: string; slugs: string[] }) {
  return (
    <div
      data-preview={id}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 hidden aspect-[4/5] w-56 scale-[0.92] overflow-hidden bg-muted opacity-0 [@media(hover:hover)]:block"
    >
      {slugs.map((slug) =>
        workImage(slug) ? (
          <img
            key={slug}
            {...workSet(slug, "tile")}
            sizes="224px"
            alt=""
            data-preview-image={slug}
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-0"
          />
        ) : null,
      )}
    </div>
  )
}
