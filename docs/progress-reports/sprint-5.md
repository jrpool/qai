# Sprint 5

This document reports on the progress made in this project during Sprint 5 in University of Oregon CS 399, under whose auspices this project is being developed.

## Sprint purpose

The purpose of Sprint 5 was to make the project ready to present to an interested audience.

Presentation readiness required two things:

1. Completion and remediation of incompletenesses and defects that would have interfered with presentability.
2. Production of a recorded presentation.

## Completions and remediations

Two major deficiencies had been identified as barriers to presentability:

1. User input on the comment form could jeopardize the security of the application and of its host, because the input was not sanitized before being injected into consuming code.
2. Users were promised that the application manager had been notified about their submitted comments, but that was not true. The comments were stored, but the manager would not know this without connecting to the server and outputting the comments file.
