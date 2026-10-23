import { useEffect, useRef, useState } from "react"

// A statement that fills in word by word as it scrolls up the screen: words
// start grey and turn to full ink. Renders fully inked without JS and for
// anyone who prefers reduced motion.
export function FillText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ")
  const ref = useRef<HTMLParagraphElement>(null)
  const [lit, setLit] = useState(words.length)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the top of the text reaches 85% down the screen, 1 when its bottom reaches 45%.
      const start = vh * 0.85
      const end = vh * 0.45
      const progress = (start - rect.top) / (start - end + rect.height)
      setLit(Math.round(Math.min(Math.max(progress, 0), 1) * words.length))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [words.length])

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={i < lit ? "text-foreground transition-colors duration-300" : "text-foreground/25 transition-colors duration-300"}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  )
}
