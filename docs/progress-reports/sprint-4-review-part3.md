# Sprint 4, Review, part 3

This is a review by SWE-1.7 Medium.

## Request

Review my repository history and engineering evidence. Explain whether another engineer could understand how the project evolved across the sprints and identify opportunities to improve repository clarity.

## Summary

Overall, a new engineer could understand the *current state* and *strategic direction* of QAI fairly well from the `docs/` artifacts, but the *sprint-by-sprint evolution* is hard to reconstruct from the repository history itself. The written documentation carries the narrative, while the git history is mostly noise.

## What another engineer can understand today

- **Project purpose and scope.** The `README.md` gives a concise status list and points to the main documents. The `docs/project-vision.md` and `docs/requirements.md` explain the problem, intended users, and what the first release should/should not do. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/requirements.md" />
- **Architecture and major decisions.** The `docs/architecture.md` component list and data-flow sections give a high-level map, and the ADRs in `docs/decisions/` explain why key choices were made (e.g., docs directory, git workflow, infrastructure health). <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/001-docs-directory.md" />
- **Sprint narrative.** `docs/progress-reports/sprint-3-part1.md`, `sprint-4-review-part1.md`, and `sprint-4-review-part2.md` record what changed in each sprint and what the next steps were. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/progress-reports/sprint-3-part1.md" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/progress-reports/sprint-4-review-part2.md" />
- **Quality and deployment practices.** `package.json`, `.github/workflows/checks.yaml`, `docs/rulesets/qai-main.json`, `docs/manual-verification.md`, and `docs/deployment.md` make the CI, branch protection, testing, and deployment setup transparent. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows/checks.yaml" />

## Where repository history fails to tell the story

- **Nondescriptive commit messages.** In `~/.git/logs/HEAD`, 31% of the 127 `commit:` entries are literally `commit: edit` or `commit: debug` (39 of 127). <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/.git/logs/HEAD" /> The branch names (`sprint-1-definition`, `feature-2-dependencies`, `sprint-2-prototype`, `feature-2-page`, etc.) hint at the sprint structure, but the commits themselves do not explain what changed or why. An outsider cannot map a commit to a sprint goal without cross-referencing the progress reports.
- **No sprint tags or release notes.** There are no version tags, no `CHANGELOG`, and no per-sprint release notes, so the boundaries between v0.0.1, 0.1.0, 0.3.0, and the current 1.0.0 are not discoverable from git.

## Documentation and implementation are drifting out of sync

Several docs no longer match the code, which is the biggest clarity risk for a new engineer:

- **Version number is inconsistent.** `package.json` says `1.0.0`, while `docs/architecture.md` calls the current release `0.3.0` and describes `0.1.0` as the first release. <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" lines="3" /> <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="7" />
- **Architecture doc is stale.**
  - It says the comment page has submission disabled, but `src/requestHandler.ts` now handles `POST /comment`. <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="18" /> <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="32" />
  - It lists the “origin repository” as persistent comment storage, but comments are written to a local `db/comments.json` file. <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="19" /> <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/main.ts" lines="11" />
  - It calls QAI a “2-page HTML5 website,” but there are three HTML pages (`tutorial.html`, `comments.html`, `comment-ack.html`). <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="75" />
- **Coverage claims do not match config.** The `README` and `manual-verification.md` claim 100% c8 coverage, but `package.json` thresholds are 90/90/88/90. <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" lines="21-22" /> <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" lines="28-32" />
- **Manual verification is outdated.** `docs/manual-verification.md` is dated 2026-07-19, says `requestHandler.test.ts` has 6 tests, and verifies the thank-you page while omitting that maintainer alerting is not implemented. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/manual-verification.md" />
- **README has broken links and missing setup steps.**
  - It links to `docs/ai-implementation.md` and `docs/progress-reports.md`, but the actual files are `docs/ai-implementation-review.md` and `docs/progress-reports/*.md`. <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" lines="44-48" />
  - It does not tell the user to create `.env` from `.env.example` before running `npm start`. <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" lines="54-58" />
- **Monitoring frequency is inconsistent.** The `README` says the external service checks every 5 minutes; `docs/deployment.md` says once per hour. <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" lines="27-28" /> <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/deployment.md" lines="44-47" />
- **Missing persistence artifact.** The server expects a `db/comments.json` file, but no `db/` directory is present in the repo. New engineers have to discover that it is created at runtime by `mkdir(..., {recursive: true})`.

## Opportunities to improve repository clarity

1. **Rewrite commit messages or add a post-hoc changelog.** Retroactively tag meaningful commits or create a `CHANGELOG.md`/`docs/releases.md` keyed to sprint/versions, so the git history can be read without the progress reports.
2. **Reconcile the version number.** Pick a single authoritative version, update `package.json`, `architecture.md`, and `README.md` to match, and consider git tags for releases.
3. **Refresh `docs/architecture.md`.** Update it to reflect the current 1.0.0 implementation: the `POST /comment` handler, `db/comments.json` storage, three HTML pages, and existing logging.
4. **Fix README links and setup.** Correct the `ai-implementation` and `progress-reports` links and add a step to copy `.env.example` to `.env`.
5. **Update `manual-verification.md`.** Bump the revision date, correct the test counts, align the coverage claim with `package.json`, and document what is *not* yet verified (e.g., maintainer alerting on comments).
6. **Document the `db/` directory.** Add a note in `README` or `architecture.md` that `db/comments.json` is a runtime file and optionally add a `.gitkeep` or `.gitignore` entry to make the convention explicit.
7. **Clarify monitoring details.** Standardize the polling interval and identify the monitoring service (UptimeRobot) consistently in both `README` and `deployment.md`.
8. **Keep ADR statuses current.** If any ADRs are superseded (e.g., comment storage, version numbering), mark them `superseded` or add a “Consequences / updates” section so the decision records stay reliable.
