import { useState } from "react"
import { Check, Copy, ExternalLink } from "lucide-react"
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

export function NodePanel({
  node,
  open,
  onOpenChange,
}: {
  node: CanvasNode | SideNode | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {node && (
          <>
            <SheetHeader>
              <SheetTitle>{node.label}</SheetTitle>
              {node.sublabel && <SheetDescription>{node.sublabel}</SheetDescription>}
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 pb-6">
              <section>
                <h3 className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Why
                </h3>
                <p className="text-sm text-foreground/90">{node.detail.why}</p>
              </section>

              <Separator />

              <section>
                <h3 className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  How
                </h3>
                <p className="text-sm text-foreground/90">{node.detail.how}</p>
              </section>

              {node.detail.whatBroke && (
                <>
                  <Separator />
                  <section>
                    <h3 className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      What was hard
                    </h3>
                    <p className="text-sm text-foreground/90">{node.detail.whatBroke}</p>
                  </section>
                </>
              )}

              <Separator />

              <div className="flex flex-wrap gap-2">
                {node.detail.codeLink ? (
                  <Button variant="outline" size="sm" render={<a href={node.detail.codeLink} target="_blank" rel="noreferrer" />}>
                    <ExternalLink className="size-3.5" />
                    View code
                  </Button>
                ) : (
                  <span className="inline-flex items-center rounded-md border border-dashed px-2.5 py-1 text-xs text-muted-foreground">
                    Sample repo coming soon
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={copyLink}>
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy link to this node"}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
