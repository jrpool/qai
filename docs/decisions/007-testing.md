---
date: 2026-07-02
status: accepted
---

# Testing

## Context and problem

The architecture provides for a testing module and test cases, but does not specify any rules prescribing when testing must occur. Without such rules, testing could be avoided indefinitely.

## Considered options

- Protect feature branches: Require the testing before any push of a feature branch to its origin.
- Protect main: Require the testing before any merge to the main branch.
- Protect origin: Require the testing before any push of the main branch to its origin.

## Decision

Protect main, because:

- Merges to the main branch are infrequent, so mandatory testing before them is not burdensome.
- Test failures before merges to the main branch show that such merges would have been premature.
- Mandatory testing before pushes to the origin of a feature branch would deter routine pushes that protect the local code from accidental deletion.
- Testing of any current feature branch is permitted at any time.

### Confirmation

To confirm that the implementation is correct, try to merge a defective feature branch to the main branch and verify that testing is automatically performed and the merge prevented by a test failure.
