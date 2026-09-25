// Kafka strangler migration (Conclase). Content comes from Chiedozie's own
// account (2026-09-25) plus docs/PLAN.md ("he set up Kafka and the
// microservices himself"). RabbitMQ, Amazon MQ and Kafka behavior described
// here was checked against the official docs before publishing: RabbitMQ
// consumer prefetch + acknowledgements, RabbitMQ/Amazon MQ memory alarms
// (publishers are blocked, not disconnected), Kafka's push-vs-pull design and
// max.poll.interval.ms, and Amazon MSK's per-consumer-group lag metrics in
// CloudWatch. Don't add dual writes, ordering or state drift until
// he describes them: they were planning prompts, not confirmed facts.
// Fast-queue incident details (side nodes + one supporting line per main node) come from
// docs/sanitized/fast-queue-incident-mar2026.md and
// service-dependency-framework.md. It's a side story: one of several reasons
// for the migration, so it only ever supports the main account, never leads it. Vendor and task names
// from those docs are kept out on purpose.

import type { CanvasData } from "./types"

export const kafkaStranglerCanvas: CanvasData = {
  slug: "kafka-strangler",
  title: "Strangler Migration with Kafka",
  summary:
    "A large monolith handed its background work to RabbitMQ, which pushed messages to workers that called third-party services. When one of those services hung, a stuck worker could stall the whole pipeline. The fix was a strangler migration: responsibility moved into microservices one environment at a time, with Kafka as a pull-based backbone so every worker sets its own pace.",
  codeNote: "Built at Conclase, so the code is private.",
  lanes: ["Before: RabbitMQ pushes", "After: workers pull from Kafka"],
  nodes: [
    {
      id: "monolith",
      label: "Monolith",
      sublabel: "publishes background work",
      col: 1,
      row: 1,
      connectsTo: ["rabbitmq"],
      detail: {
        why: "The starting point: large monolithic applications that handed background work off to a message broker instead of doing it inline.",
        how: "They published messages to RabbitMQ, where several workers picked them up and processed them.",
      },
    },
    {
      id: "rabbitmq",
      label: "RabbitMQ",
      sublabel: "Amazon MQ · push delivery",
      col: 2,
      row: 1,
      connectsTo: ["rabbit-workers"],
      detail: {
        why: "A managed broker on AWS to sit between the monolith and its workers.",
        how: "RabbitMQ pushes messages to consumers: the broker decides when each worker gets work, up to that worker's prefetch limit of unacknowledged messages. Messages stay in the broker until a worker acknowledges them.",
        whatBroke:
          "A worker that never acknowledged kept its prefetch window full, and RabbitMQ stops delivering to a consumer until at least one outstanding message is acked. So stuck workers stopped taking new work while the queue kept growing. A growing queue means growing broker memory, and once it crossed the high-memory threshold, RabbitMQ blocked every connection that publishes, to protect itself from crashing and losing messages. Upstream services couldn't send anything at all: one stuck integration could stall the whole pipeline. In one incident (see the side story), a burst of work pushed a fast queue to about 2,000 messages and the broker's memory alarm left workers getting \"Connection refused\" until it was rebooted.",
      },
    },
    {
      id: "rabbit-workers",
      label: "Workers",
      sublabel: "third-party integrations",
      col: 3,
      row: 1,
      detail: {
        why: "Each worker ran an integration with a third-party service, so it could only be as fast and as reliable as the service on the other end.",
        how: "Celery workers held long-lived connections to RabbitMQ, received pushed messages (several at a time, up to their prefetch limit), called the third-party service, and acknowledged each message when the work was done.",
        whatBroke:
          "When a third-party call hung or fell into a loop, the worker kept its connection open and never acknowledged the message. Retries weren't handled well, so the message never cleared, and nothing forced the stuck worker to give it up. Even healthy workers spent most of their time waiting on the network, and under load one was OOM-killed (exit 137), likely from prefetching too many messages at once.",
      },
    },
    {
      id: "microservices",
      label: "Microservices",
      sublabel: "strangled out of the monolith",
      col: 1,
      row: 2,
      connectsTo: ["kafka"],
      detail: {
        why: "Rewriting the monolith in one go was too risky. The strangler pattern moves responsibility out a piece at a time while the old system keeps running.",
        how: "Functionality moved out of the monolith into distributed microservices incrementally, released from one environment to the next instead of in a single cutover. The new microservices and Kafka were set up from scratch as part of the migration.",
      },
    },
    {
      id: "kafka",
      label: "Kafka",
      sublabel: "Amazon MSK · multiple topics",
      col: 2,
      row: 2,
      connectsTo: ["kafka-workers"],
      detail: {
        why: "A central messaging backbone across services, built for consumers that move at different speeds.",
        how: "Services publish to multiple topics. Kafka doesn't push messages to consumers or hold them in memory waiting for per-message acks: it keeps them in the topic, and each consumer group tracks its own position.",
      },
    },
    {
      id: "kafka-workers",
      label: "Workers",
      sublabel: "pull from topics · consumer groups",
      col: 3,
      row: 2,
      detail: {
        why: "Let each worker take work only when it's ready for it.",
        how: "Workers poll their topics as members of consumer groups. A slow worker simply falls behind and catches up. A stuck worker misses its poll deadline (max.poll.interval.ms), is considered failed, and its partitions are reassigned to a healthy worker in the group, so the backlog keeps moving and nothing upstream is blocked.",
      },
    },
  ],
  sideNodes: [
    {
      id: "push-vs-pull",
      label: "Why push didn't work here",
      sublabel: "push vs. pull",
      detail: {
        why: "In a push system the broker decides when a worker gets work. That works while every consumer keeps up, but these workers depended on third-party services outside our control, so their speed was unpredictable. When a consumer is slower than the rate of incoming messages, push overwhelms it, and here the backlog piled up inside the broker until it had to block publishers.",
        how: "Pull flips control: each worker asks for work when it's ready. The backlog waits in Kafka as consumer lag rather than filling broker memory, a slow worker falls behind and catches up, and a stuck worker is detected by its missed poll deadline and replaced. A problem in one integration stays in that integration instead of stalling every service that publishes. It also changes what you watch: the backlog itself (consumer lag), not CPU and memory, which a waiting worker barely touches.",
      },
    },
    {
      id: "strangler-rollout",
      label: "Strangler rollout",
      sublabel: "one environment at a time",
      detail: {
        why: "Keep the monolith serving while its responsibilities move out, so every step can be released and checked on its own.",
        how: "Instead of tearing down one application and standing up another, the migration shipped as incremental releases, moving from one environment to the next.",
      },
    },
    {
      id: "monitoring",
      label: "Monitoring and autoscaling",
      sublabel: "CPU/memory vs. consumer lag",
      detail: {
        why: "A stuck worker has to be visible, and workers have to scale on the signal that actually means work is piling up.",
        how: "Both brokers ran as AWS managed services (Amazon MQ for RabbitMQ, Amazon MSK for Kafka), so most services were monitored on AWS, alongside Datadog monitors defined in Terraform and paging through PagerDuty. On the push side, workers autoscaled on CPU and memory thresholds. After the move, scaling keys off consumer lag, the number of messages waiting in Kafka to be processed, so each worker type scales independently instead of on its CPU or memory configuration. Amazon MSK publishes lag per consumer group to CloudWatch.",
        whatBroke:
          "A worker stuck on a hung third-party call barely uses CPU or memory: it's just waiting. So CPU- and memory-based scaling and alerts never fired, and the failure ran silently in the background. Consumer lag doesn't have that blind spot: a stuck worker stops consuming, lag climbs, and the backlog shows up where you're already looking. In the side-story incident, a queue-depth alert did page, but the worker service scaled on CPU alone (65% target) and sat at 30-40% CPU while the queue grew eightfold, so it stayed at 2 tasks.",
      },
    },
      {
      id: "side-story-incident",
      label: "Side story: a queue incident",
      sublabel: "one example, not the whole reason",
      detail: {
        why: "One of several incidents on the push side, included as an example of the failure mode rather than the reason for the migration.",
        how: "A scheduled job fanned out a burst of events and a fast queue's incoming rate jumped about sevenfold. Two workers, mostly waiting on third-party APIs, fell behind, CPU-based autoscaling never triggered, and the backlog grew to about 2,000 messages in broker memory until RabbitMQ raised its high-memory alarm and workers got \"Connection refused.\" Rebooting the broker and scaling workers from 2 to 6 drained it, and AWS Support confirmed the root cause.",
      },
    },
    {
      id: "incident-follow-up",
      label: "After the incident",
      sublabel: "runbooks, dependency map, RCA",
      detail: {
        why: "Recovery took longer than it should have because nobody had written down what depends on the broker, what users lose when it's down, how to check it's healthy, or how to recover it.",
        how: "A service dependency and impact framework, starting with the broker as the worked example: the services and user-facing features that break when it fails, verification steps from the console down to queuing a test task, per-symptom recovery runbooks with expected recovery times, an escalation path, and an RCA template for every future incident.",
        whatBroke:
          "The follow-ups for the broker itself: a larger instance, quorum queues, memory alarms at 80% and 95%, alerts on worker connection errors, scaling on queue depth instead of CPU, and a prefetch of one for slow I/O-bound tasks. They addressed this incident; the Kafka migration was driven by this and other problems with push delivery.",
      },
    },
  ],
}
