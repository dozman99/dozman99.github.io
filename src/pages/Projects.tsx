import { ArrowRight, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/data/projects"

export default function Projects() {
  return (
    <div>
      <PageHeader title="Things I've built outside client work" />

      <section className="px-4 pb-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
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
                {project.flagshipSlug && (
                  <Link
                    to={`/flagships/${project.flagshipSlug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
                  >
                    Explore the architecture
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
