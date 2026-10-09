import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react"
import { canvases } from "@/data/canvases"
import type { CanvasNode } from "@/data/canvases/types"
import { homeLines, type Line, type LineColor, type Station } from "@/data/transit"
import { lineStyle } from "@/lib/transit"
import { useMediaQuery } from "@/lib/useMediaQuery"
import { cn } from "@/lib/utils"

// A station's place in the network: which line, which station, and its canvas node.
interface Stop {
  key: string
  line: Line
  station: Station
  node: CanvasNode
}

const stopKey = (line: Line, station: Station) => `${line.slug}.${station.nodeId}`

function lineStops(line: Line): Stop[] {
  const nodes = canvases[line.slug]?.nodes ?? []
  return [...line.stations, ...(line.branch?.stations ?? [])].flatMap((station) => {
    const node = nodes.find((n) => n.id === station.nodeId)
    return node ? [{ key: stopKey(line, station), line, station, node }] : []
  })
}

const allStops = homeLines.flatMap(lineStops)

/** The round line badge with the line's letter, as on a station sign. */
export function LineBullet({ color, letter, size = "md" }: { color: LineColor; letter: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      style={lineStyle(color)}
      className={cn(
        "t-mono inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--lc)] font-bold",
        color === "yellow" ? "text-[oklch(0.19_0.012_262)]" : "text-white",
        size === "md" ? "size-11 text-lg" : "size-7 text-sm",
      )}
    >
      {letter}
    </span>
  )
}

// Plays the service run once, the first time the track is half on screen.
function useRunOnView(ref: RefObject<HTMLElement | null>) {
  const [running, setRunning] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || running) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRunning(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, running])
  return running
}

