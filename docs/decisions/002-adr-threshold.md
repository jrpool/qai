---
date: 2026-06-30
status: accepted
---

# ADR threshold

## Context and problem

Several decisions are being made early in the life of the project. The problem is defining an importance threshold meriting the documentation of a decision in an ADR.

## Considered options

- Lower: Create an ADR for each nontrivial decision.
- Higher: Create an ADR for each decision that is judged strategic. Deem a decision strategic if there are substantially different alternatives and the choice of an alternative is expected to have substantial effects on the maintainability or quality of the project.

## Decision

Higher, because:

- Formally documenting tactical decisions slows development with little benefit.
- Persons who want to read the ADRs for the project history can better digest the content if it remains parsimonious and strategically focused.
- Minor decisions are often understandable with inspection of the codebase.
- Decisions affecting single points in a codebase are more efficiently explained with adjacent comments that do not require navigation to a separate file.

### Confirmation

The decision requires judgment, so confirmation is not deterministic.
