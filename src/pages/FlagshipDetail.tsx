import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Mail } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { FlagshipCanvas } from "@/components/canvas/FlagshipCanvas"
import { NodeInlinePanel, NodeSheet } from "@/components/canvas/NodePanel"
import { Separator } from "@/components/ui/separator"
import { canvases } from "@/data/canvases"
import { flagships } from "@/data/flagships"
import type { CanvasNode, Figure, InteractiveFigure, SideNode } from "@/data/canvases/types"
import { useMediaQuery } from "@/lib/useMediaQuery"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

// Every story ends by pointing somewhere: the next built canvas, and a way
// to get in touch.
function StoryEnd({ slug }: { slug: string }) {
  const built = flagships.filter((f) => f.slug in canvases)
  const next = built[(built.findIndex((f) => f.slug === slug) + 1) % built.length]

  return (
    <div className="mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
      {next && next.slug !== slug && (
        <Link
          to={`/flagships/${next.slug}`}
          className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50"
        >
          <span className="text-sm text-muted-foreground">Next story</span>
          <span className="mt-1 flex items-center justify-between gap-3 text-base font-semibold tracking-tight">
            {next.title}
            <ArrowRight className="size-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </Link>
      )}
      <div className="flex flex-col justify-center rounded-xl border border-dashed border-foreground/20 p-5">
        <p className="text-base font-semibold tracking-tight">Want the long version?</p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-primary transition-colors hover:text-foreground lg:min-h-0"
          >
            <Mail className="size-4" />
            Email me
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-primary transition-colors hover:text-foreground lg:min-h-0"
          >
            <FileText className="size-4" />
            Résumé
          </a>
        </div>
      </div>
    </div>
  )
}

// Same content as the click-to-open node panels, but written out in full and
// always visible — not gated behind a client-side interaction. Two reasons:
// docs/PLAN.md always intended this content to be genuinely written, and a
// plain fetch (crawlers, link previews, AI agents that don't run JS) can only
// ever see what's actually in the page's HTML, never what a click would open.
function NodeBreakdown({ node }: { node: CanvasNode | SideNode }) {
  return (
    <article id={node.id} className="scroll-mt-24 py-8 first:pt-0">
      <h3 className="text-base font-semibold tracking-tight">{node.label}</h3>
      {node.sublabel && <p className="mt-0.5 font-mono text-xs text-muted-foreground">{node.sublabel}</p>}

      <div className="mt-4 space-y-3 text-sm">
        <p>
          <span className="font-medium text-foreground">Why: </span>
          <span className="text-foreground/90">{node.detail.why}</span>
        </p>
        <p>
          <span className="font-medium text-foreground">How: </span>
          <span className="text-foreground/90">{node.detail.how}</span>
        </p>
        {node.detail.whatBroke && (
          <p>
            <span className="font-medium text-foreground">What was hard: </span>
            <span className="text-foreground/90">{node.detail.whatBroke}</span>
          </p>
        )}
      </div>

      {node.detail.codeLink && (
        <a
          href={node.detail.codeLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
        >
          View code
          <ExternalLink className="size-3.5" />
        </a>
      )}
    </article>
  )
}

// A screenshot or diagram with its caption. The image links to itself so it
// can be opened at full size, which the dense diagrams need on a phone.
function FigureCard({ figure, className }: { figure: Figure; className?: string }) {
  // With a dark version, both images are in the page and the theme class picks one.
  const versions = figure.srcDark
    ? [
        { src: figure.src, className: "dark:hidden" },
        { src: figure.srcDark, className: "hidden dark:block" },
      ]
    : [{ src: figure.src, className: "block" }]
  return (
    <figure className={className}>
      {versions.map((version) => (
        <a
          key={version.src}
          href={version.src}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "overflow-hidden rounded-xl border border-border transition-colors hover:border-primary/50",
            version.className,
          )}
        >
          <img
            src={version.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            loading="lazy"
            className="h-auto w-full"
            // w-full/h-auto override the width and height attributes, so state the ratio in CSS
            // too: the box has its final size before the image loads, and Chrome stops flagging it.
            style={{ aspectRatio: `${figure.width} / ${figure.height}` }}
          />
        </a>
      ))}
      <figcaption className="mt-2 text-sm text-muted-foreground">{figure.caption}</figcaption>
    </figure>
  )
}

