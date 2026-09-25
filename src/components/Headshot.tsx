import { site } from "@/data/site"
import { cn } from "@/lib/utils"

export function Headshot({ className, width, height }: { className?: string; width: number; height: number }) {
  return (
    <img
      src="/chiedozie.webp"
      alt={site.name}
      width={width}
      height={height}
      className={cn("object-cover object-top", className)}
    />
  )
}
