import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { ScrollManager } from "@/components/ScrollManager"
import { getRouteMeta } from "@/lib/routeMeta"

export function Layout() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)

  // The animation code loads after first paint, in its own chunk.
  useEffect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    import("@/lib/motion").then(({ startSmoothScroll }) => {
      if (!cancelled) stop = startSmoothScroll()
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  // Each page brings new headings and photos; wire them up after it renders.
  useEffect(() => {
    const root = main.current
    if (!root) return
    let stop: (() => void) | undefined
    let cancelled = false
    import("@/lib/motion").then(({ animatePage }) => {
      if (!cancelled) stop = animatePage(root)
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [pathname])

  // Prerendered pages ship the right <title>, but client-side navigation
  // doesn't reload the document, so keep it in step here.
  useEffect(() => {
    document.title = getRouteMeta(pathname).title
  }, [pathname])

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only z-50 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
      <SiteHeader />
      <main ref={main} id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
