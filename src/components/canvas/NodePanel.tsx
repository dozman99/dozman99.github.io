import { useEffect, useRef, useState } from "react"
import { Check, Copy, ExternalLink, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { CanvasNode, SideNode } from "@/data/canvases/types"

type Node = CanvasNode | SideNode

function DetailBody({ node, headingAs: H }: { node: Node; headingAs: "h3" | "h4" }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can be unavailable (permissions, non-secure context) — fail quietly.
    }
  }

  const sections = [
    { title: "Why", body: node.detail.why },
    { title: "How", body: node.detail.how },
    ...(node.detail.whatBroke ? [{ title: "What was hard", body: node.detail.whatBroke }] : []),
  ]

  return (
    <div className="flex flex-col gap-5">
      {sections.map((s, i) => (
        <div key={s.title} className="flex flex-col gap-5">
          {i > 0 && <Separator />}
          <section>
            <H className="mb-1.5 text-sm font-semibold text-primary">{s.title}</H>
            <p className="max-w-prose text-sm leading-relaxed text-foreground/90">{s.body}</p>
          </section>
        </div>
      ))}

      <Separator />

      <div className="flex flex-wrap gap-2">
        {node.detail.codeLink && (
          <Button variant="outline" size="sm" className="h-11 lg:h-8" render={<a href={node.detail.codeLink} target="_blank" rel="noreferrer" />}>
            <ExternalLink className="size-3.5" />
            View code
          </Button>
        )}
        <Button variant="outline" size="sm" className="h-11 lg:h-8" onClick={copyLink}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy link to this node"}
        </Button>
      </div>
    </div>
  )
}

/** Phones and tablets: a slide-over sheet, since there's no room beside the canvas. */
export function NodeSheet({
  node,
  onClose,
}: {
  node: Node | null
  onClose: () => void
}) {
  // Land focus on the node's title, not the first button ("Copy link").
  const titleRef = useRef<HTMLHeadingElement>(null)
  return (
    <Sheet open={node !== null} onOpenChange={(open) => !open && onClose()}>
      {/* The shadcn side variant sets w-3/4; override it so phones get the full width. */}
      <SheetContent
        side="right"
        initialFocus={titleRef}
        className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        {node && (
          <>
            <SheetHeader>
              <SheetTitle ref={titleRef} tabIndex={-1} className="outline-none">
                {node.label}
              </SheetTitle>
              {node.sublabel && (
                <SheetDescription className="font-mono text-xs">{node.sublabel}</SheetDescription>
              )}
            </SheetHeader>
            <div className="px-4 pb-6">
              <DetailBody node={node} headingAs="h3" />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

/**
 * Desktop: the detail opens inline under the canvas instead of a modal, so
 * the diagram (and the highlighted connectors) stay visible while reading.
 */
export function NodeInlinePanel({
  node,
  onClose,
}: {
  node: Node | null
  onClose: () => void
}) {
  const ref = useRef<HTMLElement>(null)

  // Opening moves focus into the panel (so keyboard and screen-reader users
  // land on the content); closing hands it back to the node that opened it.
  useEffect(() => {
    if (!node) return
    const el = ref.current
    el?.focus({ preventScroll: true })
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    const id = node.id
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.querySelector<HTMLElement>(`[data-node-id="${id}"]`)?.focus({ preventScroll: true })
    }
  }, [node, onClose])

  if (!node) return null

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-labelledby="node-panel-title"
      className="mt-6 scroll-mt-6 rounded-xl border border-primary/40 bg-card p-6 shadow-md shadow-primary/5 outline-none animate-in fade-in-0 slide-in-from-top-1 duration-200 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 id="node-panel-title" className="text-lg font-semibold tracking-tight">
            {node.label}
          </h3>
          {node.sublabel && (
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">{node.sublabel}</p>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close details">
          <X className="size-4" />
        </Button>
      </div>
      <DetailBody node={node} headingAs="h4" />
    </section>
  )
}
