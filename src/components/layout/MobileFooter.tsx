import { FileText, Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/BrandIcons"
import { site } from "@/data/site"

// Desktop shows contact/social links in the Sidebar instead — this is mobile-only.
export function MobileFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 lg:hidden">
      <div className="flex flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          &copy; {year} {site.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 font-medium text-foreground/85 transition-colors hover:text-primary"
          >
            <FileText className="size-4" />
            Résumé
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
            Email
          </a>
          {site.linkedin && (
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <LinkedInIcon className="size-5" />
              LinkedIn
            </a>
          )}
          {site.github && (
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-5" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
