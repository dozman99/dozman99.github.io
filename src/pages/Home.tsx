import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { flagships } from "@/data/flagships"
import { site } from "@/data/site"

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pt-20 pb-14 sm:px-6 sm:pt-28">
        <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {site.role}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
          {site.tagline}
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

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
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
