import { Link } from "react-router-dom"
import { ArrowRight, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { flagships } from "@/data/flagships"
import { canvases } from "@/data/canvases"
import { projects } from "@/data/projects"
import { flagshipStatus, orderedFlagships } from "@/lib/flagshipStatus"
import { countWord } from "@/lib/numberWords"

// Projects with a flagship story are shown in the flagship section, not twice.
const sideProjects = projects.filter((p) => !p.flagshipSlug)

export default function Projects() {
  const builtCount = flagships.filter((f) => f.slug in canvases).length
  const summaryCount = flagships.length - builtCount

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${countWord(flagships.length)} flagship stories, then side projects. ${countWord(builtCount)} ${builtCount === 1 ? "story has" : "stories have"} an interactive architecture canvas: pick a node for why it exists and how it works.${summaryCount > 0 ? ` ${countWord(summaryCount)} ${summaryCount === 1 ? "story is a summary" : "stories are summaries"} only.` : ""}`}
      />

      <section aria-labelledby="flagship-stories" className="px-4 pb-14 sm:px-6">
        <h2 id="flagship-stories" className="mb-4 text-xl font-semibold tracking-tight">Flagship stories</h2>
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

      <section aria-labelledby="side-projects" className="px-4 pb-20 sm:px-6">
        <h2 id="side-projects" className="mb-4 text-xl font-semibold tracking-tight">Side projects</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sideProjects.map((project) => (
            <Card key={project.name}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{project.name}</CardTitle>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} on GitHub`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
