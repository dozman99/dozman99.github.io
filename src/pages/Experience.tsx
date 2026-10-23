import { Link } from "react-router-dom"
import { ArrowRight, ExternalLink } from "lucide-react"
import { PageBody, PageHeader } from "@/components/PageHeader"
import { Separator } from "@/components/ui/separator"
import { workExperience, leadership, type Role } from "@/data/experience"
import { certifications } from "@/data/certifications"
import { canvases } from "@/data/canvases"

function RoleCard({ role }: { role: Role }) {
  return (
    <article className="py-8 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-2xl font-medium tracking-tight">{role.company}</h3>
        <span className="text-sm text-muted-foreground">{role.dates}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {role.role} · {role.location}
      </p>
      {role.blurb && <p className="mt-3 max-w-prose text-sm text-foreground/90">{role.blurb}</p>}
      <ul className="mt-4 max-w-prose list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        {role.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      {role.flagshipSlug && (
        <Link
          to={
            role.flagshipSlug in canvases
              ? `/flagships/${role.flagshipSlug}`
              : `/projects#${role.flagshipSlug}`
          }
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
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
        label="Experience"
        title="Full timeline"
        description="This page gives more detail than my résumé."
      />

      <PageBody>
        <div>
          <section className="pb-16">
            <h2 className="mb-4 text-sm font-normal text-muted-foreground">(Work)</h2>
            <Separator />
            <div className="divide-y divide-border">
              {workExperience.map((role) => (
                <RoleCard key={role.company + role.dates} role={role} />
              ))}
            </div>
          </section>

          <section className="pb-16">
            <h2 className="mb-4 text-sm font-normal text-muted-foreground">(Leadership &amp; volunteering)</h2>
            <Separator />
            <div className="divide-y divide-border">
              {leadership.map((role) => (
                <RoleCard key={role.company + role.dates} role={role} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-sm font-normal text-muted-foreground">(Certifications)</h2>
            <Separator className="mb-4" />
            <div className="grid gap-x-8 sm:grid-cols-2">
              {certifications.map((cert) => (
                <a
                  key={cert.name}
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-2 border-b border-border py-4 transition-colors hover:text-primary"
                >
                  <div>
                    <p className="text-sm font-medium">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
                    Verify
                    <ExternalLink className="size-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </section>

        </div>
      </PageBody>
    </div>
  )
}
