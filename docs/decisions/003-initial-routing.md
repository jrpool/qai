---
date: 2026-06-30
status: accepted
---

# Initial routing

## Context and problem

QAI is being developed as a project in a university course and must satisfy requirements imposed by the course. The architecture document describes an initial deployment that makes use of the existing domain registrar, host, and proxy server of Kilotest. The course does not require the application to be deployed at all, so the creator is free to deploy it or not, but does require the application to incorporate a server-client infrastructure. In this context, a decision must be made on the routing of requests to and responses from QAI.

## Considered options

- Integrated with Kilotest: Make the proxy server forward both Kilotest and QAI requests to the existing Kilotest Node.js server, which treats requests to `/qai` as QAI requests.
- Independent: Make the proxy server forward `https://kilotest.com/qai` requests to port 3001, distinct from the Kilotest port 3000, and make an independent Node.js server handle those requests.

## Decision

Independent, because:

- The application should be able to acquire its own deployment infrastructure if the content becomes generalized to include examples of tools with diverse functionalities.
- Kilotest embodies architectural decisions, such as JavaScript CommonJS modules and a custom validation system, that should not constrain decisions for QAI.
- Although the QAI MVP will use Kilotest as an example, that use does not require any shared code or dependencies.
- The evaluation of QAI as a course requirement will include evaluation of its server infrastructure, and will therefore be more straightforward if that infrastructure belongs solely to QAI.

### Confirmation

The decision can be confirmed by the successful use of QAI when Kilotest is temporarily stopped for testing.
