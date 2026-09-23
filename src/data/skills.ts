// docs/PLAN.md calls for skills labeled honestly by depth (production vs lab),
// not just a flat list. Per CLAUDE.md's rule not to invent experience, I'm not
// guessing which of these were production-grade vs. research/exploratory —
// only you know that. Fill in `level` for each: "production" | "lab" | undefined
// (undefined renders unlabeled, which is fine for now).

export type SkillLevel = "production" | "lab"

export interface Skill {
  name: string
  level?: SkillLevel // TODO: fill in — production (shipped/run for real) vs lab (research/exploratory)
}

export interface SkillGroup {
  label: string
  items: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "Go" },
      { name: "Python" },
      { name: "Bash" },
      { name: "PowerShell" },
      { name: "JavaScript" },
      { name: "TypeScript" },
    ],
  },
  {
    label: "Containers & Virtualization",
    items: [{ name: "Docker" }, { name: "Kubernetes" }, { name: "Firecracker" }],
  },
  {
    label: "IaC & CI/CD",
    items: [
      { name: "Terraform" },
      { name: "Pulumi" },
      { name: "Terragrunt" },
      { name: "Spacelift" },
      { name: "Azure DevOps" },
      { name: "GitHub Actions" },
      { name: "CircleCI" },
      { name: "Helm" },
    ],
  },
  {
    label: "Messaging & Data",
    items: [{ name: "Kafka" }, { name: "Redis" }],
  },
  {
    label: "Monitoring & ITSM",
    items: [
      { name: "Prometheus" },
      { name: "ELK Stack" },
      { name: "Datadog" },
      { name: "Fluent Bit" },
      { name: "Jira" },
      { name: "ServiceNow" },
      { name: "PagerDuty" },
    ],
  },
  {
    label: "AI/ML & Web",
    items: [
      { name: "Kubeflow" },
      { name: "MLflow" },
      { name: "Azure Databricks" },
      { name: "LangChain" },
      { name: "YOLOv8" },
      { name: "LaneNet" },
      { name: "Nginx" },
    ],
  },
]
