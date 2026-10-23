import { Link } from "react-router-dom"
import { ArrowRight, Download } from "lucide-react"
import { Label, Meta } from "@/components/lex/Label"
import { FillText } from "@/components/lex/FillText"
import { WorkGrid } from "@/components/lex/WorkGrid"
import { lookingFor } from "@/data/about"
import { flagships } from "@/data/flagships"
import { hero, statement } from "@/data/home"
import { site } from "@/data/site"

const [firstName, ...rest] = site.name.split(" ")
const lastName = rest.join(" ")

export default function Home() {
  return (
    <div>
      {/* Intro: a line about the work, the name very large, the portrait on the right. */}
      <section className="page-frame grid gap-y-10 pt-12 pb-24 md:grid-cols-12 md:gap-x-8 md:pt-20 md:pb-40">
        <div className="md:col-span-8">
          <div className="grid gap-y-3 sm:grid-cols-8">
            <Label className="sm:col-span-3">Intro</Label>
            <div className="max-w-md text-lg leading-snug text-pretty sm:col-span-5 md:text-xl">
              <p>{hero.intro[0]}</p>
              <p className="mt-2 text-muted-foreground">{hero.intro[1]}</p>
            </div>
          </div>

          <h1 className="display mt-14 text-[17vw] leading-[0.86] md:mt-20 md:text-[11.5vw] 2xl:text-[10.5rem]">
            {firstName}
            <br />
            {lastName}
          </h1>

          <Meta
            className="mt-10"
            items={[
              {
                label: "Focus",
                value: (
                  <ul>
                    {hero.areas.map((a) => (
                      <li key={a.label}>{a.label}</li>
                    ))}
                  </ul>
                ),
              },
              { label: "Based in", value: site.location },
              {
                label: "Availability",
                value: (
                  <span className="inline-flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {hero.intro[2]}
                  </span>
                ),
              },
            ]}
          />
        </div>

        <div className="md:col-span-4 md:pt-12">
          <img
            src="/portrait.webp"
            alt={`${site.name} against a blue studio backdrop`}
            width={900}
            height={1200}
            className="aspect-[3/4] h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* About: one statement that fills in as it scrolls, then the numbers. */}
      <section className="page-frame grid gap-y-6 pb-28 md:grid-cols-12 md:pb-44">
        <Label className="md:col-span-4">About</Label>
        <div className="md:col-span-8">
          <FillText
            text={statement}
            className="text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-pretty sm:text-4xl lg:text-[2.75rem]"
          />
          <dl className="mt-12 grid gap-x-6 gap-y-6 border-t border-border pt-6 sm:grid-cols-3">
            {hero.stats.map((s) => (
              <div key={s.value}>
                <dt className="text-xl tracking-tight">{s.value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
          <Link
            to="/about"
            className="mt-10 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary md:min-h-0"
          >
            More about me
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Selected work */}
      <section className="page-frame pb-28 md:pb-40">
        <div className="mb-12 grid items-end gap-y-4 md:mb-16 md:grid-cols-12">
          <Label className="order-1 md:col-span-4">Selected work</Label>
          <h2 className="display order-2 text-5xl sm:text-6xl md:col-span-6 lg:text-7xl">Flagship stories</h2>
          <Link
            to="/projects"
            className="order-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary md:col-span-2 md:min-h-0 md:justify-self-end"
          >
            All projects ({flagships.length})
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <WorkGrid />
      </section>

      {/* Contact */}
      <section className="page-frame pb-16 md:pb-24">
        <div className="grid gap-y-6 border-t border-border pt-16 md:grid-cols-12 md:pt-24">
          <Label className="md:col-span-4">Contact</Label>
          <div className="md:col-span-8">
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">{lookingFor.intro}</h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{hero.intro[2]}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Email me
                <ArrowRight className="size-4" />
              </a>
              <a
                href={site.resume}
                download="Chiedozie-Onyekwum-Resume.pdf"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium transition-colors hover:border-foreground"
              >
                <Download className="size-4" />
                Download résumé
              </a>
            </div>
          </div>
        </div>
        <img
          src="/workspace.webp"
          alt="An empty white desk and chair beside an open door"
          width={2680}
          height={1508}
          loading="lazy"
          className="mt-16 aspect-video h-auto w-full object-cover md:mt-24"
        />
      </section>
    </div>
  )
}
