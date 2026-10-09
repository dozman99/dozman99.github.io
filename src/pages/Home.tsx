import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check, Copy, FileText, Mail } from "lucide-react"
import { LineBullet, NetworkMap } from "@/components/transit/NetworkMap"
import { dream, interests } from "@/data/about"
import { canvases } from "@/data/canvases"
import { flagships } from "@/data/flagships"
import { hero } from "@/data/home"
import { site } from "@/data/site"
import { otherLines } from "@/data/transit"
import { lineStyle } from "@/lib/transit"
import { cn } from "@/lib/utils"

/** The one action that matters: email, with the address shown and copyable in case mail links don't open. */
function EmailAction({ size = "lg", children }: { size?: "lg" | "md"; children?: ReactNode }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard refused: select the address so it can be copied by hand.
      const el = document.getElementById(`email-${size}`)
      if (el) window.getSelection()?.selectAllChildren(el)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <a
        href={`mailto:${site.email}`}
        className={cn(
          "inline-flex items-center gap-3 rounded-lg bg-[var(--t-ink)] font-bold text-[var(--t-ground)] transition-transform duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
          size === "lg" ? "min-h-14 px-6 text-lg" : "min-h-12 px-5 text-base",
        )}
      >
        <Mail className="size-5" />
        Email me
      </a>
      <span className="inline-flex items-center gap-1">
        <span id={`email-${size}`} className="t-mono text-[0.95rem] font-semibold select-all">
          {site.email}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Email address copied" : "Copy email address"}
          className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-[color,transform] hover:text-foreground active:scale-90"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </span>
      {children}
    </div>
  )
}

export default function Home() {
  const [degree, availability] = [hero.intro[1], hero.intro[2]]
  const others = flagships.filter((f) => f.slug in otherLines)
  const offTheClock = interests.filter((i) => i.title === "Chess" || i.title === "Basketball")

  return (
    <div>
      <section className="mx-auto max-w-[88rem] px-4 pt-7 pb-8 sm:px-8 sm:pt-12 sm:pb-10">
        <h1 className="max-w-[24ch] text-[clamp(2rem,4.1vw,3.6rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance">
          {site.tagline}
        </h1>
        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{degree}</p>
        <p className="mt-2 inline-flex items-center gap-3 text-base font-bold sm:text-lg">
          <span
            aria-hidden="true"
            className="size-3.5 rounded-full bg-[var(--line-green)] shadow-[0_0_0_4px_color-mix(in_oklch,var(--line-green)_25%,transparent)]"
          />
          {availability}
        </p>
        <div className="mt-5">
          <EmailAction>
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-[var(--t-rule)] decoration-2 underline-offset-4 transition-colors hover:decoration-[var(--t-ink)]"
            >
              <FileText className="size-4" />
              Résumé (PDF)
            </a>
          </EmailAction>
        </div>
      </section>

      <NetworkMap />

      <section aria-labelledby="other-lines" className="border-t border-border">
        <div className="mx-auto max-w-[88rem] px-4 py-14 sm:px-8 sm:py-20">
          <h2 id="other-lines" className="text-3xl leading-tight font-extrabold tracking-[-0.02em] sm:text-4xl">
            More lines on the network
          </h2>
          <ul className="mt-8 border-t border-[var(--t-ink)]">
            {others.map((f) => {
              const { color, letter } = otherLines[f.slug]
              const interactive = f.slug in canvases
              return (
                <li key={f.slug} style={lineStyle(color)} className="border-b border-border">
                  <Link
                    to={interactive ? `/flagships/${f.slug}` : `/projects#${f.slug}`}
                    className="group grid min-h-11 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-1 py-5 transition-colors sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  >
                    <LineBullet color={color} letter={letter} />
                    <span className="min-w-0">
                      <span className="block text-xl leading-snug font-extrabold tracking-[-0.01em] text-balance group-hover:underline group-hover:decoration-[var(--lc)] group-hover:decoration-[3px] group-hover:underline-offset-4">
                        {f.title}
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-muted-foreground">
                        {f.where}
                        <span aria-hidden="true" className="mx-2">·</span>
                        {f.depth}
                      </span>
                    </span>
                    <span className="col-start-2 inline-flex items-center gap-2 text-sm font-semibold sm:col-start-3">
                      {interactive ? "Explore the map" : "Read the summary"}
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="headed" className="border-t border-border bg-[color-mix(in_oklch,var(--t-ink)_4%,var(--t-ground))]">
        <div className="mx-auto grid max-w-[88rem] gap-12 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <h2 id="headed" className="text-3xl leading-tight font-extrabold tracking-[-0.02em] sm:text-4xl">
              Where I'm headed
            </h2>
            <p className="mt-5 max-w-[34ch] text-2xl leading-snug font-semibold text-balance sm:text-[1.9rem]">{dream}</p>
            <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-pretty text-muted-foreground">
              If your team needs someone to build and run this kind of system, email me.
            </p>
            <div className="mt-6">
              <EmailAction size="md" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold">Off the clock</h3>
            <dl className="mt-5 space-y-5 border-t border-[var(--t-ink)] pt-5">
              {offTheClock.map((item) => (
                <div key={item.title}>
                  <dt className="text-lg font-bold">{item.title}</dt>
                  <dd className="mt-1 text-[1.02rem] leading-relaxed text-pretty text-muted-foreground">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
