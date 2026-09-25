import { PageHeader } from "@/components/PageHeader"
import { Headshot } from "@/components/Headshot"
import { aboutIntro, dream, education, interests } from "@/data/about"

export default function About() {
  return (
    <div>
      <PageHeader title="Who I am, outside the bullet points" />

      <section className="px-4 pb-14 sm:px-6">
        <div className="flex max-w-3xl flex-col gap-6 sm:flex-row">
          {/* Desktop already shows the photo in the sidebar; only phones need it here. */}
          <Headshot width={160} height={240} className="h-60 w-40 shrink-0 rounded-lg lg:hidden" />
          <div className="space-y-4 text-base text-muted-foreground">
            {aboutIntro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">The dream</h2>
          <p className="text-base text-muted-foreground">{dream}</p>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">Outside of work</h2>
        {/* A term/description list, not a row of three identical cards. */}
        <dl className="max-w-3xl divide-y divide-border border-y border-border">
          {interests.map((interest) => (
            <div key={interest.title} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="text-base font-semibold tracking-tight">{interest.title}</dt>
              <dd className="text-base text-muted-foreground">{interest.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Education</h2>
          <ul className="space-y-3">
            {education.map((e) => (
              <li key={e.school} className="border-l-2 border-border pl-4">
                <p className="font-medium">{e.school}</p>
                <p className="text-sm text-muted-foreground">
                  {e.degree}
                  {e.detail && ` · ${e.detail}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
