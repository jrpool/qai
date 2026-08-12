# Sprint 4, Review, part 2

This is a review by SWE-1.7 Medium.

## Request

Compare my README, architecture document, manual verification notes, AI implementation review, and current implementation. Identify inconsistencies, missing information, and documentation that no longer reflects the project.

## Planning

I’ll review the relevant docs and the current implementation, then flag inconsistencies and stale documentation. Let me start by finding the files you mentioned.

I reviewed the four documents you named and the current source. Here are the inconsistencies, missing information, and stale documentation I found.

## Cross-cutting inconsistencies

- **Version number mismatch**: `package.json` says the project is at `1.0.0`, while `docs/architecture.md` calls the current release `0.3.0`. The README does not state a version at all.
  - `package.json`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" lines="3" />
  - `docs/architecture.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="7" />

- **Code coverage claim is wrong**: Both the README and `manual-verification.md` claim 100% c8 coverage, but `package.json` sets the c8 thresholds at 90/90/88/90.
  - README: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" lines="21-22" />
  - `manual-verification.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/manual-verification.md" lines="19" />
  - `package.json`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" lines="28-32" />

- **Test count is outdated**: `manual-verification.md` says `src/requestHandler.test.ts` contains 6 unit tests (10 total with `util.test.ts`). It actually contains 13, and `util.test.ts` contains 4, for 17 total.
  - `manual-verification.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/manual-verification.md" lines="13-14" />

- **Maintainer alerting is not implemented**: The acknowledgement page tells the user the maintainer has been notified, but `src/requestHandler.ts` only persists the comment to `db/comments.json` and logs to the console; it never sends an alert.
  - `public/comment-ack.html`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/public/comment-ack.html" lines="16" />
  - `src/requestHandler.ts`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="119-145" />

## README issues

- **Broken/missing document links**:
  - Links to `docs/ai-implementation.md` (line 44), but the actual file is `docs/ai-implementation-review.md`.
  - Links to `docs/progress-reports.md` (line 48), but progress reports are now files inside `docs/progress-reports/`.
  - README: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" lines="44-48" />

- **Current status is incomplete**:
  - It lists “An HTML page for comment submission” but does not mention the new `comment-ack.html` acknowledgement page or the `/comment` POST endpoint.
  - It still lists “Alerting of the maintainer on submission of comments” under “next functionalities,” but comment submission itself has already been implemented (only the alerting part is missing).
  - README: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" lines="13-33" />

- **Setup instructions are missing a step**: `npm start` runs `node --env-file=.env src/main.ts`, but the repo contains only `.env.example`. The README does not tell the user to create `.env` from `.env.example`.

## Architecture document issues

`docs/architecture.md` is the stalest document and no longer reflects the current implementation:

- **Version**: still calls the release `0.3.0`.
  - `docs/architecture.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="7" />

- **Comment form**: it describes the comment page “with submission disabled.” The form now submits and is fully handled.
  - `docs/architecture.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="18" />

- **Comment storage**: it says persistent storage is the “origin repository,” but the implementation writes to a local `db/comments.json` file.
  - `docs/architecture.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="19" />

- **Data flow**: “Comments: Flow from Node.js server to origin repository” is incorrect.
  - `docs/architecture.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="61" />

- **Page count**: it describes “a 2-page HTML5 website,” but there are three HTML pages (`tutorial.html`, `comments.html`, `comment-ack.html`).
  - `docs/architecture.md`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="75" />

- **Future components**: version 1.1.0 lists “Internal observability: logging, monitoring, and alerting of comment-submission events and errors.” Console logging now exists, but alerting does not, so this is partially implemented but not complete.

## Manual verification issues

`docs/manual-verification.md` is dated 2026-07-19 and is now behind the implementation:

- **Outdated revision date** (line 3). The current date is 2026-08-05, and the code has changed since.
- **Wrong test counts** (lines 13-14): `requestHandler.test.ts` now has 13 tests, not 6.
- **Wrong coverage requirement** (line 19): claims 100% coverage, but thresholds are lower.
- **Incomplete content verification** (lines 60-62): it verifies the thank-you page renders with the comment, but does not verify that a notification is actually sent. Because no notification is sent, this verification step would miss a functional gap.
- **`tsconfig.json` `skipLibCheck`** is still enabled as a “temporary evasion” described in lines 75-76, and the document does not indicate whether it is still needed.

## AI implementation review issues

`docs/ai-implementation-review.md` is internally consistent, but it does not reflect recent work:

- It does not mention the comment-submission feature or the tests that support it.
- It does not mention the 1.0.0 release or the current state of the project.
- It references the `ecosystem.json` change, but there is no discussion of the AI assistance that produced the current comment handling and test mocking (e.g., `mkdtempDisposable`, isolated per-test servers in `src/requestHandler.test.ts`).

## Notable implementation-specific issue not captured in docs

- `src/requestHandler.ts` returns `200` and serves `comment-ack.html` saying the maintainer was notified, yet no notification is sent. This is both a functional gap and misleading content.
  - `src/requestHandler.ts`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="137-145" />
  - `public/comment-ack.html`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/public/comment-ack.html" lines="16" />

- `src/main.ts` points to `db/comments.json` as the comment store, contradicting the architecture’s claim that the origin repository is the store.
  - `src/main.ts`: <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/main.ts" lines="11" />

If you want, I can propose updates for any of these documents in the next step.
