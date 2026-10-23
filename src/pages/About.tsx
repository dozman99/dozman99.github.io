import { PageHeader } from "@/components/PageHeader"
import { Rows, Section } from "@/components/lex/Section"
import { aboutIntro, dream, education, interests, lookingFor } from "@/data/about"
import { site } from "@/data/site"

export default function About() {
  return (
    <div>
      <PageHeader
        label="About"
        title="Who I am, outside the bullet points"
        description={`${site.role}, based in ${site.location}.`}
      />

      <Section label="Story">
        <p className="text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-pretty sm:text-4xl lg:text-[2.75rem]">
          {dream}
        </p>
        <div className="mt-12 grid gap-8 text-base leading-relaxed text-muted-foreground sm:grid-cols-2">
          {aboutIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      <Section label="Looking for">
        <p className="mb-8 max-w-2xl text-xl leading-snug tracking-tight">{lookingFor.intro}</p>
        <Rows items={lookingFor.points.map((p) => ({ key: p.label, term: p.label, text: p.text }))} />
      </Section>

      <Section label="Outside of work">
        <Rows items={interests.map((i) => ({ key: i.title, term: i.title, text: i.description }))} />
      </Section>

      <Section label="Education">
        <Rows
          items={education.map((e) => ({
            key: e.school,
            term: e.school,
            text: (
              <>
                {e.degree}
                {e.detail && <span className="block text-sm">{e.detail}</span>}
              </>
            ),
          }))}
        />
      </Section>
    </div>
  )
}
