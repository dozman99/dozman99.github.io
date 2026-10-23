import { FileText, Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/BrandIcons"
import { ThemeToggle } from "@/components/ThemeToggle"
import { site } from "@/data/site"

export function SiteFooter() {
  const year = new Date().getFullYear()
  const link =
    "inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground md:min-h-0"

  return (
    <footer className="border-t border-border">
      <div className="page-frame grid gap-y-6 py-10 text-sm md:grid-cols-12 md:items-center">
        <p className="text-muted-foreground md:col-span-4">
          &copy; {year} {site.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 md:col-span-6">
          <a href={site.resume} target="_blank" rel="noreferrer" className={link}>
            <FileText className="size-4" />
            Résumé
          </a>
          <a href={`mailto:${site.email}`} className={link}>
            <Mail className="size-4" />
            Email
          </a>
          {site.linkedin && (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={link}>
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          )}
          {site.github && (
            <a href={site.github} target="_blank" rel="noreferrer" className={link}>
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          )}
        </div>
        <ThemeToggle className="md:col-span-2 md:justify-self-end" />
      </div>
    </footer>
  )
}
