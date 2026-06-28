# QAI: architecture

## Overview

The first increment of QAI will be organized to satisfy its requirements without unnecessary complexity.

Architectural decisions will be made incrementally and may therefore change. The initially planned architecture can be summarized as follows:

- A 2-page HTML5 website will contain 1 page for the tutorial and 1 page for the comment form.
- The tutorial page will contain 1 or more links to the comment form, with no `target` attribute.
- The comment form will include a text area for a free-form comment and 0 or more inputs allowing the user to classify the comment, but no input seeking user identification or authentication.
- A separate stylesheet will contain all non-default styles.
- The alternatives and the choices among them that are reflected in the tutorial content will be stored in a JSON file. However, the tutorial content will be static and not generated dynamically from the data in that file. Decisions on dynamic generation will be made and implemented in later increments.
- All comments will be added to a JSON comment file and sent by email to the QAI maintainer. The maintainer will edit the file to remove comments that have been disposed of.
- Routing of requests, request handling, and form submission handling will be performed by server-side Node.js ECMAScript modules written in TypeScript.

## Major components

- Domain registrar: the service that registers and manages the QAI domain name
- Host: the host on which the website will be deployed
- Proxy server: the reverse proxy that forwards requests to the Node.js server
- Node.js server: the modules that perform routing, request handling, and form submission
- Tutorial page: the HTML5 page containing the tutorial
- Comment page: the HTML5 page containing the comment form
- Stylesheet: the CSS file containing all non-default styles
- Options file: the JSON file storing the run-time alternatives
- Comments file: the JSON file storing comments not yet disposed of
- Observability module: the dependency used for metrics, logs, and traces
- Alert service: the dependency used for comment alerts to the maintainer
- Environment file: the properties file storing environment variables
- Environment module: the dependency used for retrieval of environment variables

## Component responsibilities

- SSL termination: proxy server
- Request routing: Node.js server
- Request handling: Node.js server
- Configuration: Node.js server, environment module, and environment file
- Form content submission, validation, and recording: Node.js server
- Form content alerting: Node.js server and alert service
- Form content persistent storage: comments file
- Storage of tutorial content: tutorial page
- Storage of comment form: comment page
- Styling of pages: stylesheet
- Storage of run-time alternatives: options file

## Data flow

- External requests: Flow from browser to proxy server to Node.js server.
- External responses: Fow from Node.js server to proxy server to browser.
- Internal link activations: They are external requests and responses (see above).
- Form submissions: They are external requests and responses (see above) with further flow to the alert service and the comments file.
- Configuration retrieval: Flow from Node.js server to environment module to environment file to environment module to Node.js server.

## Initial architecture summary

## Open questions
