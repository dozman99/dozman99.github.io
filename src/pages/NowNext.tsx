import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { now, next } from "@/data/nowNext"

function ItemCard({ item }: { item: { title: string; detail: string; flagshipSlug?: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.detail}</p>
        {item.flagshipSlug && (
          <Link
            to={`/flagships/${item.flagshipSlug}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            Explore the architecture
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

export default function NowNext() {
  return (
    <div>
      <PageHeader eyebrow="Now / Next" title="What I'm doing, and what's coming" />

      <section className="px-4 pb-20 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Now</h2>
            <div className="space-y-4">
              {now.map((item) => (
                <ItemCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Next</h2>
            <div className="space-y-4">
              {next.map((item) => (
                <ItemCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
