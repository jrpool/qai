---
date: 2026-06-30
status: accepted
---

# Document directory

## Context and problem

The project began with four files of planning documentation at the root and is now going to acquire ADRs as well. The problem is where to locate all those documents.

## Considered options

- Minimal change: Create a `docs/decisions` directory for ADRs but leave the four planning documents at the root.
- Maximal coherence: Create a `docs` directory for all of those documents, with ADRs in a `decisions` subdirectory.

## Decision

Maximal coherence, because it substantially simplifies navigation for people perusing the filesystem, and its cost is only revising 4 links in `README.md`.

### Confirmation

To confirm the correctness of the implementation, activate the 4 links in the `Project documents` section of `README.md` and verify that they navigate to the corresponding documents.
