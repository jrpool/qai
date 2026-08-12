# Sprint 4, Review, part 4

This is a review by SWE-1.7 Medium.

## Request

Review my GitHub repository (`https://github.com/jrpool/qai`) as a senior software engineer. Evaluate repository organization, documentation, architecture, testing, maintainability, engineering evidence, and overall readiness for professional review. Explain your reasoning rather than simply listing problems. I am already aware of about a dozen inconsistencies within the documentation and between the documentation and the reality. I have noted these and plan to correct them. Disregard such inconsistencies in this review. Instead, deal with macro-level qualities, such as clarity of organization, completeness of documentation, testing scope, and obstactes to a transfer of maintenance responsibility.

## Scope

This review is based on the local checkout of `https://github.com/jrpool/qai` and the public GitHub page. I have ignored the micro-level documentation/implementation inconsistencies you already have in hand and focused on macro qualities.

## Overall assessment

QAI is a well-disciplined course/MVP project: it has a clear purpose, a minimal stack, strong documentation hygiene for its size, and an explicit decision trail. As a production- or transfer-readiness artifact, however, it is still an early-stage system. The code is simple to read but carries structural risks that would become real problems if another engineer had to maintain, extend, or operate it without your direct help.

## Repository organization

The layout is clear and conventional: `src/` for TypeScript, `public/` for static HTML, `docs/` for project documentation and ADRs, and `.github/` for CI. That separation makes the repository easy to navigate at a glance. The decision to consolidate all documentation under `docs/` is well recorded, and the ADR format is consistent <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/001-docs-directory.md" />.

The main limitation is that the project is currently split across two repositories in an operational sense: the deployment runtime is described as a "guest" of Kilotest, and important deployment details live in the Kilotest `SERVICE.md` rather than here <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/deployment.md" />. That is fine for a personal project, but it is a transfer obstacle: a new maintainer must understand two repositories to keep the site running.

## Documentation

The documentation is unusually complete for an MVP. It includes a project vision, requirements, architecture, deployment notes, verification notes, repository management, ADRs, and progress reports. That shows real engineering intent. The vision and requirements are well scoped and nontechnical <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/project-vision.md" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/requirements.md" />.

What the documentation does not yet provide is a clean operational runbook. Deployment, monitoring, and failure response are described but not fully self-contained. The `.env.example` file contains only `PORT=3001` <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/.env.example" />, and the real deployment environment is recreated manually on the host <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/deployment.md" />. A new maintainer would need handoff time to understand Kilotest, PM2, Caddy, UptimeRobot, and the `db/` directory that is excluded by `.gitignore` <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/.gitignore" />.

## Architecture

The architecture is intentionally minimal: a Node.js HTTP server with no runtime dependencies, native TypeScript execution, and a static-site-plus-comment-form design. That choice is defensible given the "few dependencies" and "minimalistic architecture" requirements <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/requirements.md" />.

The request handler is a single function that does routing, form parsing, validation, persistence, and response rendering <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" />. For two pages that works, but the coupling is high: changing the tutorial layout, the comment persistence format, or error responses all requires editing the same file. As the project grows, this will become a bottleneck.

There are also a few production-architecture concerns:

- **Concurrency safety.** Comments are persisted by reading `comments.json`, modifying the in-memory array, and writing it back <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="81-126" />. Because the handler `await`s file I/O, two concurrent POSTs can interleave and lose one comment. That is a real risk for even modest traffic.
- **Output encoding.** The acknowledgement page inserts the user's comment into HTML with a raw string replacement <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="138-145" />. Any HTML or script in a comment will be rendered literally. This is a cross-site scripting and HTML-integrity risk. The tests even assert that a comment containing `<ABC&XYZ>` appears verbatim in the response <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.test.ts" lines="99-111" />, confirming the unescaped behavior.
- **Error responses are plain text.** `handleError` sends a status code and a raw string, which is fine for an API but confusing in a browser context <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/util.ts" />. You already know this is on the roadmap, but it is worth noting as an obstacle to a polished handoff.

## Testing

The test suite is solid for an early project. It exercises GET routing, 404/500 paths, comment validation, duplicate detection, and file-permission failures <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.test.ts" />. The use of isolated temporary directories per test is good practice, and the coverage tool is wired into CI.

The testing scope is still narrow in a macro sense:

- No security-oriented tests for the comment-injection case described above.
- No concurrency or race-condition tests.
- No end-to-end or accessibility-automation tests, despite the accessibility requirement in the docs.
- No deployment or integration tests for the Kilotest/Caddy/UptimeRobot path.

Unit tests with high line coverage are a good starting point, but they do not yet cover the operational failure modes that would matter most to a future maintainer.

## Maintainability

The code is small and readable, but a few patterns will make it harder to maintain as the project grows:

- **Heavy inline commenting.** The TypeScript files often have a comment for every logical line. That is helpful to a new reader now, but it will become noise as the codebase grows.
- **Magic numbers without named constants.** Comment length limits (20, 1000) and the duplicate-detection window (1,000,000 ms) are hard-coded <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="71-92" />. A maintainer would need to search for these to change behavior.
- **Tight coupling of HTML and logic.** The handler reads HTML files and replaces placeholders directly. That pattern does not scale well to multi-platform or styled tutorials.
- **No runtime dependency management.** `package.json` uses `*` for all dev dependencies and has no runtime dependencies <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" />. The lock file pins the versions, but a maintainer running `npm install` would get uncontrolled updates, and the project relies on the lockfile being present and respected.

## Engineering evidence

The repository demonstrates strong engineering-process evidence: ADRs <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions" />, a GitHub ruleset requiring linear history, squash merge, and status checks <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/rulesets/qai-main.json" />, and a CI workflow that runs lint, typecheck, HTML validation, and tests on every PR <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows/checks.yaml" />. The verification document records both automated and manual checks, including failure-injection tests for the monitoring path <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/manual-verification.md" />.

What is missing is continuous deployment. Merges to `main` are gated by checks, but the production update is a manual `git pull` and `pm2 restart` <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/deployment.md" />. For an MVP that is acceptable; for professional review, the absence of an automated, reproducible deployment pipeline is a gap.

## Transfer of maintenance responsibility

The biggest obstacles to handing this off are not the code; they are the undocumented operational context:

1. **External deployment dependency.** The site runs on Kilotest's host, reverse proxy, and PM2 setup. The QAI repo documents its own pieces, but the surrounding infrastructure is in another repository.
2. **Operational state lives outside version control.** Comments go into a `db/comments.json` file that is `.gitignore`d. There is no backup, migration, or data-management process.
3. **Manual environment setup.** A new maintainer needs `.env`, PM2, Caddy, UptimeRobot, and an SSH deploy key or HTTPS setup to reproduce the live environment.
4. **No runbook for incident response.** The monitoring setup sends emails, but there is no documented procedure for alerts, log inspection, or comment moderation.

A new maintainer could read the code in an afternoon, but would need several interactions with you to become confident operating and extending the system.

## Summary

QAI is a thoughtfully constructed first release. The documentation and decision records show engineering maturity that is rare in an MVP, and the automated checks are a real strength. The main gaps are architectural hardening (XSS prevention, concurrency safety, error UX) and operational portability (deployment, environment, data management, and monitoring runbooks). For a course project it is in excellent shape; for independent professional maintenance it needs those macro-level operational and security boundaries tightened before it can be handed off with confidence.
