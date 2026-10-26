import { Link } from "react-router-dom"
import { ArrowRight, Download, Mail } from "lucide-react"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

// Pill buttons in the same shape as the contact panel on Home: one filled
// main action, two outlined ones beside it.
const pill =
  "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors md:h-10"
const filled = cn(pill, "bg-primary text-primary-foreground hover:bg-foreground hover:text-background")
const outlined = cn(pill, "border border-foreground/20 text-foreground hover:border-foreground")

/** Contact me, Email me and Download résumé, for the top of each page. */
export function ContactLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <Link to="/#contact" className={filled}>
        Contact me
        <ArrowRight className="size-4" />
      </Link>
      <a href={`mailto:${site.email}`} className={outlined}>
        <Mail className="size-4" />
        Email me
      </a>
      <a href={site.resume} download="Chiedozie-Onyekwum-Resume.pdf" className={outlined}>
        <Download className="size-4" />
        Download résumé
      </a>
    </div>
  )
}
