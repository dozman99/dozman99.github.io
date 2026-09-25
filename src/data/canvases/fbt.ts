// FBT (Feature Branch Testing) flagship canvas.
// Sanitized per docs/PLAN.md's checklist: no account ID, client name, internal
// hostnames/domains/buckets, or ticket prefixes. The client is "a healthcare
// client." The open/unauthenticated webhook detail is deliberately omitted
// per CLAUDE.md — not to be published even generically until confirmed fixed.
// "What broke" content comes from docs/sanitized/fbt-pipeline-investigation.md.
// Its fixes beyond the manual recovery (early-return removal, Step Functions,
// Aurora cloning, template shrink) were a plan, not confirmed as shipped, so
// they're described as the fix plan here.
// No sample repo exists yet, so codeLink is left unset on every node here.

import type { CanvasData } from "./types"

export const fbtCanvas: CanvasData = {
  slug: "fbt",
  title: "Feature Branch Testing + Environment Replication",
  summary:
    "Every branch named fbt/<ticket> gets its own throwaway, fully isolated environment, built and torn down automatically off Bitbucket webhooks: its own database copy, ECS cluster, pipeline and subdomain. Terraform owns the persistent shared layer; Lambda-rendered CloudFormation owns the disposable per-branch stacks, deliberately split so short-lived resources never touch shared Terraform state. The interesting part is what broke once the data grew.",
  // Row 2 continues the build path, so it has no label of its own.
  codeNote: "Client work for a healthcare client, so the code is private.",
  lanes: ["Build path", "", "Teardown path"],
  nodes: [
    {
      id: "api-gateway",
      label: "API Gateway",
      sublabel: "build API · POST /webhook",
      col: 1,
      row: 1,
      connectsTo: ["webhook-filter"],
      detail: {
        why: "A custom (non-proxy) integration in front of the Lambda, with the Lambda permission scoped so only this specific API deployment can invoke it.",
        how: "Two separate REGIONAL REST APIs (one for build, one for destroy), each with a single POST /webhook resource registered as the Bitbucket webhook target. Access logs go to a dedicated CloudWatch log group; throttling is set to 1000 req/s steady-state, 500 burst.",
      },
    },
    {
      id: "webhook-filter",
      label: "Webhook filter",
      sublabel: "fbt/* + ticket ID, in Lambda",
      col: 2,
      row: 1,
      connectsTo: ["sqs-fifo"],
      detail: {
        why: "Only branches named fbt/<ticket> should spin up a full disposable environment. Most pushes shouldn't trigger anything at all.",
        how: "Bitbucket's push webhook hits the build Lambda's API handler, which confirms the push is a new fbt/ branch and extracts the Jira ticket ID with a regex before anything else happens.",
        whatBroke:
          "Developers reported that the webhook \"doesn't work right,\" and the logs showed why nobody could tell what was wrong: roughly 30-40% of invocations failed to read the branch name from the payload, and a bare except swallowed every failure into the same one-word log line, with no event dump. The integration also had no request mapping template (it was commented out), so the handler couldn't count on a consistent payload shape. The fix plan: restore the template, parse both wrapped and raw payloads, and log the actual missing field and event.",
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
          "Deduplicating at the queue stops two pushes from racing, but it doesn't make the build itself safe to retry. That gap is exactly where builds got stuck (see the build node): when a build timed out halfway and the message came back, the retry had to be idempotent, and it wasn't.",
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
        how: "The build worker checks whether the branch's database already exists, creates it as a copy of a template database on the shared FBT Aurora cluster (CREATE DATABASE … WITH TEMPLATE), then renders and applies two CloudFormation stacks for the branch: one for ECS, one for CodePipeline. CloudFormation is used deliberately in exactly two places system-wide: here, and for one-time Terraform backend bootstrapping (see the side node below).",
        whatBroke:
          "Two bugs compounded. First, CREATE DATABASE WITH TEMPLATE makes a full physical copy, and the template had grown from about 158 GB to about 250 GB. The code still assumed a 3-4 minute copy; it now took 14+ minutes, so the Lambda hit its 15-minute hard limit after creating the database but before any infrastructure. That's why 30-40% of builds failed. Second, the retry path returned early as soon as the database existed (\"Already Exists\"), so every retry exited without ever reaching the CloudFormation step, which was itself idempotent. Branches sat in limbo: a database and nothing else. The stuck environment was finished by hand, then came the fix plan: drop the early return so retries fall through to the idempotent stack step, shrink the template, and longer term move the build into Step Functions (no 15-minute ceiling, polled waits, retries with backoff) with Aurora copy-on-write clones instead of physical copies.",
      },
    },
    {
      id: "per-branch-ecs",
      label: "Per-branch ECS stack",
      sublabel: "+ CodePipeline",
      col: 2,
      row: 2,
      detail: {
        why: "Full isolation per feature branch: its own ECS cluster, service and pipeline, running against its own copy of the database.",
        how: "The stacks stand up a dedicated Fargate cluster whose task runs the Django app, a Celery worker and RabbitMQ side by side, with logs shipped to Datadog through FireLens. Its CodePipeline pulls the branch, builds and pushes images to ECR, and deploys to ECS. ALB rules and a Route 53 record give each branch its own subdomain, and a per-branch secret in Secrets Manager holds its config.",
        whatBroke:
          "An environment whose infrastructure was all green still wouldn't start: Django exited with code 1 over and over. With the logs in Datadog, the fastest lead was diffing the failing branch's secret against a working one: 13 keys against 15. The missing two were the Twilio phone numbers, which a separate async Lambda adds after CloudFormation finishes (see the side node). Adding them and forcing a new deployment brought every container up healthy.",
      },
    },
    {
      id: "api-gateway-destroy",
      label: "API Gateway",
      sublabel: "destroy API · POST /webhook",
      col: 1,
      row: 3,
      connectsTo: ["teardown"],
      detail: {
        why: "Teardown has its own entry point instead of sharing the build API.",
        how: "The second of the two REGIONAL REST APIs: a single POST /webhook resource registered as the Bitbucket webhook target for PR-merged events on fbt/ branches.",
      },
    },
    {
      id: "teardown",
      label: "Merge-triggered teardown",
      sublabel: "PR merged → destroy",
      col: 2,
      row: 3,
      detail: {
        why: "Nobody should have to remember to delete branch infrastructure by hand.",
        how: "This isn't a continuation of the build pipeline above: it's a separate Bitbucket webhook that fires on PR-merged events for fbt/ branches, extracts the same ticket ID, and drops a message on its own SQS queue for the destroy Lambda, which tears down that branch's CloudFormation stacks.",
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
        how: "FBT lives in its own AWS region and VPC inside the same account as staging, rather than a fully separate account. That reuses staging's IAM and billing boundary while keeping feature-branch churn off staging's own region and VPC. Terraform owns the shared Aurora Postgres cluster (which holds the template database and every branch's copy), networking, KMS keys, and secrets, all namespaced per environment.",
        whatBroke:
          "Isolating FBT into its own region, not just a separate VPC in the same region as staging, was the deliberate call: it keeps branch churn from ever touching staging's blast radius, at the cost of running an extra region.",
      },
    },
    {
      id: "twilio-provisioning",
      label: "Async phone provisioning",
      sublabel: "Twilio, off the critical path",
      detail: {
        why: "Each environment needs its own phone number so calls and SMS reach the right branch, but a slow or failing third-party API shouldn't block environment creation, and numbers cost money.",
        how: "The build Lambda sends a non-blocking message to a separate queue. A Twilio Lambda reuses an unassigned number from the account's pool before buying a new one, points its webhooks at the branch's subdomain (which only exists once CloudFormation is done), and writes the numbers into the branch's secret. The app loads its secrets from Secrets Manager at startup rather than through the task definition, so any secret change only lands after a new deployment.",
        whatBroke:
          "The design treated Twilio as optional; the app treated it as required at startup. When the Twilio Lambda never processed a branch, containers crash-looped, and because secrets load once at startup, adding the numbers later still did nothing until a forced redeploy. The fix plan: ship default placeholder numbers in the stack so containers always boot, make the app degrade gracefully without Twilio, and alarm on the Twilio Lambda's failures.",
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
        how: "A one-shot script pulls the latest encrypted staging backup, drops and recreates the template database on the shared FBT cluster, restores from the dump, truncates sensitive or noisy tables (API request logs, user identity data), and reindexes. Every new branch copies from that template.",
        whatBroke:
          "Because every branch copies the whole template, the template's size is the build time. As staging data grew, so did every FBT build, until the copy no longer fit inside a Lambda. Keeping the template lean is part of the fix plan.",
      },
    },
  ],
}
