# Sprint 3, Part 1, progress report

## This document

This document reports on the progress made in this project during the first half of Sprint 3 for University of Oregon CS 399, under whose auspices this project is being developed.

## Current Sprint 3 direction

What persistence, integration, or project expansion are you pursuing?

The work during Sprint 3 aims to make QAI fit for release by ensuring that it has:

- Minimally useful content
- Consistent and standards-compliant code
- Persistent sprint branches
- A public repository
- Quality checks that protect the default branch
- A publicly reachable deployed instance
- Health monitoring that alerts the maintainer on failure of the deployed instance
- Satisfactory documentation

## Why this direction matters

How does it make your existing Sprint 2 feature slice more useful or realistic?

The Sprint 3 work adds to the Sprint 2 feature slice with:

- Actual pertinent content instead of placeholders
- A public repository instead of a private one
- Enforcement of branch protection rules
- Public deployment
- Health monitoring with failure alerts
- Documentation updates

## Data or external capability

What information needs to be stored, retrieved, updated, or exchanged?

Users will be able to submit bug reports and feature suggestions. Their comments will need to persist until resolved and deleted by the maintainer.

## Current design

A single JSON file aggregating comments, or a directory containing one JSON file per comment, will suffice as long as the only data requiring persistence are comments. More robust storage design will be postponed until after Sprint 3, when usage analytics and a knowledge base may need storage.

## Data model or structure

Identify the main records, entities, tables, documents, fields, keys, or relationships involved.

Comments will initially be flat and anonymous, so initially the facts about each comment will be its date and time and its text content. After Sprint 3 the comment form may submit more fields.

## Progress so far

What have you created, changed, tested, or investigated?

As of the middle of Sprint 3, QAI has:

- A tutorial page that contains a complete static tutorial on the topic of QAI.
- HTML and TypeScript code that passes extensive HTMLHint, `tsc`, and ESLint checks.
- Unit tests with 100% passing rates and 100% code coverage.
- Persistent branches for Sprints 1, 2, and 3.
- A public GitHub repository.
- A GitHub Action that performs HTML hinting, type checking, linting, testing, and code-coverage checking.
- A ruleset that protects the default branch from non-PR merges and prevents merges without successful checks.
- A publicly reachable deployed instance at `https://kilotest.com/qai`.
- An external health monitoring service that alerts the maintainer on both 502 status errors and connection timeouts.
- Nine architectural decision records.
- Eight other specialized documentation files.
- Standard user documentation in a `README` and a `LICENSE` file.

As documented in the `docs/manual-verification.md` file, the maintainer has supplemented the autometed checks with non-automated checks, confirming expected behaviors.

## What currently works

Identify any completed behavior, even if it is small.

- The tutorial page is served when requested.
- The tutorial page contains a link to the comments page.
- The comments page is served when requested either directly or via the link to it on the tutorial page.
- An LLM on the Claude platform at `claude.ai` uses Kilotest tools to answer questions about the quality of a web page when, and only when, the tutorial instructions are followed.
- The HTML and TypeScript code passes all automated checks.
- Unit tests are all passing.
- Code coverage is 100%.
- The GitHub repository is public and has persistent branches.
- The GitHub Action performs all required checks.
- GitHub prevents merges to the `main` branch without success in the required checks.
- GitHub prevents non-PR merges to the `main` branch.
- The deployed instance is publicly reachable.
- The health monitoring service sends alerts to the maintainer when, and only when, the deployed instance or its home page is unreachable.

## Biggest remaining challenge

What is the most important blocker, uncertainty, or engineering risk?

The main risks to the project appear to be these:

- Recruiting users to the tutorial may be impractically expensive.
- Making the tutorial satisfying for users with diverse skills who want to use diverse AI platforms may require more user testing and more design complexity than is practical.
- AI platforms may change their methods and protocols of tool access in ways that cause substantial additional effort to keep the tutorial current.

## AI-assisted learning and engineering

Explain one way AI helped you understand, design, implement, or review your persistence or integration approach.

The `node-html-parser` dependency began to throw errors after it was updated to version 9.0.0. I obtained information from an LLM about the cause of the errors and the available solutions.

The LLM discovered that the errors arose from a change of the build tool from `tsc` to `tsdown`, which generates self-referential type declarations. The LLM reported that this change was about 1 week old and the bug had not yet been reported.

I requested advice on a solution and accepted the recommendation to add a `skipLibCheck: true` property to `compilerOptions` in `tsconfig.json`.

I also consulted the LLM on reporting the bug. The LLM opined that doing so would be a useful contribution to the community and advised on the content that would be appropriate for a report. I accepted the advice and submitted an issue to the `node-html-parser` repository.

## Engineering judgment

Identify one AI suggestion you accepted, revised, rejected, or postponed, and explain why.

I accepted an LLM’s advice on how to number pre-release versions of the package.

## Next step

What specific action will you complete before the Sprint 3 Deliverable?

The main remaining action in Sprint 3 will be to implement the comments form and the storage of and alerting about new comments. This will require equipping QAI with basic observability.
