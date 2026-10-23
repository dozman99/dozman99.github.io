import { ArrowUpRight } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Label } from "@/components/lex/Label"
import { WorkGrid } from "@/components/lex/WorkGrid"
import { flagships } from "@/data/flagships"
import { canvases } from "@/data/canvases"
import { projects } from "@/data/projects"
import { countWord } from "@/lib/numberWords"

// Projects with a flagship story are shown in the grid, not twice.
const sideProjects = projects.filter((p) => !p.flagshipSlug)
const pad = (n: number) => String(n).padStart(2, "0")

export default function Projects() {
  const builtCount = flagships.filter((f) => f.slug in canvases).length

  return (
    <div>
      <PageHeader
        label="Projects"
        title="Systems I've designed and run"
        description={`${countWord(builtCount)} come with an interactive architecture map: pick any part to see why it exists, how it works and what was hard.`}
        meta={[
          { label: "Flagship stories", value: pad(flagships.length) },
          { label: "Architecture deep dives", value: pad(builtCount) },
          { label: "Other work", value: pad(sideProjects.length) },
        ]}
      />

      <section aria-label="Flagship stories" className="page-frame pb-28 md:pb-40">
        {/* Old /flagships links land here with #slug. */}
        <WorkGrid anchors />
      </section>

      <section aria-labelledby="side-projects" className="page-frame pb-28">
        <div className="mx-auto w-full max-w-5xl">
          <Label className="mb-6">Other work</Label>
          <h2 id="side-projects" className="sr-only">
            Other work
          </h2>
        <ul className="border-t border-border">
          {sideProjects.map((project) => (
            <li key={project.name} className="grid gap-y-3 border-b border-border py-8 sm:grid-cols-8 sm:gap-x-6">
              <div className="sm:col-span-5">
                <h3 className="flex items-center gap-2 text-2xl font-medium tracking-tight">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                    >
                      {project.name}
                      <ArrowUpRight className="size-4" />
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground text-pretty">{project.description}</p>
              </div>
              <p className="text-sm text-muted-foreground sm:col-span-3 sm:text-right">{project.tags.join(", ")}</p>
            </li>
          ))}
        </ul>
        </div>
      </section>
    </div>
  )
}
