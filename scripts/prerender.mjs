// Runs after `vite build` (client) and `vite build --ssr` (server) to write
// real static HTML per route into dist/, so a plain fetch — crawlers, link
// previews, AI agents that don't execute JavaScript — sees actual content
// instead of an empty <div id="root">. See README.md's "Prerendering" section.
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL("..", import.meta.url))
const distDir = join(rootDir, "dist")

const { render, flagshipSlugs } = await import(
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

const template = await readFile(join(distDir, "index.html"), "utf-8")

for (const route of routes) {
  const appHtml = render(route)
  const pageHtml = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  )

  const outPath =
    route === "/"
      ? join(distDir, "index.html")
      : join(distDir, route.slice(1), "index.html")

  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, pageHtml)
  console.log(`prerendered ${route} -> ${outPath.replace(rootDir, "")}`)
}
