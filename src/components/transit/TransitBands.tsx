import { useState } from "react"
import { NavLink } from "react-router-dom"
import { FileText, Mail, Menu, X } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/BrandIcons"
import { ThemeToggle } from "@/components/ThemeToggle"
import { navItems } from "@/data/nav"
import { now } from "@/data/nowNext"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

const navLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex min-h-11 items-center border-b-2 px-1 text-[0.95rem] font-semibold transition-colors",
    isActive ? "border-current text-[var(--t-band-ink)]" : "border-transparent text-[var(--t-band-muted)] hover:text-[var(--t-band-ink)]",
  )

/** The black signage band across the top of the transit world. */
export function TransitHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="t-band">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-4 py-2 sm:px-8">
        <NavLink to="/" className="flex min-h-11 flex-col justify-center leading-tight">
          <span className="text-[1.05rem] font-extrabold tracking-[-0.01em]">{site.name}</span>
          <span className="text-sm text-[var(--t-band-muted)]">{site.role}</span>
        </NavLink>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLink}>
              {item.label}
            </NavLink>
          ))}
          <a href={site.resume} target="_blank" rel="noreferrer" className={navLink({ isActive: false })}>
            Résumé
          </a>
          <ThemeToggle />
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="transit-menu"
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-semibold transition-transform active:scale-95 lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          Menu
        </button>
      </div>

      {open && (
        <nav id="transit-menu" aria-label="Main" className="border-t border-border px-4 pt-2 pb-5 sm:px-8 lg:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === "/"} className={navLink} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a href={site.resume} target="_blank" rel="noreferrer" className={navLink({ isActive: false })}>
                Résumé
              </a>
            </li>
          </ul>
          <ThemeToggle className="mt-3" />
        </nav>
      )}
    </header>
  )
}

/** The closing band: every way to reach me, and how the site itself is built. */
export function TransitFooter() {
  const pipeline = now.flatMap((item) => item.links ?? []).find((l) => l.label === "Pipeline")
  const link =
    "inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--t-band-muted)] transition-colors hover:text-[var(--t-band-ink)]"

  return (
    <footer className="t-band">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-6 px-4 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <a href={`mailto:${site.email}`} className={link}>
              <Mail className="size-4" />
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={link}>
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noreferrer" className={link}>
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </li>
          <li>
            <a href={site.resume} target="_blank" rel="noreferrer" className={link}>
              <FileText className="size-4" />
              Résumé
            </a>
          </li>
        </ul>
        <p className="text-sm text-[var(--t-band-muted)]">
          © {new Date().getFullYear()} {site.name}.{" "}
          {pipeline ? (
            <a href={pipeline.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[var(--t-band-ink)]">
              Built from data files and deployed by GitHub Actions.
            </a>
          ) : (
            "Built from data files and deployed by GitHub Actions."
          )}
        </p>
      </div>
    </footer>
  )
}