function Track({
  line,
  stations,
  columns,
  selectedKey,
  hasSelection,
  onSelect,
  onStep,
  buttons,
  thin,
}: {
  line: Line
  stations: Station[]
  columns: number
  selectedKey: string | null
  hasSelection: boolean
  onSelect: (key: string) => void
  onStep: (key: string, delta: number | "first" | "last") => void
  buttons: RefObject<Map<string, HTMLButtonElement>>
  thin?: boolean
}) {
  const list = useRef<HTMLOListElement>(null)
  const running = useRunOnView(list)
  const [run, setRun] = useState<{ x: number; y: number } | null>(null)

  // Measure the run once it starts: the first station's dot to the last, in each layout.
  useEffect(() => {
    if (!running || !list.current) return
    const items = list.current.querySelectorAll<HTMLElement>(":scope > li")
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    setRun({ x: last.offsetLeft - first.offsetLeft, y: last.offsetTop - first.offsetTop })
  }, [running])

  const lineDimmed = hasSelection && !stations.some((s) => stopKey(line, s) === selectedKey)
  const bar = thin ? "lg:h-1 w-1" : "lg:h-2 w-2"

  return (
    <ol
      ref={list}
      className="relative flex flex-col lg:grid"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {stations.map((station, i) => {
        const key = stopKey(line, station)
        const selected = key === selectedKey
        const node = canvases[line.slug]?.nodes.find((n) => n.id === station.nodeId)
        const hard = Boolean(node?.detail.whatBroke)
        return (
          <li key={key} className="relative flex lg:flex-col lg:items-center">
            {/* Track: a half segment toward each neighbour, so the line stays continuous
                whatever the label heights. Horizontal on desktop, vertical on phones. */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bg-[var(--lc)] transition-opacity duration-300",
                  bar,
                  "top-0 left-[10px] h-[26px] lg:top-[10px] lg:left-0 lg:w-1/2",
                  lineDimmed && "opacity-30",
                )}
              />
            )}
            {i < stations.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bg-[var(--lc)] transition-opacity duration-300",
                  bar,
                  "top-[26px] bottom-0 left-[10px] lg:top-[10px] lg:bottom-auto lg:left-1/2 lg:w-1/2",
                  lineDimmed && "opacity-30",
                )}
              />
            )}
            <button
              ref={(el) => {
                if (el) buttons.current.set(`phone:${key}`, el)
                else buttons.current.delete(`phone:${key}`)
              }}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(key)}
              onKeyDown={(e: KeyboardEvent) => {
                const keys: Record<string, number | "first" | "last"> = {
                  ArrowRight: 1,
                  ArrowDown: 1,
                  ArrowLeft: -1,
                  ArrowUp: -1,
                  Home: "first",
                  End: "last",
                }
                if (e.key in keys) {
                  e.preventDefault()
                  onStep(key, keys[e.key])
                }
              }}
              className={cn(
                "group relative z-10 flex min-h-11 w-full items-start gap-4 rounded-md pb-4 text-left",
                "transition-[opacity,transform] duration-200 active:scale-[0.98] lg:flex-col lg:items-center lg:gap-3 lg:px-2 lg:pb-1 lg:text-center",
              )}
            >
              <span className="relative shrink-0">
                <span
                  className={cn(
                    "block rounded-full border-[6px] border-[var(--lc)] bg-[var(--t-ground)] transition-[background-color,box-shadow,transform] duration-200",
                    thin ? "size-6 border-[5px]" : "size-7",
                    "group-hover:scale-110",
                    hasSelection && !selected && "opacity-35",
                    selected && "bg-[var(--lc)] shadow-[0_0_0_5px_var(--t-ground),0_0_0_8px_var(--t-ink)]",
                  )}
                />
                {hard && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 -right-2 size-3 rotate-45 border-2 border-[var(--t-ground)] bg-[var(--line-yellow)]"
                  />
                )}
              </span>
              <span className="min-w-0">
                <span className="t-mono block text-xs font-semibold text-muted-foreground">
                  {station.code}
                  {hard && <span className="sr-only"> · has a story about what was hard</span>}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[0.98rem] leading-snug font-semibold text-balance transition-colors",
                    hasSelection && !selected && "text-muted-foreground",
                  )}
                >
                  {station.name}
                </span>
              </span>
            </button>
          </li>
        )
      })}
      {running && run && (
        <>
          <span
            aria-hidden="true"
            className="t-train pointer-events-none absolute top-[8px] left-[calc(50%/var(--cols)_-_18px)] z-20 hidden h-3 w-9 rounded-full bg-[var(--t-ink)] lg:block"
            style={
              {
                "--cols": columns,
                "--run-distance": `${run.x}px`,
                animation: "t-run-x 2.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s 1 both",
              } as CSSProperties
            }
          />
          <span
            aria-hidden="true"
            className="t-train pointer-events-none absolute top-[4px] left-[8px] z-20 h-9 w-3 rounded-full bg-[var(--t-ink)] lg:hidden"
            style={
              {
                "--run-distance": `${run.y}px`,
                animation: "t-run-y 2.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s 1 both",
              } as CSSProperties
            }
          />
        </>
      )}
    </ol>
  )
}

