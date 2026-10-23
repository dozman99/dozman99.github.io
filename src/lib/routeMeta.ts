import { flagships } from "@/data/flagships"
import { canvases } from "@/data/canvases"
import { site } from "@/data/site"

const SITE_SUFFIX = ` · ${site.name}`
const SITE_HOST = "dozman99.github.io"

// Per-route <title>/description, so prerendered pages aren't all identical to
// crawlers and search engines. scripts/prerender.mjs swaps these into the
// template for each route it writes; Layout also sets document.title from
// them on client-side navigation.
// `image` is the link-preview card in public/og/ (see design/og/render.py):
// a story uses its own card, every other page the home card.
// `shareTitle`/`shareDescription` are the text chat apps show under the card.
// On the home page the card already shows the role and intro, so the text
// under it is just the name and the address.
export function getRouteMeta(url: string): {
  title: string
  description: string
  shareTitle: string
  shareDescription: string
  image: string
  imageAlt: string
} {
  const meta = routeText(url)
  const path = url.split("?")[0]
  const share =
    path === "/"
      ? { shareTitle: site.name, shareDescription: SITE_HOST }
      : { shareTitle: meta.title, shareDescription: meta.description }
  const slug = path.match(/^\/flagships\/([^/]+)/)?.[1]
  const flagship = slug ? flagships.find((f) => f.slug === slug) : undefined
  return flagship
    ? { ...meta, ...share, image: `/og/${flagship.slug}.jpg`, imageAlt: `${flagship.title}, by ${site.name}` }
    : { ...meta, ...share, image: "/og/home.jpg", imageAlt: `${site.name}, ${site.role}` }
}

function routeText(url: string): { title: string; description: string } {
  const path = url.split("?")[0]

  if (path === "/") {
    return { title: `${site.name} · ${site.role}`, description: site.tagline }
  }
  if (path === "/about") {
    return {
      title: `About${SITE_SUFFIX}`,
      description: "How I work, and why: the approach behind the systems, and what I want next.",
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
      description: "Systems I've designed and run, with interactive architecture maps: pick any part to see why it exists and how it works.",
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
