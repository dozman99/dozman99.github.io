import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { workExperience, leadership, type Role } from "@/data/experience"
import { certifications } from "@/data/certifications"
import { canvases } from "@/data/canvases"

function RoleCard({ role }: { role: Role }) {
  return (
    <article className="py-8 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-semibold tracking-tight">{role.company}</h3>
        <span className="text-sm text-muted-foreground">{role.dates}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {role.role} · {role.location}
      </p>
      {role.blurb && <p className="mt-3 text-sm text-foreground/90">{role.blurb}</p>}
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        {role.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      {role.flagshipSlug && (
        <Link
          to={
            role.flagshipSlug in canvases
              ? `/flagships/${role.flagshipSlug}`
              : `/flagships#${role.flagshipSlug}`
          }
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          Full flagship story
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </article>
  )
}

export default function Experience() {
  return (
    <div>
      <PageHeader
        eyebrow="Experience"
        title="Full timeline"
        description="The condensed version is on the resume. This is the fuller story: what each role actually involved."
      />

      <div className="px-4 pb-20 sm:px-6">
        <div className="max-w-3xl">
          <section className="pb-16">
            <h2 className="mb-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Work
            </h2>
            <Separator />
            <div className="divide-y divide-border">
              {workExperience.map((role) => (
                <RoleCard key={role.company + role.dates} role={role} />
              ))}
            </div>
          </section>

          <section className="pb-16">
            <h2 className="mb-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Leadership &amp; Volunteering
            </h2>
            <Separator />
            <div className="divide-y divide-border">
              {leadership.map((role) => (
                <RoleCard key={role.company + role.dates} role={role} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Certifications
            </h2>
            <Separator className="mb-4" />
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <a key={cert.name} href={cert.url} target="_blank" rel="noreferrer">
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    {cert.name}
                  </Badge>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
