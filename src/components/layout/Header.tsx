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

function NavLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <nav className={cn("flex gap-1", className)}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
              isActive ? "text-foreground" : "text-muted-foreground",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="text-sm font-semibold tracking-tight">
          {site.name}
        </NavLink>

        <NavLinks className="hidden md:flex" />

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              }
            />

            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>{site.name}</SheetTitle>
              </SheetHeader>
              <NavLinks className="flex-col px-4" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
