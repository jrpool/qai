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

- Host: the host on which the website will be deployed
- Node.js server: the modules that perform routing, request handling, and form submission
- Tutorial page: the HTML5 page containing the tutorial
- Comment page: the HTML5 page containing the comment form
- Stylesheet: the CSS file containing all non-default styles
- Options file: the JSON file storing the alternatives and the choices among them
- Comments file: the JSON file storing comments not yet disposed of
- Alert service: the dependency used for comment alerts to the maintainer
- Environment service: the dependency used for retrieval of environment variables

## Component responsibilities

## Data flow

## Initial architecture sketch

## Open questions
