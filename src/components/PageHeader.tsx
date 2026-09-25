import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function PageHeader({
  back,
  title,
  description,
}: {
  /** Optional "back to parent" link, shown above the title. */
  back?: { to: string; label: string }
  title: ReactNode
  description?: ReactNode
}) {
  return (
    <div className="px-4 pt-16 pb-10 sm:px-6">
      {back && (
        <Link
          to={back.to}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          {back.label}
        </Link>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-base text-muted-foreground text-pretty">
          {description}
        </p>
      )}
    </div>
  )
}
