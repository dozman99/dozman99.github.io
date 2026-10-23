import type { ReactNode } from "react"
import { Label } from "@/components/lex/Label"

/** A page section in the centred column: grey "(Label)" above its content. */
export function Section({ label, children, id }: { label: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="page-frame scroll-mt-24 pb-24 md:pb-32">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        <Label className="mb-6">{label}</Label>
        {children}
      </div>
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
