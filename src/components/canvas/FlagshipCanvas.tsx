import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { CanvasData } from "@/data/canvases/types"

interface Line {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

// Point where a ray from a rect's center in direction (dx, dy) crosses its border.
function edgePoint(cx: number, cy: number, w: number, h: number, dx: number, dy: number) {
  if (dx === 0 && dy === 0) return { x: cx, y: cy }
  const scaleX = dx !== 0 ? w / 2 / Math.abs(dx) : Infinity
  const scaleY = dy !== 0 ? h / 2 / Math.abs(dy) : Infinity
  const scale = Math.min(scaleX, scaleY)
  return { x: cx + dx * scale, y: cy + dy * scale }
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
  const [lines, setLines] = useState<Line[]>([])

  const maxCol = Math.max(...canvas.nodes.map((n) => n.col))
  const maxRow = Math.max(...canvas.nodes.map((n) => n.row))

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const next: Line[] = []

      for (const node of canvas.nodes) {
        const fromEl = nodeRefs.current.get(node.id)
        if (!fromEl || !node.connectsTo) continue
        const fromRect = fromEl.getBoundingClientRect()
        const fcx = fromRect.left + fromRect.width / 2 - containerRect.left
        const fcy = fromRect.top + fromRect.height / 2 - containerRect.top

        for (const targetId of node.connectsTo) {
          const toEl = nodeRefs.current.get(targetId)
          if (!toEl) continue
          const toRect = toEl.getBoundingClientRect()
          const tcx = toRect.left + toRect.width / 2 - containerRect.left
          const tcy = toRect.top + toRect.height / 2 - containerRect.top

          const dx = tcx - fcx
          const dy = tcy - fcy
          const start = edgePoint(fcx, fcy, fromRect.width, fromRect.height, dx, dy)
          const end = edgePoint(tcx, tcy, toRect.width, toRect.height, -dx, -dy)

          next.push({ id: `${node.id}->${targetId}`, x1: start.x, y1: start.y, x2: end.x, y2: end.y })
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

  return (
    <div>
      <div ref={containerRef} className="relative">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <marker
              id={`arrow-${canvas.slug}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-border" />
            </marker>
          </defs>
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className="stroke-border"
              strokeWidth={1.5}
              markerEnd={`url(#arrow-${canvas.slug})`}
            />
          ))}
        </svg>

        <div
          className="relative grid gap-4 sm:gap-6"
          style={{
            gridTemplateColumns: `repeat(${maxCol}, 1fr)`,
            gridTemplateRows: `repeat(${maxRow}, auto)`,
          }}
        >
          {canvas.nodes.map((node) => (
            <button
              key={node.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(node.id, el)
                else nodeRefs.current.delete(node.id)
              }}
              onClick={() => onNodeClick(node.id)}
              aria-expanded={openNodeId === node.id}
              style={{ gridColumn: node.col, gridRow: node.row }}
              className={cn(
                "rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition-colors hover:border-foreground/30",
                openNodeId === node.id ? "border-foreground" : "border-border",
              )}
            >
              <p className="text-sm font-semibold">{node.label}</p>
              {node.sublabel && (
                <p className="mt-0.5 text-xs text-muted-foreground">{node.sublabel}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {canvas.sideNodes.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Supporting infrastructure
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {canvas.sideNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onNodeClick(node.id)}
                aria-expanded={openNodeId === node.id}
                className={cn(
                  "rounded-lg border border-dashed bg-card px-4 py-3 text-left shadow-sm transition-colors hover:border-foreground/30",
                  openNodeId === node.id ? "border-foreground" : "border-border",
                )}
              >
                <p className="text-sm font-semibold">{node.label}</p>
                {node.sublabel && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{node.sublabel}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
