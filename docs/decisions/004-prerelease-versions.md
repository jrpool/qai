---
date: 2026-07-01
status: accepted
---

# Prerelease versions

## Context and problem

QAI is being developed incrementally. Several incremental versions will be required for the production of the [first release](../architecture.md). The first incremental version will be version 0.0.1. A problem facing this version is the selection of architectural elements to be included in it.

## Considered options

- Content-first: Include in version 0.0.1 a rudimentary tutorial page and only any other prerequisite components.
- Infrastructure-first: Create in versions 0.0.1 _et seq._ minimal versions of all nonfunctional components in preparation for the development of the pages in later versions.

## Decision

Infrastructure-first, because:

- Responsible development, even of minimal functionality, requires the nonfunctional components.
- If testing of nonfunctional components requires the existence of the pages, placeholder pages can be used without any substantive content.
- There is no doubt about the feasibility of content development, but there is a risk of infeasibility in the infrastructure, so it is prudent to verify its feasibility before any other development occurs.

### Confirmation

The decision specifies a strategy for the first prerelease versions and leaves open the choice of a component or components for implementation in each prerelease version. When each such tactical decision is made and implemented, it can be confirmed by formal or informal testing, depending on whether a test module has been implemented yet.
