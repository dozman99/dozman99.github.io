import { NavLink } from "react-router-dom"
import { CalendarDays, Download, Mail, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { navItems } from "@/data/nav"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

// Name on the left, pages in the middle, Book a call on the right. The bar is
// sticky, so the call button stays on screen at every scroll position and size.
// Below lg the pages fold into a sheet; Book a call stays visible beside it.
const bookCall =
  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground hover:text-background"

function BookCall({ className }: { className?: string }) {
  return (
    <a href={site.booking} target="_blank" rel="noopener noreferrer" className={cn(bookCall, className)}>
      <CalendarDays className="size-4" />
      Book a call
    </a>
  )
}

export function SiteHeader() {
  const pages = navItems.filter((item) => item.to !== "/")

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="page-frame grid h-16 grid-cols-[1fr_auto] items-center md:grid-cols-12">
        <NavLink to="/" className="text-sm font-semibold tracking-tight md:col-span-3">
          {site.name}
        </NavLink>

        <nav aria-label="Main" className="hidden items-center gap-5 lg:col-span-5 lg:flex">
          {pages.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-5 lg:col-span-4 lg:flex">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="size-3.5" />
            Email
          </a>
          <a
            href={site.resume}
            download="Chiedozie-Onyekwum-Resume.pdf"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Download className="size-3.5" />
            Résumé
          </a>
          <BookCall />
        </div>

        <div className="flex items-center justify-end gap-1 md:col-span-9 lg:hidden">
          <BookCall />
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" className="size-11">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{site.name}</SheetTitle>
              </SheetHeader>
              <nav aria-label="Main" className="flex flex-col px-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-11 items-center border-b border-border text-lg tracking-tight transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mx-4 mt-6 flex flex-col items-start gap-1">
                <BookCall className="mb-2 h-11 px-5" />
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary"
                >
                  <Mail className="size-4" />
                  Email me
                </a>
                <a
                  href={site.resume}
                  download="Chiedozie-Onyekwum-Resume.pdf"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary"
                >
                  <Download className="size-4" />
                  Download résumé
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
