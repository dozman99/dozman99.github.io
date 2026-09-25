import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { flagships } from "@/data/flagships"
import { canvases } from "@/data/canvases"
import { flagshipStatus, orderedFlagships } from "@/lib/flagshipStatus"
import { countWord } from "@/lib/numberWords"


export default function Flagships() {
  const builtCount = flagships.filter((f) => f.slug in canvases).length

  return (
    <div>
      <PageHeader
        title="Engineering stories, told node by node"
        description={`${countWord(flagships.length)} stories. ${countWord(builtCount)} ${builtCount === 1 ? "has" : "have"} an interactive architecture canvas so far: pick a node for why it exists and how it works. The rest are teasers.`}
      />

      <section className="px-4 pb-20 sm:px-6">
        <div className="space-y-4">
          {orderedFlagships.map((f) => {
            const hasCanvas = f.slug in canvases
            return (
              <Card key={f.slug} id={f.slug} className="scroll-mt-24">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle>{f.title}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {f.where} · {f.depth}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        hasCanvas
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-dashed text-muted-foreground"
                      }
                    >
                      {flagshipStatus(f.slug)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="max-w-prose text-sm text-muted-foreground">{f.teaser}</p>
                  {hasCanvas && (
                    <Link
                      to={`/flagships/${f.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
                    >
                      Explore the architecture
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