/** Why / how / what was hard for one station, with its links and next/previous. */
function StationNotice({
  stop,
  onStep,
  onClose,
  headingRef,
  headingId,
}: {
  stop: Stop
  onStep: (delta: 1 | -1) => void
  onClose: () => void
  headingRef?: RefObject<HTMLHeadingElement | null>
  headingId?: string
}) {
  const { line, station, node } = stop
  const stops = lineStops(line)
  const index = stops.findIndex((s) => s.key === stop.key)
  const prev = stops[index - 1]
  const next = stops[index + 1]

  return (
    <div style={lineStyle(line.color)}>
      <div className="flex items-center gap-3">
        <LineBullet color={line.color} letter={station.code.charAt(0)} size="sm" />
        <span className="t-mono text-sm font-semibold">{station.code}</span>
        <span className="min-w-0 truncate text-sm text-muted-foreground">{line.name}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close station"
          className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground active:scale-95"
        >
          <X className="size-5" />
        </button>
      </div>
      <h3 ref={headingRef} id={headingId} tabIndex={-1} className="mt-3 text-2xl leading-tight font-extrabold tracking-[-0.015em] text-balance outline-none">
        {station.name}
      </h3>
      <p className="t-mono mt-2 text-xs text-muted-foreground">
        {node.label}
        {node.sublabel ? ` · ${node.sublabel}` : ""}
      </p>
      <dl className="mt-6 space-y-5 text-[0.98rem] leading-relaxed">
        <div>
          <dt className="font-bold">Why it exists</dt>
          <dd className="mt-1 text-pretty">{node.detail.why}</dd>
        </div>
        <div>
          <dt className="font-bold">How it works</dt>
          <dd className="mt-1 text-pretty">{node.detail.how}</dd>
        </div>
        {node.detail.whatBroke && (
          <div>
            <dt className="flex items-center gap-2 font-bold">
              <span aria-hidden="true" className="size-2.5 rotate-45 bg-[var(--line-yellow)]" />
              What was hard
            </dt>
            <dd className="mt-1 text-pretty">{node.detail.whatBroke}</dd>
          </div>
        )}
      </dl>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
        <Link
          to={`/flagships/${line.slug}?node=${node.id}`}
          className="inline-flex min-h-11 items-center gap-1.5 underline decoration-[var(--lc)] decoration-2 underline-offset-4 hover:decoration-[var(--t-ink)]"
        >
          Open the full story
          <ArrowRight className="size-4" />
        </Link>
        {node.detail.codeLink && (
          <a
            href={node.detail.codeLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 underline decoration-[var(--t-rule)] decoration-2 underline-offset-4 hover:decoration-[var(--t-ink)]"
          >
            View the code
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <button
          type="button"
          disabled={!prev}
          onClick={() => onStep(-1)}
          className="flex min-h-11 items-center gap-2 rounded-md text-left text-sm transition-[opacity,transform] active:scale-[0.98] disabled:opacity-30"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="min-w-0">
            <span className="t-mono block text-xs text-muted-foreground">{prev?.station.code ?? "Start"}</span>
            <span className="block truncate font-semibold">{prev?.station.name ?? "First station"}</span>
          </span>
        </button>
        <button
          type="button"
          disabled={!next}
          onClick={() => onStep(1)}
          className="flex min-h-11 items-center justify-end gap-2 rounded-md text-right text-sm transition-[opacity,transform] active:scale-[0.98] disabled:opacity-30"
        >
          <span className="min-w-0">
            <span className="t-mono block text-xs text-muted-foreground">{next?.station.code ?? "End"}</span>
            <span className="block truncate font-semibold">{next?.station.name ?? "Last station"}</span>
          </span>
          <ArrowRight className="size-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}

/** Phones: a sheet from the bottom that follows the thumb and keeps the line in view above it. */
function StationSheet({ children, onClose, labelledBy }: { children: ReactNode; onClose: () => void; labelledBy: string }) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ y: number; t: number } | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { y: e.clientY, t: e.timeStamp }
    setDragging(true)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    setOffset(Math.max(0, e.clientY - drag.current.y))
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const dy = e.clientY - drag.current.y
    const velocity = dy / Math.max(1, e.timeStamp - drag.current.t)
    drag.current = null
    setDragging(false)
    if (dy > 96 || velocity > 0.6) onClose()
    else setOffset(0)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={labelledBy}
      className="fixed inset-x-0 bottom-0 z-50 max-h-[68svh] overflow-y-auto overscroll-contain rounded-t-2xl border-t border-border bg-card px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_-16px_rgb(0_0_0/0.35)] motion-safe:animate-in motion-safe:slide-in-from-bottom-10 motion-safe:duration-300 lg:hidden"
      style={{
        transform: offset ? `translateY(${offset}px)` : undefined,
        transition: dragging ? "none" : "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        className="sticky top-0 z-10 -mx-5 flex touch-none justify-center bg-card pt-3 pb-2"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null
          setDragging(false)
          setOffset(0)
        }}
      >
        <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-[var(--t-rule)]" />
      </div>
      {children}
    </div>
  )
}

/** Shown in the desktop rail before any station is picked. */
function MapKey() {
  return (
    <div>
      <h3 className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">Pick a station</h3>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-pretty text-muted-foreground">
        Each line is a system I built. Its stations are the parts, named for what they do. Pick one to see why
        it exists, how it works and what was hard.
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="size-6 rounded-full border-[5px] border-[var(--t-ink)] bg-[var(--t-ground)]" />
          A station: one part of the system
        </li>
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="ml-1.5 size-3 rotate-45 bg-[var(--line-yellow)]" />
          Something broke here, and the story says how I fixed it
        </li>
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="t-mono inline-flex h-6 items-center rounded border border-border px-1.5 text-xs">
            ← →
          </span>
          Arrow keys move along a line
        </li>
      </ul>
    </div>
  )
}

// The desktop map: one field drawn to 45/90-degree geometry, in its own 960-wide coordinate
// space. Rows follow each system's real lanes: FBT's webhook stations step down to its build
// stations and its teardown branch splits at the start; DozLab's control plane steps down
// into the lab session pod.
const FIELD_W = 960
const FIELD_H = 540
const A = 84
const B = 180
const D = 368
const E = 464
const fieldLayout: Record<
  string,
  { strip: number; paths: string[]; at: Record<string, [number, number]>; terminus?: { text: string; x: number; y: number } }
> = {
  fbt: {
    strip: 0,
    paths: [`M 40 ${A} H 600 L ${600 + (B - A)} ${B} H 880`, `M 80 ${A} L ${80 + (B - A)} ${B} H 400`],
    at: {
      "api-gateway": [240, A],
      "webhook-filter": [400, A],
      "sqs-fifo": [560, A],
      "build-lambda": [720, B],
      "per-branch-ecs": [880, B],
      "api-gateway-destroy": [240, B],
      teardown: [400, B],
    },
    terminus: { text: "Teardown branch", x: 428, y: B },
  },
  dozlab: {
    strip: 288,
    paths: [`M 80 ${D} H 440 L ${440 + (E - D)} ${E} H 880`],
    at: {
      frontend: [80, D],
      api: [240, D],
      controller: [400, D],
      "init-container": [560, E],
      vm: [720, E],
      sidecars: [880, E],
    },
  },
}
const pct = (v: number, of: number) => `${(v / of) * 100}%`

/** A line's name on a strip of its own colour, the way stations sign their lines. */
function LineStrip({
  line,
  as: Tag = "h3",
  className,
  style,
  headingId,
}: {
  line: Line
  as?: "h3" | "div"
  className?: string
  style?: CSSProperties
  headingId?: string
}) {
  return (
    <div
      style={{ ...lineStyle(line.color), ...style }}
      className={cn("t-strip flex items-center gap-3 rounded-md px-3", className)}
    >
      <span
        aria-hidden="true"
        className="t-mono t-strip-bullet inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold"
      >
        {line.stations[0].code.charAt(0)}
      </span>
      <Tag id={headingId} className="min-w-0 text-[1.02rem] leading-tight font-extrabold tracking-[-0.01em]">
        {line.name}
      </Tag>
      <span className="ml-auto hidden shrink-0 text-sm font-semibold sm:inline">{line.where}</span>
    </div>
  )
}

function NetworkField({
  selectedKey,
  hasSelection,
  onSelect,
  onStep,
  buttons,
}: {
  selectedKey: string | null
  hasSelection: boolean
  onSelect: (key: string) => void
  onStep: (key: string, delta: number | "first" | "last") => void
  buttons: RefObject<Map<string, HTMLButtonElement>>
}) {
  const field = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const running = useRunOnView(field)

  // One service run per line, the first time the map is seen; none with reduced motion.
  useEffect(() => {
    if (!running || !svg.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    svg.current.querySelectorAll<SVGAnimationElement>("animateMotion, animate").forEach((a) => a.beginElement())
  }, [running])

  return (
    <div ref={field} className="relative w-full" style={{ aspectRatio: `${FIELD_W} / ${FIELD_H}` }}>
      <svg ref={svg} viewBox={`0 0 ${FIELD_W} ${FIELD_H}`} aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        {homeLines.map((line) => {
          const layout = fieldLayout[line.slug]
          const lineSelected = lineStops(line).some((s) => s.key === selectedKey)
          return (
            <g key={line.slug} style={lineStyle(line.color)} className={cn("transition-opacity duration-300", hasSelection && !lineSelected && "opacity-30")}>
              {layout.paths.map((d) => (
                <path key={d} d={d} fill="none" stroke="var(--lc)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {running && (
                <rect className="t-train" x={-17} y={-6} width={34} height={12} rx={6} fill="var(--t-ink)" opacity={0}>
                  <animateMotion begin="indefinite" dur="2.8s" path={layout.paths[0]} rotate="auto" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1" />
                  <animate attributeName="opacity" begin="indefinite" dur="2.8s" values="0;1;1;0" keyTimes="0;0.08;0.85;1" fill="freeze" />
                </rect>
              )}
            </g>
          )
        })}
      </svg>

      {homeLines.map((line) => {
        const layout = fieldLayout[line.slug]
        return (
          <div key={line.slug}>
            <LineStrip
              line={line}
              className="absolute inset-x-0 h-9"
              style={{ top: pct(layout.strip, FIELD_H) }}
              headingId={`line-${line.slug}`}
            />
            {layout.terminus && (
              <span
                className="absolute -translate-y-1/2 pl-3 text-sm font-semibold text-muted-foreground"
                style={{ left: pct(layout.terminus.x, FIELD_W), top: pct(layout.terminus.y, FIELD_H) }}
              >
                {layout.terminus.text}
              </span>
            )}
            {[...line.stations, ...(line.branch?.stations ?? [])].map((station) => {
              const key = stopKey(line, station)
              const [x, y] = layout.at[station.nodeId]
              const selected = key === selectedKey
              const hard = Boolean(canvases[line.slug]?.nodes.find((n) => n.id === station.nodeId)?.detail.whatBroke)
              return (
                <button
                  key={key}
                  ref={(el) => {
                    if (el) buttons.current.set(`desk:${key}`, el)
                    else buttons.current.delete(`desk:${key}`)
                  }}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(key)}
                  onKeyDown={(e: KeyboardEvent) => {
                    const keys: Record<string, number | "first" | "last"> = {
                      ArrowRight: 1,
                      ArrowDown: 1,
                      ArrowLeft: -1,
                      ArrowUp: -1,
                      Home: "first",
                      End: "last",
                    }
                    if (e.key in keys) {
                      e.preventDefault()
                      onStep(key, keys[e.key])
                    }
                  }}
                  style={{ ...lineStyle(line.color), left: pct(x, FIELD_W), top: pct(y, FIELD_H) }}
                  className="group absolute z-10 flex w-[9.25rem] -translate-x-1/2 -translate-y-[14px] flex-col items-center rounded-md text-center transition-transform duration-150 active:scale-[0.97]"
                >
                  <span className="relative">
                    <span
                      className={cn(
                        "block size-7 rounded-full border-[6px] border-[var(--lc)] bg-[var(--t-ground)] transition-[background-color,box-shadow,transform,opacity] duration-200 group-hover:scale-110",
                        hasSelection && !selected && "opacity-35",
                        selected && "bg-[var(--lc)] shadow-[0_0_0_5px_var(--t-ground),0_0_0_8px_var(--t-ink)]",
                      )}
                    />
                    {hard && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-1.5 -right-2 size-3 rotate-45 border-2 border-[var(--t-ground)] bg-[var(--line-yellow)]"
                      />
                    )}
                  </span>
                  <span className="t-mono mt-1.5 text-xs font-semibold text-muted-foreground">
                    {station.code}
                    {hard && <span className="sr-only"> · has a story about what was hard</span>}
                  </span>
                  <span
                    className={cn(
                      "text-[0.95rem] leading-snug font-semibold text-balance transition-colors",
                      hasSelection && !selected && "text-muted-foreground",
                    )}
                  >
                    {station.name}
                  </span>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/** What a line does, its sourced service notes, and every station written out. */
function LineNotes({ line }: { line: Line }) {
  return (
    <div style={lineStyle(line.color)}>
      <p className="max-w-[62ch] text-[1.02rem] leading-relaxed text-pretty">{line.summary}</p>
      <ul className="mt-5 grid gap-x-8 gap-y-3 border-t border-border pt-5">
        {line.notes.map((note) => (
          <li key={note.text} className="flex items-baseline gap-3">
            <span aria-hidden="true" className="size-2.5 shrink-0 translate-y-[-1px] bg-[var(--lc)]" />
            <span>
              <span className="block font-semibold">{note.text}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">{note.origin}</span>
            </span>
          </li>
        ))}
      </ul>
      <details className="group mt-5">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold underline decoration-[var(--lc)] decoration-2 underline-offset-4 [&::-webkit-details-marker]:hidden">
          Read every station in full
          <ArrowRight className="size-4 transition-transform group-open:rotate-90" />
        </summary>
        <ol className="mt-4 space-y-6">
          {lineStops(line).map(({ key, station, node }) => (
            <li key={key} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
              <span aria-hidden="true" className="mt-1 size-4 rounded-full border-4 border-[var(--lc)] bg-[var(--t-ground)]" />
              <div>
                <p className="font-bold">
                  <span className="t-mono mr-2 text-xs text-muted-foreground">{station.code}</span>
                  {station.name}
                </p>
                <p className="t-mono mt-1 text-xs text-muted-foreground">{node.label}</p>
                <p className="mt-2 max-w-[68ch] text-[0.98rem] leading-relaxed text-pretty">{node.detail.why}</p>
                <p className="mt-2 max-w-[68ch] text-[0.98rem] leading-relaxed text-pretty">{node.detail.how}</p>
                {node.detail.whatBroke && (
                  <p className="mt-2 max-w-[68ch] text-[0.98rem] leading-relaxed text-pretty">
                    <span className="font-bold">What was hard: </span>
                    {node.detail.whatBroke}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </details>
    </div>
  )
}

export function NetworkMap() {
  const [params, setParams] = useSearchParams()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const sheetHeading = useRef<HTMLHeadingElement>(null)
  const lastTrigger = useRef<string | null>(null)
  const layoutKey = (key: string) => `${isDesktop ? "desk" : "phone"}:${key}`

  const selectedKey = params.get("stop")
  const selected = useMemo(() => allStops.find((s) => s.key === selectedKey) ?? null, [selectedKey])

  const select = useCallback(
    (key: string, opts: { focus?: boolean } = {}) => {
      lastTrigger.current = key
      setParams(
        (p) => {
          const next = new URLSearchParams(p)
          next.set("stop", key)
          return next
        },
        { replace: true, preventScrollReset: true },
      )
      if (opts.focus) buttons.current.get(`${isDesktop ? "desk" : "phone"}:${key}`)?.focus()
    },
    [setParams, isDesktop],
  )

  const close = useCallback(() => {
    setParams(
      (p) => {
        const next = new URLSearchParams(p)
        next.delete("stop")
        return next
      },
      { replace: true, preventScrollReset: true },
    )
    const key = lastTrigger.current
    if (key) requestAnimationFrame(() => buttons.current.get(`${isDesktop ? "desk" : "phone"}:${key}`)?.focus())
  }, [setParams, isDesktop])

  const step = useCallback(
    (fromKey: string, delta: number | "first" | "last", focus = true) => {
      const from = allStops.find((s) => s.key === fromKey)
      if (!from) return
      const stops = lineStops(from.line)
      const i = stops.findIndex((s) => s.key === fromKey)
      const target =
        delta === "first" ? stops[0] : delta === "last" ? stops[stops.length - 1] : stops[i + delta]
      if (target) select(target.key, { focus })
    },
    [select],
  )

  // Esc closes the open station from anywhere on the page.
  useEffect(() => {
    if (!selected) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selected, close])

  // A shared link lands on its station, once, when the page opens.
  const initialKey = useRef(selectedKey)
  useEffect(() => {
    const key = initialKey.current
    if (key) buttons.current.get(layoutKey(key))?.scrollIntoView({ block: "center" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Phones: keep the picked station above the sheet, and give the sheet the focus.
  useEffect(() => {
    if (!selected || isDesktop) return
    const button = buttons.current.get(`phone:${selected.key}`)
    if (button && button.getBoundingClientRect().top > window.innerHeight * 0.3) {
      const top = button.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: "smooth" })
    }
    sheetHeading.current?.focus({ preventScroll: true })
  }, [selected, isDesktop])

  const trackProps = {
    selectedKey,
    hasSelection: selected !== null,
    onSelect: (key: string) => select(key),
    onStep: (key: string, d: number | "first" | "last") => step(key, d),
    buttons,
  }

  return (
    <section aria-labelledby="network-heading" className="border-t border-border">
      <h2 id="network-heading" className="sr-only">
        The systems I built, as a transit map
      </h2>
      <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
        {/* Desktop: one map field, the station notice docked beside it behind a single rule. */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12 xl:gap-16">
          <div className="pt-8 pb-14">
            <NetworkField {...trackProps} />
            <div className="mt-14 grid grid-cols-2 gap-12 border-t border-border pt-10">
              {homeLines.map((line) => (
                <article key={line.slug} aria-label={line.name}>
                  <p className="mb-4 flex items-center gap-3 text-lg font-extrabold tracking-[-0.01em]">
                    <LineBullet color={line.color} letter={line.stations[0].code.charAt(0)} size="sm" />
                    {line.name}
                  </p>
                  <LineNotes line={line} />
                </article>
              ))}
            </div>
          </div>
          <aside aria-label="Station details" className="border-l border-border pl-8 xl:pl-10">
            <div className="sticky top-6 max-h-[calc(100svh-3rem)] overflow-y-auto overscroll-contain py-8 pr-1">
              {selected ? (
                <StationNotice stop={selected} onStep={(d) => step(selected.key, d, false)} onClose={close} />
              ) : (
                <MapKey />
              )}
            </div>
          </aside>
        </div>

        {/* Phones and tablets: each line as a vertical strip map, its notes beneath. */}
        <div className="lg:hidden">
          {homeLines.map((line) => (
            <article
              key={line.slug}
              style={lineStyle(line.color)}
              aria-labelledby={`line-${line.slug}-phone`}
              className="border-t border-border pt-6 pb-10 first:border-t-0"
            >
              <LineStrip line={line} className="min-h-11" headingId={`line-${line.slug}-phone`} />
              <div className="mt-6">
                <Track line={line} stations={line.stations} columns={line.stations.length} {...trackProps} />
              </div>
              {line.branch && (
                <div className="mt-2" style={lineStyle(line.color)}>
                  <p className="mb-3 text-sm font-semibold text-muted-foreground">{line.branch.name} branch</p>
                  <Track line={line} stations={line.branch.stations} columns={line.stations.length} {...trackProps} thin />
                </div>
              )}
              <div className="mt-6">
                <LineNotes line={line} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {selected ? `${selected.station.code}, ${selected.station.name}, on ${selected.line.name}` : ""}
      </p>

      {selected && !isDesktop && (
        <StationSheet onClose={close} labelledBy="station-sheet-heading">
          <StationNotice
            stop={selected}
            onStep={(d) => step(selected.key, d, false)}
            onClose={close}
            headingRef={sheetHeading}
            headingId="station-sheet-heading"
          />
        </StationSheet>
      )}
    </section>
  )
}
