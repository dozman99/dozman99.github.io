import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowDown, Flame, Lock, MousePointerClick } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/useMediaQuery"
import type { CanvasData, CanvasNode } from "@/data/canvases/types"

interface Connector {
  id: string
  from: string
  to: string
  d: string
}

interface Box {
  left: number
  right: number
  top: number
  bottom: number
  cx: number
  cy: number
}

// Gap between an arrowhead and the node it points at, and the elbow radius.
const INSET = 4
const RADIUS = 10
// How far above the target node a lane-crossing connector runs horizontally.
// It sits between the next lane's label and its nodes, so it never crosses text.
const RISE = 14

/**
 * Orthogonal routing, like a hand-drawn architecture diagram: nodes in the
 * same lane get a straight horizontal arrow; a lane change leaves the bottom
 * of the source, runs horizontally just above the target lane, and drops into
 * the top of the target with rounded elbows. No diagonals.
 */
function route(a: Box, b: Box): string {
  if (Math.abs(a.cy - b.cy) < 2) {
    const forward = b.cx >= a.cx
    const x1 = forward ? a.right : a.left
    const x2 = forward ? b.left - INSET : b.right + INSET
    return `M ${x1} ${a.cy} H ${x2}`
  }
  const x1 = a.cx
  const y1 = a.bottom
  const x2 = b.cx
  const y2 = b.top - INSET
  const midY = Math.max(b.top - RISE, (y1 + b.top) / 2)
  if (Math.abs(x1 - x2) < 2) return `M ${x1} ${y1} V ${y2}`
  const dir = x2 > x1 ? 1 : -1
  const r = Math.min(RADIUS, Math.abs(x2 - x1) / 2, midY - y1, y2 - midY)
  return [
    `M ${x1} ${y1}`,
    `V ${midY - r}`,
    `Q ${x1} ${midY} ${x1 + dir * r} ${midY}`,
    `H ${x2 - dir * r}`,
    `Q ${x2} ${midY} ${x2} ${midY + r}`,
    `V ${y2}`,
  ].join(" ")
}

const nodeBase =
  "group relative w-full rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md hover:shadow-primary/10 active:translate-y-0 active:scale-[0.99]"
const nodeSelected = "border-primary bg-accent shadow-md shadow-primary/10 ring-1 ring-primary"

type Labelled = { label: string; sublabel?: string; detail: { whatBroke?: string } }

function NodeLabel({ node }: { node: Labelled }) {
  return (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-snug break-words">{node.label}</span>
        {node.detail.whatBroke && (
          <>
            <Flame className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="sr-only">(includes what was hard)</span>
          </>
        )}
      </span>
      {node.sublabel && (
        <span className="mt-1 block font-mono text-[11px] leading-snug text-muted-foreground break-words">
          {node.sublabel}
        </span>
      )}
    </>
  )
}

