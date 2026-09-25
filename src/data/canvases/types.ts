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

export interface CanvasData {
  slug: string
  title: string
  summary: string
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
