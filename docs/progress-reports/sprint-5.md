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
