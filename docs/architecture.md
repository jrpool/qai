# QAI: architecture

## Overview

This document describes the architecture of the latest release of QAI. The purpose of this release is to provide a simple but useful application that satisfies the [requirements](./requirements.md).

The architecture of the current release, version 1.1.0, is an HTML website with a Node.js server handling routing, request handling, and form rendering. A tutorial page links to a comment page. Comments submitted on the form of the comment page are stored for manager review, and the manager is alerted by email upon each comment submission. The application uses the [deployment infrastructure of Kilotest](https://github.com/jrpool/kilotest/blob/main/SERVICE.md). The health of the deployed application is externally monitored.

## Major components

- Decision records: documents describing strategic architectural decisions
- Domain registrar: a service that registers and manages the QAI domain name (initially none, because the existing domain `kilotest.com` provides access to QAI)
- Origin repository: a repository that stores the origin code of the application
- Host: a host on which the website is deployed (initially the host of `kilotest.com`)
- Proxy server: a reverse proxy that forwards requests to the Node.js server (initially the proxy server of `kilotest.com`)
- Node.js server: modules that perform routing and request handling
- Tutorial page: an HTML5 page containing the tutorial
- Comment page: an HTML5 page containing the comment form
- Comment storage: persistent storage of comments submitted by users with the comment form
- Monitoring service: an external service periodically monitoring QAI health
- Alerting service: an external service that sends email notifications
- Environment file: a properties file storing environment variables
- Type checker: a dependency used for TypeScript type checking
- Hint module: a dependency used for providing HTML syntax checking
- Linting module: a dependency used for TypeScript linting
- Test module: a dependency used for internal testing
- Coverage module: a dependency used for code-coverage reporting
- Check specifications: artifacts specifying checks and tests to be performed
- Branch protection ruleset: a ruleset enforced by the origin repository protecting the default branch

## Component responsibilities

- Domain resolution: domain registrar
- SSL termination: proxy server
- Request routing: host, proxy server, and Node.js server
- Request handling: Node.js server
- Configuration: Node.js server and environment file
- Health monitoring: monitoring service
- Persistent comment storage: origin repository
- Comment submission alerting: alerting service
- Storage of tutorial content: tutorial page
- Storage of comment form: comment page
- Branch protection: origin repository and branch protection ruleset
- Internal checking: type checker, hint module, linting module, and check specifications
- Internal testing: test module and check specifications

## Future components

Components expected to be introduced in version 2.0.0:

- Tutorial enhancement: multi-platform tutorial content

## Data flow

- External requests: Flow from browser to proxy server to Node.js server.
- External responses: Flow from Node.js server to proxy server to browser.
- Internal link activations: Identical to external requests and responses (see above).
- Health monitoring: Flow from monitoring service to proxy server to Node.js server to proxy server to monitoring service.
- Health alerting: Flow from monitoring service to maintainer.
- Comments: Flow from browser to Node.js server to comment storage and to alerting service to maintainer.
- Configuration retrieval: Flow from Node.js server to environment file to Node.js server.
- Error handling: Flow from Node.js server to logs.

## Architecture sketch

Architectural decisions will be made incrementally and may therefore change. The architecture of the current release can be summarized as follows:

- Versioning will conform to the [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) specification. The first releases will be development releases, beginning with version 0.1.0, and versions before that, beginning with 0.0.1, will be prerelease versions.
- The version strategy will be trunk-based with sprint-specific feature branches named according to the specifications of the course in which the project is being developed.
- Installing or updating dependencies will yield their latest versions, including major versions.
- The origin will be a public GitHub repository. The branch protections defined in GitHub will be enforced.
- The authoritative main branch will be the main branch at the origin, and the only method by which it will be permitted to be revised is a merge after an approved pull request on a feature branch.
- Before any pull request can be approved, the source branch will require updated dependencies and internal checking with no failures.
- A 3-page HTML5 website will contain 1 static page for the tutorial, 1 static page for the comment form, and 1 static page for the comment submission acknowledgment.
- The tutorial page will contain a link to the comment form, with no `target` attribute.
- The tutorial page will accept comment submissions.
- The comment form will include a text area for a free-form comment, but no input seeking user identification or authentication.
- Submitted comments will be stored in the comments file, and the manager will be notified by email of each comment submission.
- An external monitoring service will periodically poll QAI and send alerts to the maintainer if QAI times out, fails to respond, or refuses the connection.
- Requests and responses will be performed by server-side Node.js ECMAScript modules written in TypeScript and executed natively by the Node.js runtime without transcompilation.
- The TypeScript and HTML files will conform to the [ESLint configuration defined for Kilotest](https://github.com/jrpool/kilotest/blob/main/eslint.config.mjs).
- The HTML files will declare `en-US` as the document language, use UTF-8 encoding, use distinction-first titles with vertical-bar delimiters, and be responsive to viewport sizes and orientations.

## Open questions

- In the tutorial, should the content be organized by platform or by step?
- Should the comment form be presented as an if-needed resource or as an encouraged contribution to the project?
