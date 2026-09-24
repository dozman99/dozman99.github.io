import { Link, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { FlagshipCanvas } from "@/components/canvas/FlagshipCanvas"
import { NodePanel } from "@/components/canvas/NodePanel"
import { Separator } from "@/components/ui/separator"
import { canvases } from "@/data/canvases"
import { flagships } from "@/data/flagships"
import type { CanvasNode, SideNode } from "@/data/canvases/types"

// Same content as the click-to-open node panels, but written out in full and
// always visible — not gated behind a client-side interaction. Two reasons:
// docs/PLAN.md always intended this content to be genuinely written, and a
// plain fetch (crawlers, link previews, AI agents that don't run JS) can only
// ever see what's actually in the page's HTML, never what a click would open.
function NodeBreakdown({ node }: { node: CanvasNode | SideNode }) {
  return (
    <article id={node.id} className="scroll-mt-24 py-8 first:pt-0">
      <h3 className="text-base font-semibold tracking-tight">{node.label}</h3>
      {node.sublabel && <p className="text-sm text-muted-foreground">{node.sublabel}</p>}

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

      {node.detail.codeLink ? (
        <a
          href={node.detail.codeLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          View code
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground/80">Sample repo coming soon.</p>
      )}
    </article>
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

  function handleNodeClick(id: string) {
    setSearchParams({ node: id })
  }

  function handlePanelOpenChange(isOpen: boolean) {
    if (!isOpen) {
      const next = new URLSearchParams(searchParams)
      next.delete("node")
      setSearchParams(next, { replace: true })
    }
  }

  if (!canvas) {
    return (
      <div>
        <PageHeader
          eyebrow="Flagship Story"
          title={flagship?.title ?? "Not found"}
          description="This flagship's interactive canvas isn't built yet."
        />
        <div className="px-4 pb-20 sm:px-6">
          <Link
            to="/flagships"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to Flagship Stories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Flagship Story" title={canvas.title} description={canvas.summary} />

      <div className="px-4 pb-20 sm:px-6">
        <Link
          to="/flagships"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to Flagship Stories
        </Link>

        <FlagshipCanvas canvas={canvas} openNodeId={openNodeId} onNodeClick={handleNodeClick} />

        <div className="mt-12 max-w-2xl border-t border-border pt-8">
          <h2 className="mb-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Full breakdown
          </h2>
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
                <h2 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
                  Currently studying
                </h2>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {canvas.studying.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {canvas.writing && (
              <div>
                <h2 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
                  Writing
                </h2>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {canvas.writing.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <NodePanel node={openNode} open={openNode !== null} onOpenChange={handlePanelOpenChange} />
    </div>
  )
}
