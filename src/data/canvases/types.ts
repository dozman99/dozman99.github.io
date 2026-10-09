export interface NodeDetail {
  why: string
  how: string
  /** What was hard, broke, or surprised — omitted (not fabricated) when there's no documented incident. */
  whatBroke?: string
  /** Link to real (sanitized, or the author's own public) code for this piece. Omitted = not published yet. */
  codeLink?: string
}

export interface CanvasNode {
  id: string
  label: string
  sublabel?: string
  col: number
  row: number
  /** ids of nodes this one flows into, drawn as connector lines/arrows. */
  connectsTo?: string[]
  detail: NodeDetail
}

/** Context nodes that exist alongside the main flow but aren't part of its sequence (no connector lines). */
export interface SideNode {
  id: string
  label: string
  sublabel?: string
  detail: NodeDetail
}

/** A static image (screenshot or diagram) served from public/. */
export interface Figure {
  /** Path under public/. */
  src: string
  /** Same image drawn for the dark theme. Omitted = `src` in both themes. */
  srcDark?: string
  alt: string
  caption: string
  width: number
  height: number
}

/** A self-contained HTML diagram (animated, with its own playback controls) shown in an iframe. */
export interface InteractiveFigure {
  kind: "interactive"
  /** Path under public/ of the light page. */
  src: string
  /** Path under public/ of the dark page. */
  srcDark: string
  /** Names the iframe for screen readers. */
  title: string
  caption: string
  /** The diagram's viewBox, used to size the frame before the page loads. */
  width: number
  height: number
}

/** Screenshots of the thing actually running, kept on this site so they outlast the live deployment. */
export interface LiveProof {
  /** Date the screenshots were taken, as shown on the page. */
  capturedOn: string
  note: string
  /** Public URL of the running UI. Omitted = nothing public to link to. */
  liveUrl?: string
  shots: Figure[]
}

export interface CanvasData {
  slug: string
  title: string
  summary: string
  /** Screenshots of it running, shown between the canvas and the full breakdown when present. */
  proof?: LiveProof
  /** Static architecture diagrams, shown after the screenshots when present. */
  diagrams?: { note: string; figures: (Figure | InteractiveFigure)[] }
  /** One story-level line about code availability, shown instead of per-node "coming soon" chips. */
  codeNote?: string
  /** Optional name for each grid row (index 0 = row 1), shown as a lane label above that row. */
  lanes?: string[]
  nodes: CanvasNode[]
  sideNodes: SideNode[]
  /** Optional "currently studying" / "writing" lists, shown below the canvas when present. */
  studying?: string[]
  writing?: string[]
}
