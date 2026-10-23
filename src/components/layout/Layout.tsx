import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { ScrollManager } from "@/components/ScrollManager"
import { getRouteMeta } from "@/lib/routeMeta"

export function Layout() {
  const { pathname } = useLocation()

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
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
