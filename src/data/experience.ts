// Full experience timeline. Richer than the resume bullets — resume stays the condensed version.
// Content only; presentation lives in src/pages/Experience.tsx.

export interface Role {
  company: string
  role: string
  location: string
  dates: string
  blurb: string
  bullets: string[]
  /** Slug into flagships.ts, if this role has a full interactive deep dive. */
  flagshipSlug?: string
}

export const workExperience: Role[] = [
  {
    company: "Samsung Austin Semiconductor",
    role: "AI/ML Engineer Co-op",
    location: "Austin, TX, USA",
    dates: "Jan 2026 – Aug 2026",
    blurb:
      "Built and shipped a full-stack ban/alerting portal into a secured, air-gapped environment, plus the AI feature that makes it self-service.",
    bullets: [
      "Built an AI-driven opt-out detection feature that interprets free-form employee replies to incident alerts and automatically updates ban records, paired with alert-suppression and rate-limiting logic that reduced non-actionable incident alerts.",
      "Designed and built a full-stack ban/alerting portal (React, TypeScript, FastAPI, PostgreSQL) with SAML/SSO for the onsite workforce.",
      "Built a custom PowerShell CI/CD pipeline to deploy the portal into a secured, air-gapped environment, replacing a fully manual process with self-service access and full audit logging.",
    ],
    flagshipSlug: "air-gapped-portal",
  },
  {
    company: "Texas A&M University",
    role: "Graduate Research Assistant",
    location: "Texas, USA",
    dates: "Apr 2025 – Dec 2025",
    blurb:
      "Research spanning machine unlearning, PKI/blockchain for CA decentralization, and a Jetson-based autonomous vehicle proof of concept.",
    bullets: [
      "Conducted research and implemented solutions in machine unlearning, focusing on security, privacy, and broader AI applications.",
      "Researched PKI and blockchain solutions to decentralize Certificate Authorities, improving security and high availability.",
      "Developed a proof-of-concept autonomous vehicle integrating RGB-LiDAR, Intel RealSense depth camera, GPS, and IMU on NVIDIA Jetson (Orin/Xavier); deployed YOLOv8 and LaneNet for real-time navigation.",
    ],
    flagshipSlug: "research",
  },
  {
    company: "Conclase",
    role: "DevOps Engineer",
    location: "Colorado, USA",
    dates: "Aug 2022 – Jan 2025",
    blurb:
      "Outsourced infrastructure engineer for healthcare and fintech clients: owned AWS infra end-to-end, built a feature-branch testing platform, and led a strangler migration off a monolith.",
    bullets: [
      "Served as outsourced infrastructure engineer across healthcare and fintech client partnerships, owning end-to-end AWS infrastructure including ECS, EC2, CloudFormation, ALB, Route 53, S3, RDS, and CodePipeline/CodeBuild across multiple client environments.",
      "Standardized observability for 40+ clients by codifying dashboards, alerts, and data sources as Terraform modules, giving every new tenant consistent SLO monitoring from day one.",
      "Architected a Feature Branch Testing (FBT) system where Terraform owns persistent shared infrastructure and Lambda-rendered CloudFormation spins up fully isolated, disposable per-branch environments, enabling developers to test far more frequently and reducing integration risk across client projects.",
      "Built a full environment replication pipeline (local → FBT → Dev → Staging → Prod) with full infrastructure parity, automated stage promotion, reusable Terraform modules, and per-environment secrets and config management.",
      "Led a strangler-style migration off a large monolith backed by Redis, standing up a Kafka topology and new microservices to peel responsibilities off it incrementally rather than in one cutover.",
      "Hardened client infrastructure via CIS Benchmark adoption, automated certificate regeneration, AWS Firewall Manager consolidation, and rootless Docker runners; deployed a secure SFTP server enabling encrypted B2B data exchange in regulated environments.",
      "Participated in 24/7 on-call rotation with defined SLA response windows, managing P1/P2 incidents via ServiceNow and PagerDuty across healthcare and fintech client infrastructure.",
      "Managed ECS service decomposition, ALB routing, blue/green and rolling deployments, and observability frameworks during monolith-to-microservices migrations, maintaining client SLOs and reducing disaster recovery time by 40% across full lifecycle stages.",
      "Automated an Azure VM image pipeline that ingested on-premises build artifacts, triggered first-logon software provisioning scripts, and published versioned images to Azure Shared Image Gallery, giving internal teams ready-to-use environments instantly and eliminating manual copy overhead.",
    ],
    flagshipSlug: "fbt",
  },
  {
    company: "Gwrite",
    role: "DevOps Engineer",
    location: "Port Harcourt, Nigeria",
    dates: "Jan 2021 – Jun 2022",
    blurb: "Secrets management, a major cloud migration, and standing up Kubernetes CI/CD from scratch.",
    bullets: [
      "Implemented HashiCorp Vault for Kubernetes secrets management and led SAP migration to Azure, achieving 70% RTO reduction.",
      "Architected secure containerization using Docker and CVSS tooling; transformed CI/CD processes with Tekton pipelines on Kubernetes.",
      "Pioneered AKS cluster setup following best practices and designed cost-optimized AWS infrastructure leveraging EC2, S3, RDS, and networking services.",
    ],
  },
  {
    company: "Parkway Projects Africa",
    role: "Implementation / Software Engineer (Intern)",
    location: "Lagos, Nigeria",
    dates: "Sep 2019 – Oct 2021",
    blurb: "First engineering role: serverless integrations, an internal asset-management app, and network security.",
    bullets: [
      "Developed serverless solutions on Azure/AWS with API and webhook integrations; managed cloud software incidents via ServiceNow.",
      "Built a Django-based IT asset management application with real-time tracking; led network security implementation including VPN and ExpressRoute configurations.",
    ],
  },
]

export const leadership: Role[] = [
  {
    company: "EDAT – VA (Independent Sustainability Assurance)",
    role: "VP of Engineering (Volunteer)",
    location: "USA (Remote)",
    dates: "Apr 2025 – Present",
    blurb:
      "Leading engineering for a sustainability-assurance platform, and architecting its GHG accounting product end to end.",
    bullets: [
      "Lead engineering team structure, recruitment, and technical direction for a sustainability assurance platform specializing in ESG verification, GHG validation, and voluntary carbon market auditing.",
      "Architected and built ECO-T, a full-stack GHG accounting platform covering Scope 1/2/3 emissions, API integrations with EPA, ERP systems, and energy grids, carbon pricing & offsets, and Sankey diagram production.",
      "Designed AI/ML pipelines for automated ESG verification and carbon disclosure across GRI, TCFD, CSRD, ISO 14064, VCS, and Gold Standard frameworks.",
      "Built backend APIs and DevOps/cloud infrastructure supporting GHG reporting automation, voluntary carbon market assurance, and third-party audit workflows.",
    ],
  },
  {
    company: "National Society of Black Engineers, Texas A&M",
    role: "Vice President",
    location: "Texas, USA",
    dates: "Jan 2025 – Present",
    blurb: "",
    bullets: [
      "Facilitate career development and cross-disciplinary collaboration through targeted projects that expand members' competitive edge and professional opportunities.",
    ],
  },
  {
    company: "Microsoft",
    role: "Student Ambassador",
    location: "DC, USA",
    dates: "Jan 2018 – Nov 2021",
    blurb: "",
    bullets: [
      "Mentored students in software development; developed school data analytics tools with Azure integration and organized community tech events.",
    ],
  },
]