// Follows the `dark` class the theme toggle puts on <html>.
function useDarkClass() {
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  )
  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setDark(root.classList.contains("dark")))
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return dark
}

// An animated diagram page from public/, in a frame as tall as its content. The pages are
// same-origin, so the frame watches their body and follows its height (fonts loading and the
// controls wrapping both change it).
// The page plays its animation once, when it loads. A lazy iframe loads well before it scrolls
// into view, so the animation would be over before anyone saw it: the frame is only created
// once half the figure is on screen. After that it loops: each finished run holds the complete
// diagram for LOOP_HOLD_MS, then presses the page's own Replay button, but only while the figure
// is on screen and only until the reader presses a playback button or a key in it.
const LOOP_HOLD_MS = 4000

function InteractiveFigureCard({ figure }: { figure: InteractiveFigure }) {
  const dark = useDarkClass()
  const box = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const observer = useRef<ResizeObserver>(null)
  const looper = useRef<MutationObserver>(null)
  const onScreen = useRef(false)
  // A replay that came due while the figure was off screen; it runs when the figure is back.
  const pendingReplay = useRef<(() => void) | null>(null)
  const [inView, setInView] = useState(false)
  const [height, setHeight] = useState<number>()
  const src = dark ? figure.srcDark : figure.src

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        onScreen.current = entries.some((e) => e.isIntersecting)
        if (!onScreen.current) return
        setInView(true)
        const replay = pendingReplay.current
        pendingReplay.current = null
        replay?.()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onLoad = useCallback(() => {
    // The frame's own ResizeObserver, since the observed body lives in the frame's document.
    const win = frame.current?.contentWindow as (Window & typeof globalThis) | null | undefined
    const doc = frame.current?.contentDocument
    if (!win || !doc?.body) return
    const fit = () => setHeight(Math.ceil(doc.documentElement.scrollHeight))
    observer.current?.disconnect()
    const next = new win.ResizeObserver(fit)
    next.observe(doc.body)
    observer.current = next
    fit()

    // Loop. The page's controller marks a finished run with data-frame="end"; with reduced
    // motion it shows a static frame instead, so nothing loops.
    const root = doc.querySelector<HTMLElement>("[data-motion-root]")
    const replay = doc.querySelector<HTMLButtonElement>('[data-motion-action="replay"]')
    looper.current?.disconnect()
    pendingReplay.current = null
    if (!root || !replay) return
    let stopped = false
    let timer = 0
    const stop = () => {
      stopped = true
      win.clearTimeout(timer)
      pendingReplay.current = null
    }
    // Only a real press on a playback button stops it, not any touch: on a phone, scrolling the
    // page with a finger over the figure starts with a pointerdown in the frame. The loop's own
    // replay.click() is untrusted, so it doesn't count.
    doc.addEventListener(
      "click",
      (e) => {
        if (e.isTrusted && (e.target as Element).closest?.("[data-motion-action]")) stop()
      },
      true,
    )
    doc.addEventListener("keydown", stop, true)
    const replayNow = () => {
      if (!stopped && !replay.disabled) replay.click()
    }
    const loop = new win.MutationObserver(() => {
      if (stopped || root.dataset.frame !== "end") return
      win.clearTimeout(timer)
      timer = win.setTimeout(() => {
        if (onScreen.current) replayNow()
        else pendingReplay.current = replayNow
      }, LOOP_HOLD_MS)
    })
    loop.observe(root, { attributes: true, attributeFilter: ["data-frame"] })
    looper.current = loop
  }, [])

  useEffect(
    () => () => {
      observer.current?.disconnect()
      looper.current?.disconnect()
    },
    [],
  )

  return (
    <figure>
      <div
        ref={box}
        className="overflow-hidden rounded-xl border border-border"
        style={height ? undefined : { aspectRatio: `${figure.width} / ${figure.height + 96}` }}
      >
        {inView && (
          <iframe
            key={src}
            ref={frame}
            src={src}
            title={figure.title}
            onLoad={onLoad}
            className="block h-full w-full"
            style={height ? { height } : undefined}
          />
        )}
      </div>
      <figcaption className="mt-2 text-sm text-muted-foreground">
        {figure.caption}{" "}
        <a href={src} target="_blank" rel="noreferrer" className="text-primary hover:text-foreground">
          Open full size
        </a>
      </figcaption>
    </figure>
  )
}

