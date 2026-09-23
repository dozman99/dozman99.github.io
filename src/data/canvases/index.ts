import type { CanvasData } from "./types"
import { fbtCanvas } from "./fbt"
import { dozlabCanvas } from "./dozlab"
import { aiInferenceLabCanvas } from "./ai-inference-lab"

export const canvases: Record<string, CanvasData> = {
  fbt: fbtCanvas,
  dozlab: dozlabCanvas,
  "ai-inference-lab": aiInferenceLabCanvas,
}

export type { CanvasData, CanvasNode, SideNode, NodeDetail } from "./types"
