import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { MobileFooter } from "@/components/layout/MobileFooter"
import { ScrollManager } from "@/components/ScrollManager"
import { getRouteMeta } from "@/lib/routeMeta"
import { TransitFooter, TransitHeader } from "@/components/transit/TransitBands"

export function Layout() {
  const { pathname } = useLocation()

  // Prerendered pages ship the right <title>, but client-side navigation
  // doesn't reload the document, so keep it in step here.
  useEffect(() => {
    document.title = getRouteMeta(pathname).title
  }, [pathname])

  const skip = (
    <a
      href="#main"
      className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  )

  // Home is the first surface of the transit world: full width, signage bands, no sidebar.
  // The other pages keep the sidebar layout until their own redesign pass.
  if (pathname === "/") {
    return (
      <div className="transit flex min-h-svh flex-col">
        {skip}
        <ScrollManager />
        <TransitHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <Outlet />
        </main>
        <TransitFooter />
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col lg:flex-row lg:gap-16 lg:px-6">
      {skip}
      <ScrollManager />
      <MobileHeader />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <Outlet />
        </main>
        <MobileFooter />
      </div>
    </div>
  )
}