export default function FlagshipDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const canvas = slug ? canvases[slug] : undefined
  const flagship = flagships.find((f) => f.slug === slug)

  const openNodeId = searchParams.get("node")
  const openNode = canvas
    ? (canvas.nodes.find((n) => n.id === openNodeId) ??
      canvas.sideNodes.find((n) => n.id === openNodeId) ??
      null)
    : null

  // replace, not push: Back should leave the page, not step through nodes.
  function handleNodeClick(id: string) {
    setSearchParams({ node: id }, { replace: true })
  }

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const closePanel = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete("node")
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  if (!canvas) {
    return (
      <div>
        <PageHeader
          back={{ to: "/projects", label: "Projects" }}
          title={flagship?.title ?? "Not found"}
          description={flagship ? `${flagship.where} · ${flagship.depth}` : undefined}
        />
        <div className="px-4 pb-20 sm:px-6">
          {flagship && (
            <p className="mb-8 max-w-2xl text-base text-muted-foreground">{flagship.teaser}</p>
          )}
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All flagship stories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        back={{ to: "/projects", label: "Projects" }}
        title={canvas.title}
        description={canvas.summary}
      />

      <div className="px-4 pb-20 sm:px-6">
        <h2 className="sr-only">Architecture</h2>
        <FlagshipCanvas canvas={canvas} openNodeId={openNodeId} onNodeClick={handleNodeClick} />
        {isDesktop && <NodeInlinePanel node={openNode} onClose={closePanel} />}

        {canvas.proof && (
          <section id="running" className="mt-12 scroll-mt-24 border-t border-border pt-8">
            <h2 className="mb-2 text-xl font-semibold tracking-tight">See it running</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Screenshots taken on {canvas.proof.capturedOn}. {canvas.proof.note}
            </p>
            {canvas.proof.liveUrl && (
              <a
                href={canvas.proof.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground lg:min-h-0"
              >
                Open the live UI
                <ExternalLink className="size-3.5" />
              </a>
            )}
            <div className="mt-6 grid items-start gap-6 sm:grid-cols-2">
              {canvas.proof.shots.map((shot) => (
                <FigureCard
                  key={shot.src}
                  figure={shot}
                  // A portrait shot takes the right column beside the landscape ones.
                  className={
                    shot.height > shot.width ? "sm:col-start-2 sm:row-span-2 sm:row-start-1" : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

        {canvas.diagrams && (
          <section id="diagrams" className="mt-12 scroll-mt-24 border-t border-border pt-8">
            <h2 className="mb-2 text-xl font-semibold tracking-tight">Architecture diagrams</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">{canvas.diagrams.note}</p>
            <div className="mt-6 space-y-8">
              {canvas.diagrams.figures.map((figure) =>
                "kind" in figure ? (
                  <InteractiveFigureCard key={figure.src} figure={figure} />
                ) : (
                  <FigureCard key={figure.src} figure={figure} />
                ),
              )}
            </div>
          </section>
        )}

        <div className="mt-12 max-w-2xl border-t border-border pt-8">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">Full breakdown</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Same content as clicking a node above, written out in full.
          </p>
          <Separator />
          <div className="divide-y divide-border">
            {canvas.nodes.map((node) => (
              <NodeBreakdown key={node.id} node={node} />
            ))}
            {canvas.sideNodes.map((node) => (
              <NodeBreakdown key={node.id} node={node} />
            ))}
          </div>
        </div>

        {(canvas.studying || canvas.writing) && (
          <div className="mt-12 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
            {canvas.studying && (
              <div>
                <h2 className="mb-3 text-lg font-semibold tracking-tight">Currently studying</h2>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {canvas.studying.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {canvas.writing && (
              <div>
                <h2 className="mb-3 text-lg font-semibold tracking-tight">Writing</h2>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {canvas.writing.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <StoryEnd slug={canvas.slug} />
      </div>

      {!isDesktop && <NodeSheet node={openNode} onClose={closePanel} />}
    </div>
  )
}
