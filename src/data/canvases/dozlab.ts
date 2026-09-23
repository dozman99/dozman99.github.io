// DozLab flagship canvas. Sourced directly from DozLab's own public repos
// (github.com/DozLab/*) via `gh api` — READMEs and CRD specs, not invented.
// codeLink points at the real repo for each piece.

import type { CanvasData } from "./types"

export const dozlabCanvas: CanvasData = {
  slug: "dozlab",
  title: "DozLab",
  summary:
    "A Kubernetes-native lab platform, not just something running on Kubernetes: a custom LabSession CRD and controller orchestrate multi-container pods (an isolation-grade Firecracker microVM, a WebSocket terminal sidecar, and a VS Code sidecar) per student session, built and torn down like any other Kubernetes resource.",
  nodes: [
    {
      id: "frontend",
      label: "Web frontend",
      sublabel: "Nuxt.js + Vue 3",
      col: 1,
      row: 1,
      connectsTo: ["api"],
      detail: {
        why: "Students need a real, in-browser lab experience with a live terminal and editor, not a description of one — so the UI needed real-time WebSocket access, not just static pages.",
        how: "Built with Nuxt.js 4, Vue 3, and TypeScript, styled with Nuxt UI and Tailwind, state managed with Pinia. Talks to the API over REST and opens a direct WebSocket connection for the terminal.",
        codeLink: "https://github.com/DozLab/dozlab-frontend",
      },
    },
    {
      id: "api",
      label: "DozLab API",
      sublabel: "Go, K8s orchestrator",
      col: 2,
      row: 1,
      connectsTo: ["controller"],
      detail: {
        why: "One service needs to own lab orchestration end to end — auth, talking to Kubernetes, and routing WebSocket traffic to the right sidecar — rather than spreading that logic across the frontend.",
        how: "A Go service that authenticates with JWTs, creates multi-container lab pods directly through the Kubernetes API, and proxies terminal WebSocket connections to the correct sidecar container for a session.",
        codeLink: "https://github.com/DozLab/dozlab-api",
      },
    },
    {
      id: "controller",
      label: "Dozlab Controller",
      sublabel: "K8s operator, LabSession CRD",
      col: 3,
      row: 1,
      connectsTo: ["init-container"],
      detail: {
        why: "Lab lifecycle — deploy, track, clean up — needed to be a first-class Kubernetes concept, not just API-side bookkeeping, so it reconciles itself even if the API restarts.",
        how: "A Kubebuilder-based controller (Go, controller-runtime) that watches a custom LabSession CRD and reconciles it: creating the pods, services, and volumes for a session, and tearing them down when it ends. Each LabSession spec pins its own resource requests/limits and networking ports.",
        codeLink: "https://github.com/DozLab/dozlab-controller",
      },
    },
    {
      id: "init-container",
      label: "Init container",
      sublabel: "IP calculation",
      col: 1,
      row: 2,
      connectsTo: ["vm"],
      detail: {
        why: "The VM inside the pod needs a real, routable IP before anything else can talk to it — and that has to be settled before the other sidecars start.",
        how: "A lightweight init container calculates the VM's IP from the pod's IP and writes it to a shared volume the other containers read from, instead of relying on DNS for a VM that has no service record of its own.",
      },
    },
    {
      id: "vm",
      label: "Main VM container",
      sublabel: "Firecracker microVM",
      col: 2,
      row: 2,
      connectsTo: ["sidecars"],
      detail: {
        why: "The actual lab workload needs real VM isolation, not just another container, so labs can safely do things (like running their own Kubernetes cluster) that would be unsafe or impossible while sharing a kernel with other tenants.",
        how: "Runs the lab as a Firecracker microVM inside a privileged container, booted from purpose-built images: a systemd-based Ubuntu 22.04 base, specialized into a full kubeadm/kubelet/containerd image for Kubernetes labs, or a minimal general-purpose image for others.",
        codeLink: "https://github.com/DozLab/dozlab-rootfs-manager",
      },
    },
    {
      id: "sidecars",
      label: "Terminal + VS Code sidecars",
      sublabel: "browser access to the VM",
      col: 3,
      row: 2,
      detail: {
        why: "Students need both a real terminal and a real code editor against the same VM, in the browser, without installing anything.",
        how: "The terminal sidecar (Go, Gin, gorilla/websocket) bridges a browser WebSocket to an SSH connection into the VM, with full PTY support. A separate VS Code sidecar (code-server) gets direct access to the VM's filesystem with an auto-generated session password. Both discover the VM's IP from the same shared network-config file the init container wrote.",
        codeLink: "https://github.com/DozLab/dozlab-terminal-sidecar",
      },
    },
  ],
  sideNodes: [
    {
      id: "shared-volumes",
      label: "Shared volumes",
      sublabel: "pod-local coordination",
      detail: {
        why: "Containers in the same pod need to agree on the VM's network identity and share filesystem access, without a database round trip for every lookup.",
        how: "Three shared volumes per session: network-config (IP coordination between the init container and both sidecars), vm-data (VM filesystem access for VS Code), and workspace (persistent user files).",
      },
    },
    {
      id: "data-layer",
      label: "PostgreSQL + Redis",
      sublabel: "sessions, labs, users",
      detail: {
        why: "Session state, lab definitions, and user data need to persist beyond a single pod's lifetime and survive a controller or API restart.",
        how: "PostgreSQL holds users, lab definitions, lab sessions, and lab results; Redis backs faster-moving session state. Schema and migrations live in their own repo, separate from the services that use them.",
        codeLink: "https://github.com/DozLab/dozlab-schemas",
      },
    },
    {
      id: "image-pipeline",
      label: "VM image pipeline",
      sublabel: "Firecracker tooling",
      detail: {
        why: "Every lab needs a purpose-built, bootable VM image, and building and distributing those by hand doesn't scale.",
        how: "dozctl, a bash CLI, automates pulling kernel/rootfs images, wiring up CNI networking, and managing a Firecracker VM's full lifecycle — create, stop, destroy. The rootfs manager repo builds the actual images on top of it: a common base, then specialized per lab type.",
        codeLink: "https://github.com/DozLab/dozctl",
      },
    },
  ],
}
