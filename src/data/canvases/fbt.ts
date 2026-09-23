// FBT (Feature Branch Testing) flagship canvas.
// Sanitized per docs/PLAN.md's checklist: no account ID, client name, internal
// hostnames/domains/buckets, or ticket prefixes. The client is "a healthcare
// client." The open/unauthenticated webhook detail is deliberately omitted
// per CLAUDE.md — not to be published even generically until confirmed fixed.
// No sample repo exists yet, so codeLink is left unset on every node here.

import type { CanvasData } from "./types"

export const fbtCanvas: CanvasData = {
  slug: "fbt",
  title: "Feature Branch Testing + Environment Replication",
  summary:
    "Every branch named fbt/<ticket> gets its own throwaway, fully isolated environment, built and torn down automatically off Bitbucket webhooks. Terraform owns the persistent shared layer; Lambda-rendered CloudFormation owns the disposable per-branch stacks, deliberately split so short-lived resources never touch shared Terraform state.",
  nodes: [
    {
      id: "webhook-filter",
      label: "Webhook filter",
      sublabel: "Bitbucket push → fbt/*",
      col: 1,
      row: 1,
      connectsTo: ["api-gateway"],
      detail: {
        why: "Only branches named fbt/<ticket> should spin up a full disposable environment. Most pushes shouldn't trigger anything at all.",
        how: "Bitbucket's push webhook hits the build Lambda's API handler, which confirms the push is a new fbt/ branch and extracts the Jira ticket ID with a regex before anything else happens.",
      },
    },
    {
      id: "api-gateway",
      label: "API Gateway",
      sublabel: "POST /webhook",
      col: 2,
      row: 1,
      connectsTo: ["sqs-fifo"],
      detail: {
        why: "A custom (non-proxy) integration in front of the Lambda, with the Lambda permission scoped so only this specific API deployment can invoke it.",
        how: "Two separate REGIONAL REST APIs (one for build, one for destroy), each with a single POST /webhook resource registered as the Bitbucket webhook target. Access logs go to a dedicated CloudWatch log group; throttling is set to 1000 req/s steady-state, 500 burst.",
      },
    },
    {
      id: "sqs-fifo",
      label: "SQS FIFO",
      sublabel: "dedup by ticket ID",
      col: 3,
      row: 1,
      connectsTo: ["build-lambda"],
      detail: {
        why: "Repeat pushes to the same branch must not race each other into creating duplicate clusters.",
        how: "The webhook handler drops a message on an SQS FIFO queue, grouped and deduplicated by ticket ID, before the build worker does anything.",
        whatBroke:
          "Getting dedup right for idempotent builds was the fiddly part: a developer pushing twice in quick succession, or a webhook retry, has to collapse into exactly one build, not two competing ones.",
      },
    },
    {
      id: "build-lambda",
      label: "Build Lambda + CloudFormation",
      sublabel: "per-branch DB + CFN",
      col: 1,
      row: 2,
      connectsTo: ["per-branch-ecs"],
      detail: {
        why: "Keep short-lived, per-branch resources out of shared Terraform state. Running terraform apply per branch would be slow and would put dozens of disposable resources into shared state: lock contention, drift, plan noise.",
        how: "The build worker checks whether a cluster already exists for the ticket, builds a per-branch database, then renders and applies an ECS + CodePipeline CloudFormation template for that branch. CloudFormation is used deliberately in exactly two places system-wide: here, and for one-time Terraform backend bootstrapping (see the side node below).",
      },
    },
    {
      id: "per-branch-ecs",
      label: "Per-branch ECS stack",
      sublabel: "+ CodePipeline",
      col: 2,
      row: 2,
      connectsTo: ["teardown"],
      detail: {
        why: "Full isolation per feature branch: its own ECS service and CodePipeline, running against the shared FBT database.",
        how: "The CloudFormation stack stands up a dedicated ECS service and pipeline scoped to that branch, so testing one feature can't collide with testing another.",
      },
    },
    {
      id: "teardown",
      label: "Merge-triggered teardown",
      sublabel: "PR merged → destroy",
      col: 3,
      row: 2,
      detail: {
        why: "Nobody should have to remember to delete branch infrastructure by hand.",
        how: "This isn't a continuation of the build pipeline above: it's a separate Bitbucket webhook that fires on PR-merged events for fbt/ branches, extracts the same ticket ID, and drops a message on its own SQS queue for the destroy Lambda, which tears down that branch's CloudFormation stack.",
      },
    },
  ],
  sideNodes: [
    {
      id: "shared-layer",
      label: "Shared layer",
      sublabel: "persistent infra",
      detail: {
        why: "FBT needs infrastructure that exists all the time, regardless of which feature branches are currently active, kept separate from the ephemeral per-branch stacks.",
        how: "FBT lives in its own AWS region and VPC inside the same account as staging, rather than a fully separate account. That reuses staging's IAM and billing boundary while keeping feature-branch churn off staging's own region and VPC. Terraform owns the shared Aurora Postgres cluster, networking, KMS keys, and secrets, all namespaced per environment.",
        whatBroke:
          "Isolating FBT into its own region, not just a separate VPC in the same region as staging, was the deliberate call: it keeps branch churn from ever touching staging's blast radius, at the cost of running an extra region.",
      },
    },
    {
      id: "backend-bootstrap",
      label: "Terraform backend bootstrap",
      sublabel: "one-time CFN stack",
      detail: {
        why: "Terraform can't manage the S3 bucket and DynamoDB lock table that hold its own state: that's a circular dependency.",
        how: "A one-time CloudFormation stack creates the versioned, KMS-encrypted, deletion-protected state bucket, the KMS key, and the lock table. The outputs get pasted into each backend.tf. This runs once per AWS account, not as part of the normal release flow.",
      },
    },
    {
      id: "db-reset",
      label: "DB reset from staging",
      sublabel: "realistic data, safely",
      detail: {
        why: "Feature branches need realistic, current data to test against, without ever touching real production data.",
        how: "A one-shot script pulls the latest encrypted staging backup, drops and recreates the shared FBT database, restores from the dump, truncates sensitive or noisy tables (API request logs, user identity data), and reindexes. It runs against the shared FBT cluster on a schedule, not per branch.",
      },
    },
  ],
}
