import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Plain <Routes> (not a data router) gives no scroll restoration for free:
 * scroll to a hash target on navigation, otherwise reset to top.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ block: "start" })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
