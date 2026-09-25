import type { CanvasData } from "./types"
import { fbtCanvas } from "./fbt"
import { dozlabCanvas } from "./dozlab"
import { aiInferenceLabCanvas } from "./ai-inference-lab"
import { kafkaStranglerCanvas } from "./kafka-strangler"

export const canvases: Record<string, CanvasData> = {
  fbt: fbtCanvas,
  dozlab: dozlabCanvas,
  "ai-inference-lab": aiInferenceLabCanvas,
  "kafka-strangler": kafkaStranglerCanvas,
}

export type { CanvasData, CanvasNode, SideNode, NodeDetail } from "./types"
