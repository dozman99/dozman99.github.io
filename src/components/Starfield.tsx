import { useEffect, useRef } from "react"

// Roughly one star per this many CSS pixels of viewport.
const AREA_PER_STAR = 6000
// Share of stars drawn in the warm accent instead of the foreground tone.
const WARM_SHARE = 0.15

// Seeded so the sky doesn't reshuffle on every resize or theme switch.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Resolves a theme token (oklch) to something canvas accepts.
function resolveColor(probe: HTMLElement, token: string) {
  probe.style.color = `var(${token})`
  return getComputedStyle(probe).color
}

/** Static starfield drawn behind the whole site, recoloured with the theme. */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const base = resolveColor(canvas, "--foreground")
      const warm = resolveColor(canvas, "--chart-3")
      const rand = mulberry32(99)
      const count = Math.round((w * h) / AREA_PER_STAR)

      for (let i = 0; i < count; i++) {
        const x = rand() * w
        const y = rand() * h
        const big = rand() < 0.08
        const r = big ? 1.6 + rand() * 1 : 0.7 + rand() * 0.9
        ctx.fillStyle = rand() < WARM_SHARE ? warm : base
        ctx.globalAlpha = big ? 0.5 + rand() * 0.25 : 0.3 + rand() * 0.35
        if (big) {
          ctx.shadowColor = ctx.fillStyle
          ctx.shadowBlur = 6
        } else {
          ctx.shadowBlur = 0
        }
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    draw()
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }
    window.addEventListener("resize", onResize)
    // ThemeToggle flips the .dark class on <html>; redraw in the new palette.
    const themeObserver = new MutationObserver(draw)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  )
}
