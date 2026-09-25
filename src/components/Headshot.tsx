import { site } from "@/data/site"
import { cn } from "@/lib/utils"

/**
 * The photo's saturated blue backdrop fought the palette, so it's rendered
 * through an olive duotone (deep olive → army green → cream), defined once by
 * <DuotoneFilter /> in Layout. Hover shows the original.
 */
export function Headshot({ className, width, height }: { className?: string; width: number; height: number }) {
  return (
    <img
      src="/chiedozie.webp"
      alt={site.name}
      width={width}
      height={height}
      className={cn(
        "object-cover object-top [filter:url(#duotone-olive)] transition-[filter] duration-500 hover:[filter:none]",
        className,
      )}
    />
  )
}

export function DuotoneFilter() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute size-0">
      <filter id="duotone-olive" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.125 0.31 0.965" />
          <feFuncG type="table" tableValues="0.141 0.353 0.945" />
          <feFuncB type="table" tableValues="0.078 0.169 0.89" />
        </feComponentTransfer>
      </filter>
    </svg>
  )
}
