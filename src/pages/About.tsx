import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { aboutIntro, dream, education, interests } from "@/data/about"

export default function About() {
  return (
    <div>
      <PageHeader eyebrow="About" title="Who I am, outside the bullet points" />

      <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
        <div className="max-w-3xl space-y-4 text-base text-muted-foreground">
          {aboutIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">The dream</h2>
          <p className="text-base text-muted-foreground">{dream}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">Outside of work</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {interests.map((interest) => (
            <Card key={interest.title}>
              <CardHeader>
                <CardTitle className="text-base">{interest.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{interest.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
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