export function FlagshipCanvas({
  canvas,
  openNodeId,
  onNodeClick,
}: {
  canvas: CanvasData
  openNodeId: string | null
  onNodeClick: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [lines, setLines] = useState<Connector[]>([])
  // The pulse on the first node is a one-time "you can click these" cue.
  const [interacted, setInteracted] = useState(openNodeId !== null)

  const maxCol = Math.max(...canvas.nodes.map((n) => n.col))
  const maxRow = Math.max(...canvas.nodes.map((n) => n.row))

  // Each grid row is a lane. Row-major order is the reading order of the
  // flow: it drives the single-column mobile layout and the tab order.
  const lanes = Array.from({ length: maxRow }, (_, i) =>
    canvas.nodes.filter((n) => n.row === i + 1).sort((a, b) => a.col - b.col),
  )
  const ordered = lanes.flat()
  const flowsInto = (a: CanvasNode, b: CanvasNode | undefined) =>
    !!b && !!a.connectsTo?.includes(b.id)
  const labelOf = (id: string) => canvas.nodes.find((n) => n.id === id)?.label ?? id
  const touch = useMediaQuery("(hover: none)")
  const hasHardParts = [...canvas.nodes, ...canvas.sideNodes].some((n) => n.detail.whatBroke)

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current
      if (!container) return
      const origin = container.getBoundingClientRect()
      const box = (el: HTMLElement): Box => {
        const r = el.getBoundingClientRect()
        const left = r.left - origin.left
        const top = r.top - origin.top
        return {
          left,
          top,
          right: left + r.width,
          bottom: top + r.height,
          cx: left + r.width / 2,
          cy: top + r.height / 2,
        }
      }
      const next: Connector[] = []

      for (const node of canvas.nodes) {
        const fromEl = nodeRefs.current.get(node.id)
        if (!fromEl || !node.connectsTo) continue
        for (const targetId of node.connectsTo) {
          const toEl = nodeRefs.current.get(targetId)
          if (!toEl) continue
          next.push({
            id: `${node.id}->${targetId}`,
            from: node.id,
            to: targetId,
            d: route(box(fromEl), box(toEl)),
          })
        }
      }
      setLines(next)
    }

    recompute()
    const observer = new ResizeObserver(recompute)
    if (containerRef.current) observer.observe(containerRef.current)
    window.addEventListener("resize", recompute)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", recompute)
    }
  }, [canvas])

  function click(id: string) {
    setInteracted(true)
    onNodeClick(id)
  }

  return (
    <div>
      <p className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
        <MousePointerClick className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          {touch ? "Tap" : "Click"} any node for why it exists and how it works.
          {hasHardParts && (
            <>
              {" "}
              <Flame className="inline size-3.5 -translate-y-px text-primary" aria-hidden="true" /> marks the
              ones that also cover what was hard.
            </>
          )}
        </span>
      </p>
      {canvas.codeNote && (
        <p className="-mt-2 mb-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{canvas.codeNote}</span>
        </p>
      )}

      <div ref={containerRef} className="relative">
        {/* Connectors only make sense on the 2-D grid; mobile uses inline arrows. */}
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" aria-hidden="true">
          <defs>
            {(["idle", "active"] as const).map((state) => (
              <marker
                key={state}
                id={`arrow-${canvas.slug}-${state}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  className={state === "active" ? "fill-primary" : "fill-primary/60"}
                />
              </marker>
            ))}
          </defs>
          {lines.map((line) => {
            const active = openNodeId !== null && (line.from === openNodeId || line.to === openNodeId)
            return (
              <path
                key={line.id}
                d={line.d}
                fill="none"
                className={cn(
                  "transition-[stroke,stroke-width] duration-200",
                  active ? "stroke-primary" : "stroke-primary/55",
                )}
                strokeWidth={active ? 2.25 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={`url(#arrow-${canvas.slug}-${active ? "active" : "idle"})`}
              />
            )
          })}
        </svg>

        <div className="relative flex flex-col sm:gap-12">
          {lanes.map((lane, laneIndex) => {
            const label = canvas.lanes?.[laneIndex]
            return (
              <section
                key={laneIndex}
                aria-label={label ?? `Stage ${laneIndex + 1}`}
                className={cn(laneIndex > 0 && label && "mt-1 sm:mt-0")}
              >
                {label && (
                  <h3
                    className={cn(
                      "mb-3 font-mono text-xs text-primary",
                      // Room for the incoming lane-crossing connector.
                      laneIndex > 0 && "sm:mb-7",
                    )}
                  >
                    {label}
                  </h3>
                )}
                <ol
                  className="flex flex-col sm:grid sm:gap-x-10 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
                  style={{ "--cols": maxCol } as CSSProperties}
                >
                  {lane.map((node) => {
                    const i = ordered.indexOf(node)
                    const next = ordered[i + 1]
                    const selected = openNodeId === node.id
                    const targets = node.connectsTo?.map(labelOf)
                    const lastInLane = next?.row !== node.row
                    return (
                      <Fragment key={node.id}>
                        <li
                          className="sm:[grid-column:var(--col)]"
                          style={{ "--col": node.col } as CSSProperties}
                        >
                          <button
                            type="button"
                            data-node-id={node.id}
                            ref={(el) => {
                              if (el) nodeRefs.current.set(node.id, el)
                              else nodeRefs.current.delete(node.id)
                            }}
                            onClick={() => click(node.id)}
                            aria-expanded={selected}
                            className={cn(nodeBase, "h-full", selected ? nodeSelected : "border-border")}
                          >
                            {i === 0 && !interacted && (
                              <span className="absolute -top-1 -right-1 flex size-2.5" aria-hidden="true">
                                <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                              </span>
                            )}
                            <NodeLabel node={node} />
                            {targets?.length ? (
                              <span className="sr-only">. Flows into {targets.join(", ")}.</span>
                            ) : null}
                          </button>
                        </li>
                        {next && (
                          <li
                            aria-hidden="true"
                            className={cn("flex justify-center sm:hidden", lastInLane ? "pt-2 pb-3" : "py-1.5")}
                          >
                            {flowsInto(node, next) ? (
                              <ArrowDown className="size-4 text-primary/70" />
                            ) : (
                              <span className="h-4" />
                            )}
                          </li>
                        )}
                      </Fragment>
                    )
                  })}
                </ol>
              </section>
            )
          })}
        </div>
      </div>

      {canvas.sideNodes.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold tracking-tight">Supporting infrastructure</h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {canvas.sideNodes.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  data-node-id={node.id}
                  onClick={() => click(node.id)}
                  aria-expanded={openNodeId === node.id}
                  className={cn(
                    nodeBase,
                    "h-full border-dashed",
                    openNodeId === node.id ? nodeSelected : "border-border",
                  )}
                >
                  <NodeLabel node={node} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
