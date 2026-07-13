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

## Expected results

## Observed results

## Issues found

## Engineering conclusion
