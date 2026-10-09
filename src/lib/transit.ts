import type { CSSProperties } from "react"
import type { LineColor } from "@/data/transit"

/** Sets `--lc`, the line colour every line-coloured element in the subtree reads. */
export const lineStyle = (color: LineColor) => ({ "--lc": `var(--line-${color})` }) as CSSProperties
