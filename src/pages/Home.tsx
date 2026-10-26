import { Link } from "react-router-dom"
import { ArrowRight, CalendarDays, Download } from "lucide-react"
import { ContactLinks } from "@/components/ContactLinks"
import { Label, Meta } from "@/components/lex/Label"
import { FillText } from "@/components/lex/FillText"
import { WorkGrid } from "@/components/lex/WorkGrid"
import { flagships } from "@/data/flagships"
import { contact, hero, statement } from "@/data/home"
import { site } from "@/data/site"
import { imageSet } from "@/data/work"

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
            </div>
          </div>

          <h1 data-split className="display mt-14 text-[17vw] leading-[0.86] md:mt-20 md:text-[11.5vw] 2xl:text-[10.5rem]">
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

          <ContactLinks className="mt-8" />
        </div>

        <div data-reveal className="overflow-hidden md:col-span-4 md:mt-12 md:self-start">
          <img
            {...imageSet("/portrait", "portrait")}
            sizes="(min-width: 768px) min(30vw, 440px), 100vw"
            alt={`${site.name} against a blue studio backdrop`}
            fetchPriority="high"
            decoding="async"
            className="aspect-[3/4] h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* About: one statement that fills in as it scrolls, then the numbers. */}
      <section className="page-frame pb-28 md:pb-44">
        <div className="mx-auto w-full max-w-5xl">
          <Label className="mb-6">About</Label>
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
        <div className="mb-12 grid items-end gap-y-4 md:mb-16 xl:grid-cols-12">
          <Label className="order-1 xl:col-span-3">Selected work</Label>
          <h2 data-split className="display order-2 text-5xl sm:text-6xl xl:col-span-7 lg:text-7xl">Selected systems</h2>
          <Link
            to="/projects"
            className="order-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary md:min-h-0 xl:col-span-2 xl:justify-self-end"
          >
            All projects ({flagships.length})
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <WorkGrid layout="home" />
      </section>

      {/* Contact, set on the desk photo as in the template (tinted like the
          project photos). A dark fade from the left, an even wash on phones,
          keeps the white text readable over the pale room. */}
      <section className="page-frame pb-16 md:pb-24">
        <div data-reveal data-parallax className="relative isolate overflow-hidden bg-[#0a274c]">
          <img
            {...imageSet("/workspace", "wide")}
            sizes="(min-width: 768px) min(100vw, 1440px), 320vw"
            alt="An empty white desk and chair beside an open door"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-10 size-full object-cover object-[45%_bottom]"
          />
          <div className="absolute inset-0 -z-10 bg-black/50 md:bg-transparent md:bg-linear-to-r md:from-black/75 md:via-black/50 md:to-black/10" />
          <div className="grid min-h-[80svh] content-end gap-y-6 p-6 text-white md:grid-cols-12 md:p-12">
            <div className="md:col-span-7">
              <p className="mb-6 text-sm text-white/80">(Contact)</p>
              <h2 data-split className="display text-5xl sm:text-6xl lg:text-7xl">
                {contact.headline}
              </h2>
              <p className="mt-6 max-w-md text-lg text-white/90">{contact.line}</p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-neutral-950 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Email me
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href={site.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 px-6 text-sm font-medium text-white transition-colors hover:border-white"
                >
                  <CalendarDays className="size-4" />
                  Book a call
                </a>
                <a
                  href={site.resume}
                  download="Chiedozie-Onyekwum-Resume.pdf"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 px-6 text-sm font-medium text-white transition-colors hover:border-white"
                >
                  <Download className="size-4" />
                  Download résumé
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
