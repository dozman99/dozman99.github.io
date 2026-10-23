import { NavLink } from "react-router-dom"
import { ArrowRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { navItems } from "@/data/nav"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

// Name on the left, pages in the middle, email and a contact link on the right.
// Below lg the pages fold into a sheet.
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

        <div className="hidden items-center justify-end gap-6 lg:col-span-4 lg:flex">
          <a
            href={`mailto:${site.email}`}
            className="truncate text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {site.email}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          >
            Contact
            <ArrowRight className="size-3.5" />
          </a>
        </div>

        <div className="flex justify-end md:col-span-9 lg:hidden">
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
              <a
                href={`mailto:${site.email}`}
                className="mx-4 mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium hover:text-primary"
              >
                Contact
                <ArrowRight className="size-3.5" />
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
