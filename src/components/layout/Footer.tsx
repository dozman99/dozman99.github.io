import { ExternalLink, Mail } from "lucide-react"
import { site } from "@/data/site"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          &copy; {year} {site.name}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
            Email
          </a>
          {site.linkedin && (
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              LinkedIn
            </a>
          )}
          {site.github && (
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
