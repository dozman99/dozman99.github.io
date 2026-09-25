// Kafka strangler migration (Conclase). Content comes from Chiedozie's own
// account (2026-09-25) plus docs/PLAN.md ("he set up Kafka and the
// microservices himself"). RabbitMQ, Amazon MQ and Kafka behavior described
// here was checked against the official docs before publishing: RabbitMQ
// consumer prefetch + acknowledgements, RabbitMQ/Amazon MQ memory alarms
// (publishers are blocked, not disconnected), Kafka's push-vs-pull design and
// max.poll.interval.ms, and Amazon MSK's per-consumer-group lag metrics in
// CloudWatch. Don't add dual writes, ordering or state drift until
// he describes them: they were planning prompts, not confirmed facts.
// The fast-queue incident details come from
// docs/sanitized/fast-queue-incident-mar2026.md and
// service-dependency-framework.md. That incident was ONE of several reasons
// for the migration, so present it as an example, never as the cause. Vendor and task names from those docs
// (analytics/e-prescribing vendors, scheduled task names) are kept out on purpose.

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
          "A worker that never acknowledged kept its prefetch window full, and RabbitMQ stops delivering to a consumer until at least one outstanding message is acked. So stuck workers stopped taking new work while the queue kept growing. A growing queue means growing broker memory, and past the high-memory threshold RabbitMQ blocks connections to protect itself. One documented incident shows how that played out: a daily scheduled job fanned out a burst of events, and the incoming rate on the fast queue jumped from about 5 to about 35 messages a second. Two workers, each mostly waiting on third-party APIs, could clear maybe 5-10. The queue climbed from its 250-message alert threshold to about 2,000, and RabbitMQ (classic queues on a three-node mq.m5.large cluster) held that whole backlog in memory. Memory crossed the broker's limit, it raised its high-memory alarm, and from then on workers trying to connect got \"Connection refused.\" Nothing drained, so the queue only grew. Rebooting the broker cleared the alarm, scaling workers from 2 to 6 drained the backlog in 30-60 minutes, and AWS Support confirmed the memory alarm as root cause.",
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
          "When a third-party call hung or fell into a loop, the worker kept its connection open and never acknowledged the message. Retries weren't handled well, so the message never cleared, and nothing forced the stuck worker to give it up. Even healthy workers were slow in a way nothing measured: they spent their time waiting on the network, not computing, and under load one was OOM-killed (exit 137), likely from prefetching too many messages at once.",
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
        how: "Both brokers ran as AWS managed services (Amazon MQ for RabbitMQ, Amazon MSK for Kafka), monitored through CloudWatch and Datadog, with monitors defined in Terraform and paging through PagerDuty. On the push side, workers autoscaled on CPU alone (65% target, 2 to 8 tasks), and a Datadog monitor alerted when a queue passed a message-count threshold. After the move, scaling keys off consumer lag, the number of messages waiting in Kafka to be processed, so each worker type scales on its own backlog instead of its CPU. Amazon MSK publishes lag per consumer group to CloudWatch.",
        whatBroke:
          "In the fast-queue incident, the queue-depth alert did fire. Autoscaling didn't: workers waiting on third-party APIs sat at 30-40% CPU while the queue grew eightfold, so the service stayed at 2 tasks the whole time. And nothing watched the broker itself, so the memory alarm and the refused connections only surfaced during the investigation, not from an alert. Consumer lag closes the scaling gap: a slow or stuck worker stops consuming, lag climbs, and scaling reacts to the backlog itself.",
      },
    },
      {
      id: "incident-follow-up",
      label: "After the incident",
      sublabel: "runbooks, dependency map, RCA",
      detail: {
        why: "The fix took longer than it should have because nobody had written down what depends on the broker, what users lose when it's down, how to check it's healthy, or how to recover it. The root cause was only discussed out loud, not recorded.",
        how: "A service dependency and impact framework, starting with the broker as the worked example: every service that depends on it and the user-facing features that break when it fails (delayed notifications and alerts, stuck file processing, halted scheduled jobs), verification steps from the console down to queuing a test task, recovery runbooks per symptom with expected recovery times, an escalation path, and an RCA template for every future incident.",
        whatBroke:
          "The short-term follow-ups stayed on RabbitMQ: a larger broker instance, quorum queues (more memory-efficient under backlog), broker memory alarms at 80% and 95%, alerts on worker connection errors, scaling on queue depth instead of CPU, a prefetch of one for slow I/O-bound tasks, and moving bursty analytics events onto their own queue. They addressed this incident; the Kafka migration was driven by this and other problems with push delivery.",
      },
    },
  ],
}
