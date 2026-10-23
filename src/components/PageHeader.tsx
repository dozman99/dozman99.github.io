import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Label, Meta } from "@/components/lex/Label"
import { cn } from "@/lib/utils"

// Label in the left three columns, a large title and grey lead in the right nine,
// then an optional row of small facts.
export function PageHeader({
  back,
  label,
  title,
  description,
  meta,
}: {
  /** Optional "back to parent" link, shown above the title. */
  back?: { to: string; label: string }
  /** Small "(Section)" marker on the left. */
  label?: string
  title: ReactNode
  description?: ReactNode
  meta?: { label: string; value: ReactNode }[]
}) {
  return (
    <header className="page-frame grid gap-y-6 pt-16 pb-14 md:grid-cols-12 md:pt-28 md:pb-20">
      <div className="md:col-span-3">{label && <Label>{label}</Label>}</div>
      <div className="md:col-span-9">
        {back && (
          <Link
            to={back.to}
            className="mb-8 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:min-h-0"
          >
            <ArrowLeft className="size-3.5" />
            {back.label}
          </Link>
        )}
        <h1 data-split className="display text-5xl sm:text-6xl lg:text-7xl">{title}</h1>
        {description && (
          <p className="mt-6 max-w-xl text-lg leading-snug text-muted-foreground text-pretty">{description}</p>
        )}
        {meta && <Meta items={meta} className="mt-10 sm:grid-cols-4" />}
      </div>
    </header>
  )
}

/** Body content aligned under the header's title column. */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("page-frame grid pb-24 md:grid-cols-12", className)}>
      <div className="min-w-0 md:col-span-9 md:col-start-4">{children}</div>
    </div>
  )
}
