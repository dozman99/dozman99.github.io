// Runs after `vite build` (client) and `vite build --ssr` (server) to write
// real static HTML per route into dist/, so a plain fetch — crawlers, link
// previews, AI agents that don't execute JavaScript — sees actual content
// instead of an empty <div id="root">. See README.md's "Prerendering" section.
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL("..", import.meta.url))
const distDir = join(rootDir, "dist")
const siteOrigin = "https://dozman99.github.io"

const { render, flagshipSlugs, getRouteMeta } = await import(
  join(rootDir, "dist-server", "entry-server.js")
)

const routes = [
  "/",
  "/about",
  "/flagships",
  "/experience",
  "/projects",
  "/now-next",
  ...flagshipSlugs.map((slug) => `/flagships/${slug}`),
]

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const template = await readFile(join(distDir, "index.html"), "utf-8")
const sitemapUrls = []

for (const route of routes) {
  const appHtml = render(route)
  const { title, description } = getRouteMeta(route)

  let pageHtml = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  )
  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/s,
    `<title>${escapeHtml(title)}</title>`,
  )
  pageHtml = pageHtml.replace(
    /(<meta\s+name="description"[\s\S]*?content=")[^"]*(")/,
    `$1${escapeHtml(description)}$2`,
  )

  const outPath =
    route === "/"
      ? join(distDir, "index.html")
      : join(distDir, route.slice(1), "index.html")

  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, pageHtml)
  console.log(`prerendered ${route} -> ${outPath.replace(rootDir, "")}`)

  sitemapUrls.push(`${siteOrigin}${route === "/" ? "/" : route + "/"}`)
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`
await writeFile(join(distDir, "sitemap.xml"), sitemap)
console.log(`wrote sitemap.xml with ${sitemapUrls.length} URLs`)
