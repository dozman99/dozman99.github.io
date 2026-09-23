import { NavLink } from "react-router-dom"
import { ExternalLink, Mail } from "lucide-react"
import { navItems } from "@/data/nav"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

// Desktop-only: the persistent left column (Brittany Chiang-style layout).
// Sticky, so it stays put while page content scrolls in the right column.
// Mobile nav lives separately in MobileHeader.
export function Sidebar() {
  return (
    <aside className="hidden shrink-0 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-80 lg:flex-col lg:justify-between lg:py-16">
      <div>
        <NavLink to="/" className="inline-block">
          <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
        </NavLink>
        <p className="mt-1 text-base font-medium text-foreground/80">{site.role}</p>
        <p className="mt-4 max-w-xs text-sm text-muted-foreground text-pretty">
          {site.tagline}
        </p>

        <nav className="mt-12 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "h-px bg-current transition-all",
                      isActive ? "w-10 bg-foreground" : "w-5 bg-muted-foreground group-hover:w-10",
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground">
        <a
          href={`mailto:${site.email}`}
          aria-label="Email"
          className="transition-colors hover:text-foreground"
        >
          <Mail className="size-4" />
        </a>
        {site.linkedin && (
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
        {site.github && (
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
    </aside>
  )
}
