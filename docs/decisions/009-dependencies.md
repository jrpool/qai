---
date: 2026-07-02
status: accepted
---

# Dependencies

## Context and problem

QAI will install dependencies. A decision must be made about how to handle their updates.

## Considered options

- Pin to major version: Specify the major version of each dependency and, when dependencies are updated, update it only to the latest minor and patch version of that major version.
- Stay with latest: As a general rule, when dependencies are updated, update them to their latest versions. Specify a version range only when the latest version has been found incompatible with QAI.

## Decision

Stay with latest, because:

- It gives QAI access to the latest features and corrections.
- It eliminates the drugdery of monitoring dependency updates.
- It makes the reporting of dependency bugs simpler by eliminating the need to retest with the latest version and thereby encourages participation in open-source communities.
- It does not introduce a risk of malfunction in production, because merges to the main branch require internal testing.

### Confirmation

To confirm that the implementation is correct, update the dependencies and spot-check that the installed versions are the latest published ones.
