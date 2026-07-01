# QAI: architecture

## Overview

This document describes the architecture of the first release of QAI. The purpose of the first release is to provide a simple but useful application that satisfies the [requirements](./requirements.md).

The architecture of the first release is an HTML website with a Node.js server handling routing, request handling, form submission, and comment recording. A tutorial page links to a comment page. An observability module provides run-time records and alerts. The application uses the [deployment infrastructure of Kilotest](https://github.com/jrpool/kilotest/blob/main/SERVICE.md).

## Major components

- Decision records: documents describing strategic architectural decisions
- Domain registrar: a service that registers and manages the QAI domain name (initially none, because the existing domain `kilotest.com` provides access to QAI)
- Host: a host on which the website is deployed (initially the host of `kilotest.com`)
- Proxy server: a reverse proxy that forwards requests to the Node.js server (initially the proxy server of `kilotest.com`)
- Node.js server: modules that perform routing, request handling, form submission, and comment recording
- Tutorial page: an HTML5 page containing the tutorial
- Comment page: an HTML5 page containing the comment form
- Stylesheet: a CSS file containing all non-default styles
- Options file: a JSON file storing the run-time alternatives
- Comments file: a JSON file storing comments not yet disposed of
- Observability module: a dependency used for metrics, logs, and traces
- Alert service: a dependency used for comment alerts to the maintainer
- Environment file: a properties file storing environment variables
- Environment module: a dependency used for retrieval of environment variables
- Test module: a dependency used for testing
- Test cases: artifacts specifying tests to be performed by the test module

## Component responsibilities

- Domain resolution: domain registrar
- SSL termination: proxy server
- Request routing: host, proxy server, and Node.js server
- Request handling: Node.js server
- Configuration: Node.js server, environment module, and environment file
- Form content submission, validation, recording, and acknowledgment: Node.js server
- Comment alerting: Node.js server, observability module, and alert service
- Persistent comment storage: comments file
- Storage of tutorial content: tutorial page
- Storage of comment form: comment page
- Styling of pages: stylesheet
- Storage of run-time alternatives: options file
- Testing: test module and test cases

## Data flow

- External requests: Flow from browser to proxy server to Node.js server.
- External responses: Flow from Node.js server to proxy server to browser.
- Internal link activations: Identical to external requests and responses (see above).
- Form submission requests: Identical to external requests.
- Comments: Flow from Node.js server to (1) comments file and (2) observability module to alert service, logs, and metrics.
- Form submission responses: Identical to external responses.
- Configuration retrieval: Flow from Node.js server to environment module to environment file to environment module to Node.js server.
- Error handling: Flow from Node.js server to:
  - observability module to:
    - logs
    - alert service to maintainer
  - Node.js server to proxy server to browser.

## Initial architecture sketch

Architectural decisions will be made incrementally and may therefore change. The architecture of the first release can be summarized as follows:

- Versioning will conform to the [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) specification. The first releases will be development releases, beginning with version 0.1.0, and versions before that, beginning with 0.0.1, will be prerelease versions.
- The version strategy will be trunk-based with feature branches named informally to describe their purposes.
- The origin will be a private GitHub repository.
- A 2-page HTML5 website will contain 1 static page for the tutorial and 1 static page for the comment form.
- The tutorial page will contain 1 or more links to the comment form, with no `target` attribute.
- The comment form will include a text area for a free-form comment and 0 or more inputs allowing the user to classify the comment, but no input seeking user identification or authentication.
- A separate stylesheet will contain all non-default styles.
- The alternatives and the choices among them that are reflected in the tutorial content will be stored in a JSON file. However, the tutorial content will be static and not generated dynamically from the data in that file. Decisions on dynamic generation will be made and implemented in later releases.
- All comments will be handled by the Node.js server. It will record comments in the comments file, acknowledge submission to the browser via the proxy server, and notify the observability module, which will request alerts from the alert service and add form-submission events to its logs and metrics.
- The maintainer will edit the comments file to remove comments that have been disposed of.
- Requests, responses, and form processing will be performed by server-side Node.js ECMAScript modules written in TypeScript.
- The TypeScript, HTML, and CSS files will conform to the [ESLint configuration defined for Kilotest](https://github.com/jrpool/kilotest/blob/main/eslint.config.mjs).
- The HTML files will declare `en-US` as the document language, use UTF-8 encoding, use distinction-first titles with vertical-bar delimiters, and be responsive to viewport sizes and orientations.

## Open questions

- Do observability packages with built-in alerting exist?
- What dependency should be used for the observability module?
- What dependency should be used for the alert service?
- What traces and metrics should be collected?
- What conditions should trigger alerts?
- In the tutorial, should the content be organized by platform or by step?
- Should the comment form be presented as an if-needed resource or as an encouraged contribution to the project?
