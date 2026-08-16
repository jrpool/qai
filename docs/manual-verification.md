# QAI: verification

Revision date: 2026-08-16.

## Actions performed

The name of this file is `manual-verification.md`, but the content describes all verification performed, whether automated or not.

### Automated verification

These automated verification procedures have been implemented:

- `src/requestHandler.test.ts`: Performs 16 tests to verify that requests to the server get the expected responses.
- `src/alerts.test.ts`: Performs 5 tests to verify that alert notifications are processed correctly.
- `src/util.test.ts`: Performs 6 tests to verify that strings are correctly converted or sanitized.
- `npm run typecheck`: Runs the TypeScript compiler with strict mode enabled to verify that the code is free of type errors.
- `npm run lint`: Runs the ESLint linter to verify that the code conforms to the project’s coding standards specified in `eslint.config.mjs`.
- `npm run hint`: Runs the HTMLHint linter to verify that the HTML files conform to the project’s coding standards specified in `.htmlhintrc`.
- `npm run test`: Runs the Node.js test runner while collecting code coverage with `c8` and failing unless all coverage metrics are 100%.
- `qai-main`: A GitHub ruleset (copy in `docs/rulesets/qai-main.json`) requiring all checks to be run before the source branch of any approved pull request is merged into the main branch.

### Non-automatic verification

The developer has performed these verification procedures:

#### Local operation

- Launch the application with `npm start`.
- Navigate with a browser to `localhost:3001`.
- Observe that the tutorial page is rendered.
- Navigate to `localhost:3001/comments`.
- Observe that the comments page is rendered.
- Submit valid and invalid comments.
- Observe that comment submissions are correctly processed, including recording and alerting.

#### Deployment

- Visit `https://kilotest.com/qai`.
- Observe that the tutorial page is rendered.
- Visit `https://kilotest.com/qai/comments`.
- Observe that the comments page is rendered.
- Submit valid and invalid comments.
- Observe that comment submissions are correctly processed, including recording and alerting.
- On the deployment host in the QAI project root, execute `pm2 stop qai`.
- Wait until the next health check.
- Observe that the maintainer receives an email message reporting a 502 status error.
- On the deployment host in the QAI project root, execute `pm2 start ecosystem.json`.
- Wait until the next health check.
- Observe that the maintainer receives an email message reporting QAI is healthy again.
- On the deployment host, execute `sudo systemctl stop caddy`.
- Wait until the next health check.
- Observe that the maintainer receives an email message reporting a connection timeout.
- On the deployment host, execute `sudo systemctl start caddy`.
- Wait until the next health check.
- Observe that the maintainer receives an email message reporting QAI is healthy again.

#### Content

- Visit `https://kilotest.com/qai`.
- Follow all instructions on the tutorial page.
- Observe that an LLM on the Claude platform at `claude.ai` uses Kilotest tools to answer questions about the quality of a web page.
- Observe that, without the tutorial instructions being followed, the same LLM on the same platform fails to use any specialized tool to answer the same questions.
- Activate the link on the tutorial page to the comments page.
- Observe that the comments page is rendered.
- Complete and submit a comment.
- Observe that an acknowledgement page is rendered and includes a copy of your comment.

## Expected results

The application passes all automatic and non-automatic verifications.

## Observed results

The application passes all automatic and non-automatic verifications.

## Issues found

All issues that have been found have been subsequently remediated.

On 2026-07-12 an update of dependencies updated `node-html-parser` to version 9.0.0. A bug in that version threw TS2502 type errors. As a temporary evasion, the `tsconfig.json` file was updated to set `compilerOptions.skipLibCheck` to `true`. The maintainer reported the bug as an [issue](https://github.com/taoqf/node-html-parser/issues/316).

## Engineering conclusion

All implemented verification procedures are correct, and the application passes them all.
