import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom"
import App from "@/App"
import { flagships } from "@/data/flagships"
import { canvases } from "@/data/canvases"
import { site } from "@/data/site"

// So scripts/prerender.mjs can derive the full route list without duplicating it.
export const flagshipSlugs = flagships.map((f) => f.slug)

const SITE_SUFFIX = ` · ${site.name}`

// Per-route <title>/description, so prerendered pages aren't all identical to
// crawlers and search engines — scripts/prerender.mjs swaps these into the
// template for each route it writes.
export function getRouteMeta(url: string): { title: string; description: string } {
  const path = url.split("?")[0]

  if (path === "/") {
    return { title: `${site.name} · ${site.role}`, description: site.tagline }
  }
  if (path === "/about") {
    return {
      title: `About${SITE_SUFFIX}`,
      description: "Who I am outside the bullet points, and the long-term dream behind the work.",
    }
  }
  if (path === "/flagships") {
    return {
      title: `Flagship Stories${SITE_SUFFIX}`,
      description:
        "Interactive architecture deep dives: click a node, get the why, the how, and what was hard.",
    }
  }
  if (path === "/experience") {
    return {
      title: `Experience${SITE_SUFFIX}`,
      description: "Full work and leadership timeline, with more depth than the resume.",
    }
  }
  if (path === "/projects") {
    return {
      title: `Projects${SITE_SUFFIX}`,
      description: "Things built outside client work: DozLab, ECO-T, Sherloc, and ML infrastructure.",
    }
  }
  if (path === "/now-next") {
    return {
      title: `Now / Next${SITE_SUFFIX}`,
      description: "What I'm doing now, and where I'm headed next.",
    }
  }

  const flagshipMatch = path.match(/^\/flagships\/([^/]+)/)
  if (flagshipMatch) {
    const slug = flagshipMatch[1]
    const flagship = flagships.find((f) => f.slug === slug)
    const canvas = canvases[slug]
    if (flagship) {
      return {
        title: `${flagship.title}${SITE_SUFFIX}`,
        description: canvas?.summary ?? flagship.teaser,
      }
    }
  }

  return { title: `${site.name} · ${site.role}`, description: site.tagline }
}

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
