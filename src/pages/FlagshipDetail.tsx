import { useCallback } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Mail } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { FlagshipCanvas } from "@/components/canvas/FlagshipCanvas"
import { NodeInlinePanel, NodeSheet } from "@/components/canvas/NodePanel"
import { Separator } from "@/components/ui/separator"
import { canvases } from "@/data/canvases"
import { flagships } from "@/data/flagships"
import type { CanvasNode, SideNode } from "@/data/canvases/types"
import { useMediaQuery } from "@/lib/useMediaQuery"
import { site } from "@/data/site"

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
          back={{ to: "/flagships", label: "Flagship stories" }}
          title={flagship?.title ?? "Not found"}
          description={flagship ? `${flagship.where} · ${flagship.depth}` : undefined}
        />
        <div className="px-4 pb-20 sm:px-6">
          {flagship && (
            <p className="mb-8 max-w-2xl text-base text-muted-foreground">{flagship.teaser}</p>
          )}
          <p className="mb-8 text-sm text-muted-foreground">
            The interactive architecture canvas for this one isn't built yet.
          </p>
          <Link
            to="/flagships"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            See the stories that are built
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        back={{ to: "/flagships", label: "Flagship stories" }}
        title={canvas.title}
        description={canvas.summary}
      />

      <div className="px-4 pb-20 sm:px-6">
        <h2 className="sr-only">Architecture</h2>
        <FlagshipCanvas canvas={canvas} openNodeId={openNodeId} onNodeClick={handleNodeClick} />
        {isDesktop && <NodeInlinePanel node={openNode} onClose={closePanel} />}

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
