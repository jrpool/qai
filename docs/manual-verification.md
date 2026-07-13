# QAI: verification

## Actions performed

The name of this file is `manual-verification.md`, but the content describes all verification performed, whether automated or not.

### Automated verification

These automated verification procedures have been implemented:

- `src/requestHandler.test.ts`: Performs 6 unit tests to verify that requests to the server get the expected responses.
- `src/util.test.ts`: Performs 4 unit tests to verify that loggable events are logged as expected.
- `npm run typecheck`: Runs the TypeScript compiler with strict mode enabled to verify that the code is free of type errors.
- `npm run lint`: Runs the ESLint linter to verify that the code conforms to the project’s coding standards specified in `eslint.config.mjs`.
- `npm run hint`: Runs the HTMLHint linter to verify that the HTML files conform to the project’s coding standards specified in `.htmlhintrc`.
- `npm run test`: Runs the Node.js test runner while collecting code coverage with `c8` and failing unless all coverage metrics are at least 99%.
- `main`: A GitHub ruleset (copy in `docs/rulesets/main.json`) requiring all checks to be run before the source branch of any approved pull request is merged into the main branch. Once the repository becomes public, the requirement will be upgraded to make the success of all checks mandatory.

### Non-automatic verification

The developer has performed these verification procedures:

- Launch the application with `npm start`.
- Navigate with a browser to `localhost:3001`.
- Observe that the tutorial page is rendered.
- Navigate to `localhost:3001/comments`.
- Observe that the comments page is rendered.

## Expected results

The application passes all automatic and non-automatic verifications.

## Observed results

The application passes all automatic and non-automatic verifications.

## Issues found

All issues that have been found have been subsequently remediated.

## Engineering conclusion

All implemented verification procedures are correct, and the application passes them all.

However, additional features are planned, including:

- Conversion of the origin repository from private to public visibility.
- A link from the tutorial page to the comments page.
- A form on the comments page for the submission of comments.
- Alerts to the maintainer when comments are submitted.
- Server health monitoring by an external service.

These features will merit additional verification procedures.
