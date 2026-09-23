import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { MobileFooter } from "@/components/layout/MobileFooter"
import { ScrollManager } from "@/components/ScrollManager"

export function Layout() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col lg:flex-row lg:gap-16 lg:px-6">
      <ScrollManager />
      <MobileHeader />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <MobileFooter />
      </div>
    </div>
  )
}
