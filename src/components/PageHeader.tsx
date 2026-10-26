import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { ContactLinks } from "@/components/ContactLinks"
import { Label, Meta } from "@/components/lex/Label"
import { cn } from "@/lib/utils"

// One centred column at every width: the small "(Label)" above a large title,
// a grey lead, then an optional row of small facts. Equal space on both sides.
export function PageHeader({
  back,
  label,
  title,
  description,
  meta,
}: {
  /** Optional "back to parent" link, shown above the title. */
  back?: { to: string; label: string }
  /** Small "(Section)" marker above the title. */
  label?: string
  title: ReactNode
  description?: ReactNode
  meta?: { label: string; value: ReactNode }[]
}) {
  return (
    <header className="page-frame pt-16 pb-14 md:pt-28 md:pb-20">
      <div className="mx-auto w-full max-w-5xl">
        {/* Breadcrumb on the left, contact links on the right; they stack on phones. */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          {(label || back) && (
            <div className="flex flex-col items-start gap-6">
              {label && <Label>{label}</Label>}
              {back && (
                <Link
                  to={back.to}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:min-h-0"
                >
                  <ArrowLeft className="size-3.5" />
                  {back.label}
                </Link>
              )}
            </div>
          )}
          <ContactLinks />
        </div>
        <h1 data-split className="display text-5xl sm:text-6xl lg:text-7xl">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-snug text-muted-foreground text-pretty">{description}</p>
        )}
        {meta && <Meta items={meta} className="mt-10 sm:grid-cols-4" />}
      </div>
    </header>
  )
}

/** Body content in the same centred column as the header. */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("page-frame pb-24", className)}>
      <div className="mx-auto w-full max-w-5xl min-w-0">{children}</div>
    </div>
  )
}
