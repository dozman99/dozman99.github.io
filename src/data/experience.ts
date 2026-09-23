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
      // NOTE: every number below is a plausible estimate the user asked me to fill in
      // (not a remembered fact), reasoned together for internal consistency and anchored
      // to "40+ clients" — the one number the user supplied himself. Sanity-check every
      // one against what actually happened before this goes public.
      "Owned end-to-end AWS infrastructure for 40+ healthcare and fintech clients as an outsourced platform engineer (ECS, EC2, ALB, Route 53, RDS, S3, CloudFormation, CodePipeline/CodeBuild), supporting 85+ production services across 4 environments.",
      "Standardized observability for 40+ clients by codifying dashboards, alerts, and data sources as Terraform modules, giving every new tenant consistent SLO monitoring from day one.",
      "Architected a Terraform-based Feature Branch Testing platform that spins up isolated, disposable per-branch AWS environments in about 12 minutes, increasing pre-merge testing from 6 to 24 runs/week and cutting integration defects reaching staging by 35%.",
      "Built a 5-stage promotion pipeline (local → FBT → dev → staging → prod) on reusable Terraform modules with full infrastructure parity and per-environment secrets, reducing new-environment setup from 3 days to 2 hours and eliminating config drift between stages.",
      "Led a strangler-style migration off a large monolith backed by Redis, standing up a Kafka topology and new microservices to peel responsibilities off it incrementally rather than in one cutover.",
      "Hardened regulated client infrastructure to CIS Benchmark standards across 19 AWS accounts: automated certificate rotation with zero expiry-related outages, consolidated firewall policy under AWS Firewall Manager, migrated CI to rootless Docker runners, and deployed encrypted SFTP for B2B data exchange with 7 partners.",
      "Drove ECS service decomposition in monolith-to-microservices migrations for 9 clients, implementing ALB path-based routing, blue/green and rolling deployments, and SLO-based observability, which reduced disaster recovery time by 40% while maintaining client SLOs.",
      "Resolved P1/P2 incidents in a 24/7 on-call rotation (PagerDuty, ServiceNow), meeting 95% of SLA response windows and reducing MTTR by 25% through runbooks and alert tuning.",
      "Automated an Azure VM image pipeline that ingests on-prem build artifacts, runs first-logon provisioning, and publishes versioned images to Azure Compute Gallery, cutting environment delivery for 8 teams from 4 hours to 15 minutes.",
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
