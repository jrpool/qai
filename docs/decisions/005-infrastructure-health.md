---
date: 2026-07-01
status: accepted
---

# Infrastructure health

## Context and problem

The proxy server forwarding requests to QAI will listen continuously. It supports Kilotest now, but Kilotest has not implemented health monitoring. This is one among what will be several examples of architectural flaws in Kilotest that QAI should not emulate. Health degradation is a serious problem that requires monitoring and alerting. QAI should implement these for itself, since it cannot rely on Kilotest for them. A solution requires an external agent, so that even host-down conditions trigger alerts. No collection of sensitive operational or personal information is anticipated, so using an external agent would not create security or privacy risks.

## Considered options

- Open-source requirement: Choose a monitoring service that runs on open-source infrastructure.
- Open/closed agnosticism: Choose the most convenient service without requiring it to run on open-source infrastructure.

## Decision

Open/closed agnosticism, because:

- The contract with a monitoring service offers behavioral promises, does not require evaluation of the service infrastructure, and involves no local installation.
- Major open-source-based services (Uptime Kuma and Upptime) impose complex prerequisites, such as self-hosting or the use of GitHub Actions, Issues, and Pages.
- Major non-open-source-based services (UptimeRobot and Better Stack) are simple to configure and offer free tiers with far higher limits than QAI could foreseeably exhaust.

The decision prescribes using the external monitoring service only for host-down and server-down conditions. Any errors that leave the server able to trigger its own alerts will be handled internally.

### Confirmation

To confirm that implementation is correct, stop the QAI server and leave it stopped for the configured monitoring interval, then verify that an alert with the expected content has arrived at the expected destination.
