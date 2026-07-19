# QAI: How to get quality answers from AI

## Overview

QAI is your guide to helping AI give you high-quality answers to technical questions.

Today’s large language models (LLMs) need your help in getting access to expert specialized tools. Without that, LLMs give the best answers they can, but the answers are typically inferior. QAI shows you how to equip LLMs with the tools they need.

QAI guides you with a specific practical example. You can apply the same techniques to any technical domain.

## Current status

QAI is currently in prerelease development. The history of strategic architectural decisions is described in files in the `docs/decisions` directory. The current state is described in the documents listed in the next section.

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

The development ruleset is not enforceable while the origin is a private repository.

## Setup notes

For local execution:

- Install Node.js.
- Run `npm install`.
- Run `npm start`.

For local checks: run `npm run check`.

For the production user experience:

- Visit `https://kilotest.com/qai`.
- Visit `https://kilotest.com/qai/comments`.
