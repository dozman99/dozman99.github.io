import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { lenisRef } from "@/lib/lenisRef"

/**
 * Plain <Routes> (not a data router) gives no scroll restoration for free:
 * scroll to a hash target on navigation, otherwise reset to top.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // With smooth scrolling on, jump through Lenis so it doesn't animate back.
    const lenis = lenisRef.current
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        if (lenis) lenis.scrollTo(el, { immediate: true, force: true, offset: -96 })
        else el.scrollIntoView({ block: "start" })
        return
      }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
