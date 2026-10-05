// AI Inference Infrastructure Lab — a live, in-progress side project, not
// client work, so no sanitization concerns. None of the five sub-project
// repos (inference-bench, gpu-serving-platform, prefill-vs-decode,
// soci-lazy-images, gpu-idle-controller) exist publicly yet (checked via
// `gh api` — all 404), so every codeLink is left unset until they're pushed.

import type { CanvasData } from "./types"

export const aiInferenceLabCanvas: CanvasData = {
  slug: "ai-inference-lab",
  title: "AI Inference Infrastructure Lab",
  summary:
    "Open-weight models deployed across multiple serving engines, with GPUs shared two different ways on the same cluster. I measure latency and cost per request for each model. Extending DevOps/Kubernetes work into GPU orchestration and LLM serving.",
  codeNote: "The five sub-project repos aren't public yet. Links will appear on each node once they are.",
  lanes: ["Serving path", "Observability"],
  nodes: [
    {
      id: "load-gen",
      label: "Load generator + API gateway",
      sublabel: "Go",
      col: 1,
      row: 1,
      connectsTo: ["engines"],
      detail: {
        why: "Needed a single entry point in front of multiple serving engines, and a way to generate realistic, repeatable load to measure them with.",
        how: "A Go service fronts the serving engines and doubles as the load generator for benchmarking: the same client sends inference requests and records latency, throughput, and errors.",
      },
    },
    {
      id: "engines",
      label: "Serving engines",
      sublabel: "vLLM · SGLang · Ollama/GGUF",
      col: 2,
      row: 1,
      connectsTo: ["gpu-node"],
      detail: {
        why: "Which engine is fastest depends on model, hardware, and quantization: so the only way to know is to measure.",
        how: "The same open-weight model is deployed across vLLM, SGLang, and Ollama (GGUF), so requests can be benchmarked apples-to-apples across BF16, FP8, and INT4/GGUF quantization.",
      },
    },
    {
      id: "gpu-node",
      label: "GPU node",
      sublabel: "MIG / time slicing",
      col: 3,
      row: 1,
      connectsTo: ["gpu-operator"],
      detail: {
        why: "A GPU can't be sliced with Kubernetes requests/limits the way CPU and memory can. Sharing it between workloads has to come from the GPU hardware itself.",
        how: "The cluster is configured for both MIG (hardware-partitioned, isolated slices, on H100-class GPUs) and time slicing (interleaved, no isolation), so the tradeoffs can be measured directly.",
      },
    },
    {
      id: "gpu-operator",
      label: "GPU Operator + DCGM exporter",
      col: 1,
      row: 2,
      connectsTo: ["metrics"],
      detail: {
        why: "GPU utilization and health need to be visible at the node level, alongside application-side latency numbers.",
        how: "The NVIDIA GPU Operator manages drivers and device plugins across the cluster; the DCGM exporter surfaces per-GPU utilization, memory, and idle time as Prometheus metrics.",
      },
    },
    {
      id: "metrics",
      label: "Metrics",
      sublabel: "Prometheus + Grafana",
      col: 2,
      row: 2,
      detail: {
        why: "The metrics that matter for inference are time to first token, tokens/sec, KV cache usage, idle GPU time, and cost per million tokens.",
        how: "Prometheus scrapes the load generator, the serving engines, and the DCGM exporter; Grafana turns that into dashboards for TTFT, throughput, KV cache usage, idle-GPU time, and $/1M tokens.",
      },
    },
  ],
  sideNodes: [
    {
      id: "idle-controller",
      label: "Idle-GPU controller",
      sublabel: "Go, gpu-idle-controller",
      detail: {
        why: "GPUs cost the same whether they're busy or not, so idle GPU time is a direct cost.",
        how: "A Kubernetes controller written in Go that watches GPU pods, detects when they're sitting idle, and reports the wasted GPU-hours and their dollar cost.",
      },
    },
    {
      id: "soci-images",
      label: "SOCI lazy image loading",
      sublabel: "soci-lazy-images",
      detail: {
        why: "CUDA/PyTorch images are huge (multiple GB, heavy C++ dependencies), and pulling the whole thing before a pod can start wastes time on every deploy and every scale-up.",
        how: "Converts a large CUDA/PyTorch image to SOCI (lazy-loaded OCI) format and measures pod startup time before and after, applying lazy image loading to GPU workloads specifically.",
      },
    },
  ],
  studying: [
    "Inference engineering: prefill vs. decode, KV cache, model runtimes, GPU hardware",
    "GPU memory hierarchy (HBM/VRAM, L1/L2) and how it limits serving throughput",
    "Quantization trade-offs: GGUF, AWQ/GPTQ, FP8, BF16",
  ],
  writing: [
    "Benchmarking vLLM vs. SGLang vs. Ollama on one GPU (coming soon)",
    "MIG vs. time slicing: sharing GPUs on Kubernetes (coming soon)",
  ],
}
