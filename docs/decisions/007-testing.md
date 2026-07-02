---
date: 2026-07-02
status: accepted
---

# Testing

## Context and problem

The architecture provides for a testing module and test cases, but does not specify any rules prescribing when testing must occur. Without such rules, testing could be avoided indefinitely.

## Considered options

Testing can be made a prerequisite for any merge or push to any branch. The options are the local and origin main and feature branches.

Any required testing must take place automatically upon a request to perform the merging or pushing action. The choice of test-triggering mechanisms is a tactical decision.

## Decision

Require testing only before pushes and merges to the origin main branch, because:

- Pushes and merges to the origin main branch are infrequent, so mandatory testing before them is not burdensome.
- The risk of failure is excessive if the deployed server is permitted to relaunch QAI with the code of an untested main branch.
- Mandatory testing before pushes to the origin of a feature branch would deter routine pushes that protect the local code from accidental deletion.
- Mandatory protection of the local main branch would usually result in double testing, because a merge to the local main branch will usually be followed by a push to the origin main branch.
- The adopted requirement does not interfere with voluntary testing of any local branches at any time.

### Confirmation

To confirm that the implementation is correct, try to:

- push a defective main branch to the origin main branch.
- merge a defective origin feature branch to the origin main branch.

In each case, verify that testing is automatically performed and the push or merge is prevented by a test failure.
