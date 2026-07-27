# QAI: How to get quality answers from AI

## Overview

QAI is your guide to helping AI give you high-quality answers to technical questions.

Today’s large language models (LLMs) need your help in getting access to expert specialized tools. Without that, LLMs give the best answers they can, but the answers are typically inferior. QAI shows you how to equip LLMs with the tools they need.

QAI guides you with a specific practical example. You can apply the same techniques to any technical domain.

## Current status

QAI is currently in prerelease development. Its working functionalities are:

- A tutorial HTML page that gives complete instructions for equipping one AI platform with a connector to MCP tools.
- An HTML page for comment submission that is disabled until completion of a handler for submissions.
- Routing of HTTP requests to handlers that render the tutorial and comment pages.
- TypeScript type checks of the TypeScript files.
- HTMLHint checks of the HTML files.
- ESLint checks of the TypeScript files.
- Unit tests of the request handling.
- c8 checking of 100% test coverage.
- A public GitHub repository.
- Issue tracking on the GitHub repository for comment submission until the comment form is enabled.
- A ruleset protecting the default branch from merges other than by pull request and from merges when any check fails.
- Enforcement of the ruleset with a GitHub Actions workflow.
- A deployed instance with a public URL.
- An external service that monitors the deployed instance every 5 minutes and alerts the maintainer of any host-down or server-down event.

The history of strategic architectural decisions is described in files in the `docs/decisions` directory. The current state is described in the documents listed in the next section.

## Project documents

- [Project vision](./docs/project-vision.md)
- [Requirements](./docs/requirements.md)
- [Architecture](./docs/architecture.md)
- [Development ruleset](./docs/rulesets/qai-main.json)
- [Architecture decision records](./docs/decisions)
- [AI implementation notes](./docs/ai-implementation.md)
- [Verification notes](./docs/manual-verification.md)
- [Repository management](./docs/repository.md)
- [Deployment notes](./docs/deployment.md)

## Setup notes

For local execution:

- Install Node.js.
- Run `npm install`.
- Run `npm start`.

For local checks: run `npm run check`.

For the production user experience:

- Visit `https://kilotest.com/qai` for the tutorial page.
- Visit `https://kilotest.com/qai/comments` for the comment page (with disabled submission).

## Dependencies

All installed dependencies are development dependencies supporting build, test, and lint processes.
