import type { CanvasData } from "./types"
import { fbtCanvas } from "./fbt"
import { dozlabCanvas } from "./dozlab"

export const canvases: Record<string, CanvasData> = {
  fbt: fbtCanvas,
  dozlab: dozlabCanvas,
}

export type { CanvasData, CanvasNode, SideNode, NodeDetail } from "./types"
