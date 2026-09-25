import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react"

// Brand marks from Tabler (Lucide dropped brand icons, and simple-icons no
// longer ships LinkedIn). Same 24px / 2px-stroke outline style as Lucide.
export function GitHubIcon({ className }: { className?: string }) {
  return <IconBrandGithub className={className} stroke={2} aria-hidden="true" />
}

export function LinkedInIcon({ className }: { className?: string }) {
  return <IconBrandLinkedin className={className} stroke={2} aria-hidden="true" />
}
