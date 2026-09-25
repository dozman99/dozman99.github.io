import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { flagships } from "@/data/flagships"
import { canvases } from "@/data/canvases"
import { cn } from "@/lib/utils"
import { flagshipStatus, orderedFlagships } from "@/lib/flagshipStatus"
import { countWord } from "@/lib/numberWords"


export default function Home() {
  return (
    <div>
      <section className="px-4 pt-16 pb-14 sm:px-6 lg:pt-16">
        {/* Decorative photo (Pexels, marstion #10875411, free to use). Full bleed: the
            negative margins cancel the section padding and, on desktop, reach
            past the centered layout's padding to the right edge of the window. */}
        <div className="relative isolate -mx-4 -mt-16 mb-8 flex h-80 items-end px-4 pb-8 sm:-mx-6 sm:h-[26rem] sm:px-6 lg:-mr-[max(3rem,calc((100vw-72rem)/2+3rem))]">
          <img
            src="/robot-banner.webp"
            alt=""
            aria-hidden="true"
            width={1200}
            height={1800}
            fetchPriority="high"
            className="absolute inset-0 -z-10 size-full object-cover object-[50%_60%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--background)_0%,color-mix(in_oklch,var(--background)_85%,transparent)_18%,color-mix(in_oklch,var(--background)_45%,transparent)_45%,color-mix(in_oklch,var(--background)_15%,transparent)_75%,transparent_100%)]"
          />
          <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Infrastructure is the proof. Click into how it was built.
          </h1>
        </div>
        <p className="mt-4 max-w-xl text-base text-muted-foreground text-pretty">
          {countWord(flagships.length)} engineering stories told node by node: why each piece exists, how it works, and where it got hard.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button size="lg" className="h-10 px-4" render={<Link to="/flagships" />}>
            Explore the flagship stories
            <ArrowRight className="size-4" />
          </Button>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            About me
          </Link>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Flagship stories</h2>
          <Link
            to="/flagships"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            View all
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {orderedFlagships.map((f) => {
            const hasCanvas = f.slug in canvases
            return (
              <li key={f.slug}>
                <Link
                  to={hasCanvas ? `/flagships/${f.slug}` : `/flagships#${f.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-xl border p-5 transition-[border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 active:translate-y-0",
                    // Built stories are solid cards; teasers are open outlines.
                    hasCanvas ? "border-border bg-card" : "border-dashed border-foreground/20 bg-transparent",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-snug tracking-tight">{f.title}</h3>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{f.depth}</p>
                  <p className="mt-auto flex items-center gap-2 pt-4 font-mono text-xs text-muted-foreground">
                    <span>{f.where}</span>
                    <span aria-hidden="true">·</span>
                    <span className={hasCanvas ? "text-primary" : undefined}>{flagshipStatus(f.slug)}</span>
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
