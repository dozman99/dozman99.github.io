import type { ReactNode } from "react"

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-16 pb-10 sm:px-6">
      {eyebrow && (
        <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {eyebrow}
        </p>
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
