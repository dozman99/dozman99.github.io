// Motion, matched to the Lexington ProfolioX template's settings:
//   [data-split]    headings rise line by line (1.2 s, expo.out, 0.08 s apart)
//   [data-reveal]   photos wipe up from the bottom (1.4 s, expo.inOut) while the
//                   image settles from 1.2x to 1x (1.8 s, expo.out)
//   [data-parallax] wide photos drift -7% to 7% as they cross the screen
//   [data-preview]  a photo that follows the pointer over a list (hover devices only)
// plus Lenis smooth scrolling. Nothing runs for people who prefer reduced motion.
//
// index.html adds the `motion` class to <html> before paint, so split headings
// and reveal photos start hidden instead of flashing in and then animating.
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"
import { lenisRef } from "@/lib/lenisRef"

gsap.registerPlugin(ScrollTrigger, SplitText)

// Tells the fallback timer in index.html that the motion code arrived.
if (typeof window !== "undefined") {
  ;(window as Window & { __motionReady?: boolean }).__motionReady = true
}

const NO_PREFERENCE = "(prefers-reduced-motion: no-preference)"
const START = "top 88%"

/** Smooth scrolling for the whole site. Returns a cleanup. */
export function startSmoothScroll() {
  const mm = gsap.matchMedia()
  mm.add(NO_PREFERENCE, () => {
    const lenis = new Lenis({ anchors: true })
    lenisRef.current = lenis
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  })
  return () => mm.revert()
}

/** Wires up every animated element inside `root`. Returns a cleanup. */
export function animatePage(root: HTMLElement) {
  const mm = gsap.matchMedia()
  mm.add(NO_PREFERENCE, () => {
    let cancelled = false
    const splits: SplitText[] = []
    const pending = new Map<Element, () => void>()
    // Plays a heading once it's 12% above the bottom of the screen, or already scrolled past.
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return
          io.unobserve(entry.target)
          pending.get(entry.target)?.()
          pending.delete(entry.target)
        }),
      { rootMargin: "0px 0px -12% 0px" },
    )

    // Lines can only be measured once the real font is in.
    Promise.all([document.fonts.load("600 1em Switzer"), document.fonts.ready])
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return
        gsap.utils.toArray<HTMLElement>("[data-split]", root).forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines" })
          splits.push(split)
          // Room for descenders and accents inside each clipped line.
          gsap.set(split.masks, { paddingBottom: "0.22em", marginBottom: "-0.22em" })
          gsap.set(split.masks[0], { paddingTop: "0.15em", marginTop: "-0.15em" })
          gsap.set(split.lines, { yPercent: 150 })
          gsap.set(el, { opacity: 1 })
          const play = () =>
            gsap.to(split.lines, {
              yPercent: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.08,
              onComplete: () => split.revert(),
            })
          if (el.getBoundingClientRect().top < window.innerHeight * 0.88) play()
          else {
            io.observe(el)
            pending.set(el, play)
          }
        })
        ScrollTrigger.refresh()
      })

    gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
      const img = el.querySelector("img")
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: START, once: true } })
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          // Inline "none" outranks the stylesheet's starting clip.
          onComplete: () => {
            el.style.clipPath = "none"
          },
        },
      )
      if (img && !el.hasAttribute("data-parallax")) {
        tl.from(img, { scale: 1.2, duration: 1.8, ease: "expo.out", clearProps: "transform" }, 0.2)
      }
    })

    gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((el) => {
      const img = el.querySelector("img")
      if (!img) return
      gsap.fromTo(
        img,
        { yPercent: -7, scale: 1.16 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      )
    })

    const stopPreviews = initPreviews(root)
    window.addEventListener("load", refresh, { once: true })

    return () => {
      cancelled = true
      io.disconnect()
      splits.forEach((s) => s.revert())
      stopPreviews()
      window.removeEventListener("load", refresh)
    }
  })
  return () => mm.revert()
}

function refresh() {
  ScrollTrigger.refresh()
}

// A floating photo that follows the pointer over a list, showing the photo for
// the row underneath. Rows without a photo hide it.
function initPreviews(root: HTMLElement) {
  if (!window.matchMedia("(hover: hover)").matches) return () => {}
  const cleanups: (() => void)[] = []

  gsap.utils.toArray<HTMLElement>("[data-preview]", root).forEach((card) => {
    const list = root.querySelector<HTMLElement>(`[data-preview-list="${card.dataset.preview}"]`)
    if (!list) return
    const images = card.querySelectorAll<HTMLElement>("[data-preview-image]")
    const toX = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3" })
    const toY = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3" })
    let shown = false

    const hide = () => {
      if (!shown) return
      shown = false
      gsap.to(card, { opacity: 0, scale: 0.92, duration: 0.3, ease: "power3.out", overwrite: "auto" })
    }
    const onMove = (e: PointerEvent) => {
      const row = (e.target as Element).closest<HTMLElement>("[data-preview-index]")
      if (!row) return hide()
      images.forEach((img) => img.classList.toggle("opacity-0", img.dataset.previewImage !== row.dataset.previewIndex))
      const x = e.clientX + 24
      const y = e.clientY - card.offsetHeight / 2
      if (!shown) {
        shown = true
        gsap.set(card, { x, y })
        gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", overwrite: "auto" })
      } else {
        toX(x)
        toY(y)
      }
    }

    list.addEventListener("pointermove", onMove)
    list.addEventListener("pointerleave", hide)
    window.addEventListener("scroll", hide, { passive: true })
    window.addEventListener("blur", hide)
    cleanups.push(() => {
      list.removeEventListener("pointermove", onMove)
      list.removeEventListener("pointerleave", hide)
      window.removeEventListener("scroll", hide)
      window.removeEventListener("blur", hide)
    })
  })

  return () => cleanups.forEach((fn) => fn())
}
