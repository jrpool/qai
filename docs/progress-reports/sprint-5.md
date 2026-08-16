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

Both of these deficiencies were eliminated during Sprint 5.

## Input sanitization

A sanitizing function was added to the utility module and applied in two contexts:

1. Inclusion of a copy of the comment in the HTML acknowledgement served to the user after submission.
2. Transmission of the comment to the alerting service for further transmission by email to the application manager. Even though the alerting service sends plain-text messages, an email client may render such a message as HTML and may fail to sanitize messages before doing so.

## Notification

An already existing account on the Resend platform was leveraged for the completion of the comment-processing feature. After this revision, any comment is not only saved in the comments file but also relayed by email to the application manager.

## Verification

Additional tests were created for verification of the completed and remediated features. At the end of Sprint 4 there were 15 tests. At the end of Sprint 5 there were 27 tests. Test coverage was maintained at 100%, with two `c8` exclusions for practically untestable network errors.

Human verification supplemented the automated checks. A human user performed all the actions permitted by the application and verified the appropriate responses. The manager inspected the comments file and the email inflow, verifying that comments were correctly processed.

## AI assistance

Large language models were used as strategic advisors, drafters, and code reviewers. In all conversations on the AI platform, Ask mode was invoked, so no LLM directly modified any application code. The human developer retained responsibility for understanding and revising LLM drafts.

AI assistance was particularly valuable for creating awareness of tools unfamiliar to the developer, such as asynchronous disposability in Node.js.

Sprint 5 continued to provide opportunities to contemplate the problem of adopting a personal policy on AI discretion. Taking responsibility for all decisions does not mean granting no discretion to an AI (or human) assistant. It means being personally accountable for the consequences of such grants of discretion. Sprint 5 added experience that helped make more robust decisions on how much discretion, over what, and when, to grant.
