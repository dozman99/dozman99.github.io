import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom"
import App from "@/App"
import { flagships } from "@/data/flagships"

// So scripts/prerender.mjs can derive the full route list without duplicating it.
export const flagshipSlugs = flagships.map((f) => f.slug)

// Used only at build time (see scripts/prerender.mjs) to render each route to
// a real HTML string, so a plain fetch (crawlers, AI agents, link previews)
// sees actual content instead of an empty <div id="root">. The client bundle
// still mounts normally afterward — this isn't hydration, just a same-content
// swap, which is fine since nothing here depends on server-only data.
export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
