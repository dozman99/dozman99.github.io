import type { ReactNode } from "react"
import { Label } from "@/components/lex/Label"

/** A page section: grey "(Label)" on the left, content in the right eight columns. */
export function Section({ label, children, id }: { label: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="page-frame grid scroll-mt-24 gap-y-6 pb-24 md:grid-cols-12 md:pb-32">
      <Label className="md:col-span-4">{label}</Label>
      <div className="min-w-0 md:col-span-8">{children}</div>
    </section>
  )
}

/** Term / description rows with thin rules, as in the template's index lists. */
export function Rows({ items }: { items: { term: ReactNode; text: ReactNode; key: string }[] }) {
  return (
    <dl className="border-t border-border">
      {items.map((item) => (
        <div key={item.key} className="grid gap-1 border-b border-border py-6 sm:grid-cols-8 sm:gap-6">
          <dt className="text-lg font-medium tracking-tight sm:col-span-3">{item.term}</dt>
          <dd className="text-base text-muted-foreground text-pretty sm:col-span-5">{item.text}</dd>
        </div>
      ))}
    </dl>
  )
}
