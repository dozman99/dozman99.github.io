import { Link } from "react-router-dom"
import { flagships } from "@/data/flagships"
import { tileSrc, workImages } from "@/data/work"
import { flagshipStatus } from "@/lib/flagshipStatus"

// Two columns, the right one dropped down, so the tiles step like a printed
// portfolio. Every story links to its own page; the four with a canvas open
// the interactive version, the other two a summary.
/** `anchors` gives each tile an id, so /projects#slug scrolls to it. */
export function WorkGrid({ anchors = false }: { anchors?: boolean }) {
  const items = workImages.flatMap((w, i) => {
    const f = flagships.find((x) => x.slug === w.slug)
    return f ? [{ ...w, f, n: String(i + 1).padStart(2, "0") }] : []
  })

  return (
    <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 md:gap-x-8 md:gap-y-24 md:pb-48">
      {items.map(({ slug, alt, f, n }, i) => (
        <li
          key={slug}
          id={anchors ? slug : undefined}
          className={i % 2 === 1 ? "scroll-mt-24 md:translate-y-48" : "scroll-mt-24"}
        >
          <Link to={`/flagships/${slug}`} className="group block">
            <div className="relative overflow-hidden bg-muted">
              <img
                src={tileSrc(slug)}
                alt={alt}
                width={1300}
                height={1625}
                loading={i < 2 ? "eager" : "lazy"}
                className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span className="absolute top-4 left-4 bg-background/85 px-1.5 py-0.5 font-mono text-xs text-foreground">
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
      ))}
    </ul>
  )
}
