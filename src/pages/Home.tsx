import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { flagships } from "@/data/flagships"

export default function Home() {
  return (
    <div>
      <section className="px-4 pt-16 pb-14 sm:px-6 lg:pt-16">
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Infrastructure is the proof. Click into how it was built.
        </h2>
        <p className="mt-4 max-w-xl text-base text-muted-foreground text-pretty">
          Five engineering stories, each with the why, the how, and what broke along the way.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link to="/flagships" />}>
            Explore the flagship stories
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link to="/about" />}>
            About me
          </Button>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Flagship stories</h2>
          <Link
            to="/flagships"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {flagships.map((f) => (
            <Card key={f.slug} className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {f.where}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.depth}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
