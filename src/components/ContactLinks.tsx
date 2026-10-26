import { Download, Mail } from "lucide-react"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

const link =
  "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground md:min-h-0"

/** "Email me" and "Download résumé", for the top of each page. */
export function ContactLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5", className)}>
      <a href={`mailto:${site.email}`} className={link}>
        <Mail className="size-3.5" />
        Email me
      </a>
      <a href={site.resume} download="Chiedozie-Onyekwum-Resume.pdf" className={link}>
        <Download className="size-3.5" />
        Download résumé
      </a>
    </div>
  )
}
