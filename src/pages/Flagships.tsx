import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { flagships } from "@/data/flagships"
import { canvases } from "@/data/canvases"

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

export default function Flagships() {
  const builtCount = flagships.filter((f) => f.slug in canvases).length

  return (
    <div>
      <PageHeader
        eyebrow="Flagship Stories"
        title={`${NUMBER_WORDS[flagships.length] ?? flagships.length} deep dives, told node by node`}
        description={`Each canvas unfolds as you click: pick a node, get the why, the how, and what was hard, plus a link to real code. ${NUMBER_WORDS[builtCount] ?? builtCount} ${builtCount === 1 ? "is" : "are"} built so far; the rest are still teasers.`}
      />

      <section className="px-4 pb-20 sm:px-6">
        <div className="space-y-4">
          {flagships.map((f) => {
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
                    <Badge variant={hasCanvas ? "default" : "outline"}>
                      {hasCanvas ? "Explore the canvas" : "Coming soon"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.teaser}</p>
                  {hasCanvas && (
                    <Link
                      to={`/flagships/${f.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
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
