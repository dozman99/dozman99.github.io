import { Link, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { FlagshipCanvas } from "@/components/canvas/FlagshipCanvas"
import { NodePanel } from "@/components/canvas/NodePanel"
import { canvases } from "@/data/canvases"
import { flagships } from "@/data/flagships"

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
