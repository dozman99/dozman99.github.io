import { NavLink } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navItems } from "@/data/nav"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/85 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
      <NavLink to="/" className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">{site.name}</span>
        <span className="text-xs text-muted-foreground">{site.role}</span>
      </NavLink>

      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu" className="size-11">
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>{site.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                      isActive ? "bg-accent text-foreground" : "text-muted-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4 border-t border-border px-4 py-6">
              <div className="flex items-center gap-5 text-sm font-medium">
                <a href={site.resume} target="_blank" rel="noreferrer" className="text-foreground/85 hover:text-primary">
                  Résumé
                </a>
                <a href={`mailto:${site.email}`} className="text-foreground/85 hover:text-primary">
                  Email me
                </a>
              </div>
              <ThemeToggle className="self-start" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
