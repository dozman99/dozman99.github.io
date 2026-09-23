import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { flagships } from "@/data/flagships"

export default function Flagships() {
  return (
    <div>
      <PageHeader
        eyebrow="Flagship Stories"
        title="Five deep dives, told node by node"
        description="Each of these will unfold into a clickable architecture canvas — click a node, get the why, the how, and what broke, plus a link to real code. The canvases are coming in the next build phase; for now, here's what each one proves."
      />

      <section className="px-4 pb-20 sm:px-6">
        <div className="space-y-4">
          {flagships.map((f) => (
            <Card key={f.slug} id={f.slug} className="scroll-mt-24">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle>{f.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {f.where} · {f.depth}
                    </p>
                  </div>
                  <Badge variant="outline">Coming soon</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.teaser}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
