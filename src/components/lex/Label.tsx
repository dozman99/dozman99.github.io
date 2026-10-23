import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** The small grey "(Section)" marker in the left column. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>({children})</p>
}

/** Small grey caption above a value, as in "Based in / Austin, TX". */
export function Meta({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
