import { useEffect, useState } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "theme"
// Sidebar and mobile header each mount a toggle; this keeps them in agreement.
const CHANGE_EVENT = "themechange"
const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "system", label: "System theme", Icon: Monitor },
  { value: "dark", label: "Dark theme", Icon: Moon },
]

// Dark (olive-black) is the site's default look; "system" is an explicit
// opt-in to follow the OS, so it's stored like the other two.
const DEFAULT_THEME: Theme = "dark"

function readStored(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === "light" || v === "dark" || v === "system" ? v : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#1d2016" : "#f6f1e3")
}

// Mirrors the pre-paint script in index.html, which applies the stored choice
// before React mounts so there's no flash of the wrong theme.
export function ThemeToggle({ className }: { className?: string }) {
  // The prerender has no window, so it always renders the default; main.tsx uses
  // createRoot (not hydrateRoot), so the client reading storage here is safe.
  const [theme, setTheme] = useState<Theme>(readStored)

  useEffect(() => {
    const sync = (e: Event) => setTheme((e as CustomEvent<Theme>).detail)
    window.addEventListener(CHANGE_EVENT, sync)
    return () => window.removeEventListener(CHANGE_EVENT, sync)
  }, [])

  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => apply("system")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  function choose(next: Theme) {
    apply(next)
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }))
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage blocked (private mode etc.): the choice still applies for this visit.
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5",
        className,
      )}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => choose(value)}
          className={cn(
            // 44px touch targets on mobile, compact in the desktop sidebar.
            "flex size-11 items-center justify-center rounded-full transition-colors lg:size-7",
            theme === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}
