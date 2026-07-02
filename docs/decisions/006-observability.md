---
date: 2026-07-01
status: accepted
---

# Observability

## Context and problem

The maintainer will want to review some data about the operation of QAI and will want to be alerted to some activities. Decisions are required about what operation data to collect and what activities merit alerts.

## Considered options

- Rich: Collect abundant data and send alerts on all significant events.
- Minimal: Collect obviously important data and send alerts on events that require maintainer action.

## Decision

Minimal, because:

- Rich data and frequent alerts cause inattention, dismissal, or even blocking.
- The anticipated interactions between users and QAI will gradually increase in complexity and unpredictability, but by the first release only two event types are expected to justify alerts: (1) server errors and (2) comment submissions by users.

### Confirmation

To confirm that the implementation is correct, launch the application, submit requests to it, and verify that any required logs appear. Then temporarily corrupt the QAI request handler to make it return an error response and verify that an alert with the expected content has arrived at the expected destination.
