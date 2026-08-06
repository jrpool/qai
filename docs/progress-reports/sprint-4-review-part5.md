# Sprint 4, Review, part 5

This is a review by SWE-1.7 Medium.

## Request

In an Engineering Demonstration of this repository, what are 5 questions that I should expect? Of them, which one do you expect would be most difficult to answer well?

## Answer

I'll explore the repository to understand what it contains so I can suggest relevant engineering demonstration questions.

Here are 5 likely Engineering Demonstration questions for this repo, ordered from broad to pointed:

1. **Routing and deployment independence** — Why does QAI run its own Node.js server on a separate port rather than integrate into the existing Kilotest server?
   *Tests your understanding of the routing ADR and the boundaries between QAI and Kilotest.* <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/003-initial-routing.md" />

2. **Comment submission flow** — Walk through what happens when a user submits a `POST /comment` request, including length validation, duplicate detection, and error responses.
   *Tests whether you can trace the request handler end-to-end.* <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="32-152" />

3. **Quality enforcement pipeline** — How do `npm run check`, c8 coverage thresholds, TypeScript strict mode, ESLint, HTMLHint, and the GitHub branch protection rules work together? What do they not catch?
   *Tests your understanding of the verification strategy and its gaps.* <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" />

4. **Dependency and supply-chain strategy** — You have no runtime dependencies and all devDependencies are set to `*`. Why was that chosen, and how do you mitigate the risks of a breaking or compromised latest release?
   *Tests whether you can defend a non-default, arguably risky engineering decision.* <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/009-dependencies.md" />

5. **Production operations and monitoring** — How does QAI get from this repository to `https://kilotest.com/qai`, and what happens if the host or server goes down?
   *Tests your understanding of the deployment and health-monitoring decisions that are outside the source code.* <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/005-infrastructure-health.md" />

The **most difficult to answer well** is probably **#4 (dependency strategy)**. It is easy to quote the ADR’s rationale, but a strong answer must also address the real tradeoffs: you are trusting `npm install` at merge time, a lock file is present but all versions are open-ended, and the "we test before merge" mitigation does not fully cover zero-day vulnerabilities or malicious package takeovers. The question forces you to defend a documented decision while acknowledging its limits, which is harder than simply describing the code.
