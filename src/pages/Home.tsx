import { Link } from "react-router-dom"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { canvases } from "@/data/canvases"
import { hero } from "@/data/home"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"
import { flagshipStatus, orderedFlagships } from "@/lib/flagshipStatus"


export default function Home() {
  return (
    <div>
      <section className="px-4 pt-16 pb-14 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{site.name}</h1>
        <p className="mt-2 text-base font-medium text-foreground/80">{site.role}</p>
        <p className="mt-4 max-w-xl text-base text-muted-foreground text-pretty">{hero.intro.join(" ")}</p>

        <dl className="mt-6 grid max-w-2xl gap-x-8 gap-y-4 sm:grid-cols-2">
          {hero.areas.map((area) => (
            <div key={area.label} className="border-l-2 border-primary/50 pl-3">
              <dt className="text-sm font-semibold text-foreground">{area.label}</dt>
              <dd className="mt-0.5 text-sm text-muted-foreground text-pretty">{area.text}</dd>
            </div>
          ))}
        </dl>

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          {hero.stats.map((stat) => (
            <div key={stat.value} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xl font-semibold tracking-tight text-foreground">{stat.value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="lg" className="h-10 px-4" render={<Link to="/experience" />}>
            View experience
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-10 px-4"
            render={<a href={site.resume} download="Chiedozie-Onyekwum-Resume.pdf" />}
          >
            <Download className="size-4" />
            Download résumé
          </Button>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Flagship stories</h2>
          <Link
            to="/projects"
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
                  to={hasCanvas ? `/flagships/${f.slug}` : `/projects#${f.slug}`}
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
