// DozLab flagship canvas. Sourced directly from DozLab's own public repos
// (github.com/DozLab/*) and checked against the running k3s cluster on
// 2026-10-02 (pod spec, Service, Ingress, CRD), not invented.
// codeLink points at the real repo for each piece.

import type { CanvasData } from "./types"

export const dozlabCanvas: CanvasData = {
  slug: "dozlab",
  title: "DozLab",
  summary:
    "I built DozLab after I tutored DevOps students. Too much lab time went to fixing each student's machine (Mac, Linux, Windows, different OS versions) so they could follow along. DozLab gives every student the same environment in the browser. It is a Kubernetes-native lab platform: a custom LabSession CRD and controller orchestrate multi-container pods (an isolation-grade Firecracker microVM, a WebSocket terminal sidecar, and a VS Code sidecar) per student session, created and deleted like any other Kubernetes resource.",
  proof: {
    capturedOn: "October 1, 2026",
    note: "The frontend is served from GitHub Pages and the backend runs on a single-node k3s cluster in my home lab. A home lab is not always on, so these screenshots are the lasting record.",
    liveUrl: "https://dozlab.github.io/dozlab-frontend/",
    shots: [
      {
        src: "/dozlab/my-vms.webp",
        alt: "DozLab My VMs page with a lab picker listing Linux VM and Kubernetes, and one Linux VM in the Running state",
        caption:
          "My VMs: choose a Linux VM or Kubernetes lab. One Linux VM is running, reserving 0.85 CPU and 1.9 GiB.",
        width: 1600,
        height: 856,
      },
      {
        src: "/dozlab/create-vm.webp",
        alt: "DozLab Create a VM form with a table of the CPU and memory reserved by the VM, the browser terminal and the browser editor",
        caption:
          "Before a VM is created, the form shows what it will take: the VM, the browser terminal and the browser editor, reserved and at most.",
        width: 1200,
        height: 1572,
      },
      {
        src: "/dozlab/terminal.webp",
        alt: "DozLab Linux VM page with the browser terminal connected, showing the Ubuntu 22.04.5 welcome message on kernel 6.1.155-dozlab and a root prompt on dozlab-vm",
        caption:
          "The browser terminal, connected: a root shell on Ubuntu 22.04 inside the VM, running the lab's own 6.1.155-dozlab kernel.",
        width: 1600,
        height: 996,
      },
    ],
  },
  diagrams: {
    note: "The deployment as it runs on one k3s node: how a browser tab reaches a lab, what happens between Start lab and a shell, and what isolates one session from the next.",
    figures: [
      {
        src: "/dozlab/architecture-overview.webp",
        alt: "Hand-drawn system overview: the browser and GitHub Pages outside the lab host; on the host, dozlab-api beside a k3s cluster with PostgreSQL, RabbitMQ, Traefik, the k3s API server and dozlab-controller, and a stack of lab sessions, each a LabSession owning a pod with code-server, a terminal sidecar and a Firecracker microVM; nine numbered steps trace a lab from the request to a shell",
        caption:
          "System overview: how one browser tab reaches a lab running inside a Firecracker microVM.",
        width: 3840,
        height: 2160,
      },
      {
        src: "/dozlab/architecture-lifecycle.webp",
        alt: "Hand-drawn sequence diagram of a lab session across the browser, GitHub Pages, dozlab-api, PostgreSQL, the k3s API server, dozlab-controller, RabbitMQ, Traefik, the lab pod and the Firecracker microVM, in seven stages from loading the UI to teardown, each labelled with the LabSession phase it moves through",
        caption:
          "Session lifecycle: from Start lab to a shell in a microVM, and back to nothing.",
        width: 3840,
        height: 2160,
      },
      {
        src: "/dozlab/architecture-session.webp",
        alt: "Hand-drawn diagram of one lab session, numbered from the outside in: the lab host, the LabSession and the objects it owns, the pod with its two init containers, code-server, terminal sidecar and volumes, and the unprivileged firecracker-vm container holding the microVM behind the KVM boundary; arrows show SSH coming in and guest traffic going out through two layers of NAT",
        caption:
          "Inside one lab session: the layers that isolate a user's lab, and how bytes get in and out.",
        width: 3840,
        height: 2160,
      },
    ],
  },
  lanes: ["Control plane", "Lab session pod"],
  nodes: [
    {
      id: "frontend",
      label: "Web frontend",
      sublabel: "Nuxt.js + Vue 3",
      col: 1,
      row: 1,
      connectsTo: ["api"],
      detail: {
        why: "Students need an in-browser lab with a live terminal and editor, so the UI needs real-time WebSocket access.",
        how: "Built with Nuxt.js 4, Vue 3, and TypeScript, styled with Nuxt UI and Tailwind, state managed with Pinia, and served as a static site from GitHub Pages. Talks to the API over REST; once a session is ready it opens the terminal and the editor in new tabs at that session's own URLs.",
        codeLink: "https://github.com/DozLab/dozlab-frontend",
      },
    },
    {
      id: "api",
      label: "DozLab API",
      sublabel: "Go, REST + WebSocket",
      col: 2,
      row: 1,
      connectsTo: ["controller"],
      detail: {
        why: "One service needs to own the product side end to end (auth, lab and session records, and asking Kubernetes for a session) rather than spreading that logic across the frontend.",
        how: "A Go service with JWT auth and role-based access. To start a lab it records the session and creates a LabSession resource through the Kubernetes API; it does not build pods itself, the controller does. Phase changes come back from the controller over RabbitMQ and are pushed to the user's open WebSocket connections.",
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
        why: "Lab lifecycle (deploy, track, clean up) needed to be a first-class Kubernetes concept, not just API-side bookkeeping, so it reconciles itself even if the API restarts.",
        how: "A Kubebuilder-based controller (Go, controller-runtime) that watches a custom LabSession CRD and reconciles it. For each session it creates an SSH key Secret, two volume claims, the pod, a Service and an Ingress, all owned by the LabSession, so deleting the LabSession cleans everything up. It runs as three replicas with leader election, and publishes each phase change (Pending, Creating, Running, Failed, Terminating) to RabbitMQ.",
        codeLink: "https://github.com/DozLab/dozlab-controller",
      },
    },
    {
      id: "init-container",
      label: "Init containers",
      sublabel: "root disk + network config",
      col: 1,
      row: 2,
      connectsTo: ["vm"],
      detail: {
        why: "The VM needs a root disk sized for this session, with this session's SSH key in it, and every container in the pod needs to agree on the VM's address. Both have to be settled before the other containers start.",
        how: "Two init containers run in order. The first writes the lab's ext4 root filesystem into a pod volume, grows it to the session's disk size, and writes a cloud-init seed with the session's SSH public key into it. The second writes the gateway, VM and pod addresses to a shared file, instead of relying on DNS for a VM that has no service record of its own.",
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
        why: "The lab workload needs VM isolation, so labs can safely do things (like running their own Kubernetes cluster) that would be unsafe or impossible while sharing a kernel with other tenants.",
        how: "Runs the lab as a Firecracker microVM inside a container that is not privileged: it adds three Linux capabilities (NET_ADMIN, SYS_ADMIN, SYS_RESOURCE) and gets /dev/kvm and /dev/net/tun from a device plugin as schedulable resources. A start script creates a tap device, NATs the VM's traffic out through the pod, and forwards the pod's IP to the VM. The VM boots from purpose-built images: a systemd-based Ubuntu 22.04 base, specialized into a full kubeadm/kubelet/containerd image for Kubernetes labs, or a minimal general-purpose image for others.",
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
        why: "Students need both a terminal and a code editor against the same VM, in the browser, without installing anything.",
        how: "The terminal sidecar (Go, Gin, gorilla/websocket) bridges a browser WebSocket to an SSH connection into the VM, with full PTY support, using the session's own SSH key. A separate VS Code sidecar (code-server) serves an editor with an auto-generated session password and a workspace volume. A per-session Ingress on Traefik routes /sessions/<id>/terminal and /sessions/<id>/vscode straight to them.",
        codeLink: "https://github.com/DozLab/dozlab-terminal-sidecar",
      },
    },
  ],
  sideNodes: [
    {
      id: "shared-volumes",
      label: "Session volumes",
      sublabel: "pod-local coordination",
      detail: {
        why: "Containers in the same pod need to agree on the VM's network identity and share filesystem access, without a database round trip for every lookup.",
        how: "Four volumes per session. Two are temporary: shared-config (the network file the init container wrote) and vm-kernels (the VM's root disk). Two are volume claims: vm-data (the editor's workspace) and vscode-data (the editor's own settings). Sessions are non-persistent today: the claims are owned by the session and go when it does.",
      },
    },
    {
      id: "data-layer",
      label: "PostgreSQL",
      sublabel: "StatefulSet, data on a volume claim",
      detail: {
        why: "Session state, lab definitions, and user data need to persist beyond a single pod's lifetime and survive a controller or API restart.",
        how: "PostgreSQL holds users, lab definitions, lab sessions, and lab results. It runs in the cluster as a StatefulSet with its data on a volume claim, so the data stays through pod restarts and redeploys, and no deploy or test script creates or removes it. The audit log is a database of its own, with one login that can only add entries and one that can only read them. Schema and migrations live in their own repo, separate from the services that use them.",
        codeLink: "https://github.com/DozLab/dozlab-schemas",
      },
    },
    {
      id: "event-bus",
      label: "RabbitMQ",
      sublabel: "session phase events",
      detail: {
        why: "The browser should hear that a lab is ready without the API polling Kubernetes or reaching into pods.",
        how: "The controller publishes each LabSession phase change to a durable topic exchange. The API consumes it, with retry and dead-letter queues, and pushes a session status message to that user's open WebSocket connections.",
        codeLink: "https://github.com/DozLab/dozlab-api",
      },
    },
    {
      id: "image-pipeline",
      label: "VM image pipeline",
      sublabel: "Firecracker tooling",
      detail: {
        why: "Every lab needs a purpose-built, bootable VM image, and building and distributing those by hand doesn't scale.",
        how: "dozctl, a bash CLI, automates pulling kernel/rootfs images, wiring up CNI networking, and managing a Firecracker VM's full lifecycle: create, stop, destroy. The rootfs manager repo builds the actual images on top of it: a common base, then specialized per lab type.",
        codeLink: "https://github.com/DozLab/dozctl",
      },
    },
  ],
}
