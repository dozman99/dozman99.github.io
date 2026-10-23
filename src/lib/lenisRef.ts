import type Lenis from "lenis"

// The running smooth scroller, if any. Kept apart from motion.ts so code that
// only needs to scroll doesn't pull the animation libraries into the main bundle.
export const lenisRef: { current: Lenis | null } = { current: null }
