---
date: 2026-07-15
status: accepted
---

# Prerelease versions

## Context and problem

QAI is being developed incrementally. Several incremental versions will be required for the production of the [first release](../architecture.md). The first incremental version will be version 0.1.0. What architectural elements should be included in that version?

## Considered options

- Content-heavy: Include in version 0.1.0 a simple tutorial page and only such other components that are required to allow the page to be served.
- Infrastructure-heavy: Create in version 0.1.0 a minimal placeholder tutorial page and the minimal working implementations of the other components of the [described architecture](../architecture.md).

## Decision

Infrastructure-heavy, because:

- Responsible development, even of minimal functionality, requires the nonfunctional components.
- Completion of each new functionality, even in the prerelease versions, requires testing, so the testing infrastructure must be in place.
- There is no doubt about the feasibility of content development, but there is a risk of infeasibility in the infrastructure, so it is prudent to verify its feasibility before the tutorial and the comment page are elaborated.

### Confirmation

The implemented decision can be confirmed to be correct by means of test cases limited to the features that have been implemented.
