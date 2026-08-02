# Sprint 4, Studio

This document reports on the progress made in this project during the independent studio of Sprint 4 for University of Oregon CS 399, under whose auspices this project is being developed.

## Preparation

### One important capability or workflow you plan to complete or stabilize

Comment form

### At least two project behaviors that may be worth testing

1. Comment form submission updates comments file.
2. Comment form submission alerts maintainer.
3. Conformance of the tutorial page and the comment page to front-end quality rules tested by Kilotest.

### One possible refactoring or maintainability improvement

Conversion of comments file into a table in a database that can also store analytics.

## Part 1: Software confidence

Of the existing evidence types:

- The type that gives me the greatest confidence is the `check` script.
- The type that gives me the least confidence is the fact that the tutorial page is renderend when I navigate to the deployed application.

The evidence that would be most expensive to obtain repeatedly is evidence that following the tutorial instructions accomplishes what the tutorial says that it accomplishes.

An LLM (GLM-5.2 High) was consulted about this type of evidence. Advice was received about a set of possible tests, some easy and cheap and others hard and costly.

The LLM conversation follows:

### Cascade Chat Conversation

  Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

#### User Input 1

I am developing QAI and am being asked to reflect on the quality of the testing that it has incorporated up to now. My intuitive conclusion is that the HTML hinting, TypeScript linting, unit tests,  test coverage requirements, and branch-protection ruleset are reasonably strong for a project still in early development, but that one serious testing gap dominates all others: the lack of any automated testing of the correctness of the tutorial. A good automated test would determine whether the a user who implements the instructions in the tutorial accomplishes the success that the tutorial promises. Can you think of ways to automate such testing? And do you agree that it is the most important missing test?

#### Planner Response 1

Let me explore the project to understand its current testing setup and the tutorial before giving you my assessment.

Found code context

Listed directory [qai](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai)

#### Planner Response 2

Let me examine the testing configuration, CI workflows, and progress reports to get the full picture.

Viewed [package.json](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json)

Viewed [.htmlhintrc](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.htmlhintrc)

Viewed [eslint.config.mjs](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/eslint.config.mjs)

Listed directory [.github](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.github)

Listed directory [docs](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs)

Listed directory [workflows](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows)

Listed directory [rulesets](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/rulesets)

Viewed [sprint-4-studio.md](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/progress-reports/sprint-4-studio.md)

Viewed [manual-verification.md](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/manual-verification.md)

Viewed [checks.yaml](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows/checks.yaml)

Viewed [qai-main.json](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/rulesets/qai-main.json)

Viewed [future.md](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/future.md)

#### Planner Response 3

Now I have a full picture of the project's testing landscape. Here's my assessment.

### Current testing inventory

Your project has:

- **HTMLHint** with 40+ rules in `@/Users/pool/Documents/Topics/repos/a11yTesting/qai/.htmlhintrc`
- **ESLint** with `@stylistic` for TypeScript style enforcement (`@/Users/pool/Documents/Topics/repos/a11yTesting/qai/eslint.config.mjs`)
- **TypeScript strict mode** via `tsc --strict`
- **10 unit tests** across `requestHandler.test.ts` and `util.test.ts`
- **100% coverage gate** enforced by c8 (`@/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json:25-30`)
- **CI workflow** running `npm run check` on every PR to main (`@/Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows/checks.yaml`)
- **Branch-protection ruleset** requiring the `checks` status check, squash merges, and linear history (`@/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/rulesets/qai-main.json`)

What all of these test is the **delivery mechanism**: the server serves the right files, the code is well-formed, the HTML is valid. None of them test the **core value proposition**: that following the tutorial's instructions actually produces the promised outcome.

### Do I agree it's the most important missing test?

**Yes, with one caveat.** The tutorial is the product. If it silently breaks — because Claude.ai changes its UI labels, or the Kilotest MCP URL changes, or Claude's tool-use behavior shifts — no existing test catches it. You already noted in `@/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/progress-reports/sprint-4-studio.md:27` that this evidence is the most expensive to obtain repeatedly, which is precisely why it should be automated.

The caveat: there's a **second gap worth considering as equally important** — the lack of automated accessibility testing. Your requirements (`@/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/requirements.md:39`) state the system should be "issue-free in Kilotest testing," yet no Kilotest test runs in CI. The project is about Kilotest and doesn't use Kilotest to test itself automatically. That said, this gap is more straightforward to close (you have the MCP tools available), while tutorial-correctness testing is harder, so it's reasonable to prioritize the tutorial gap as the dominant concern.

### Approaches to automating tutorial-correctness testing

The tutorial's correctness has two dimensions, and they call for different strategies:

#### 1. Referential correctness — do the UI elements and paths described still exist on claude.ai?

The tutorial at `@/Users/pool/Documents/Topics/repos/a11yTesting/qai/public/tutorial.html:36-49` instructs users to click "Customize," then "Connectors," then "Add custom connector," and fill in specific form fields. If Anthropic renames or restructures any of these, the tutorial becomes wrong silently.

**Approach: Playwright-based UI element verification.** Use Playwright to log into claude.ai with stored credentials (GitHub Secrets), navigate to the connector-adding flow, and assert that each referenced UI element exists with the expected label. This is a browser automation test that mirrors the tutorial's steps but checks for element presence rather than completing the full flow.

- **Pros**: Directly tests what the tutorial describes; catches UI breakage early.
- **Cons**: Requires Claude account credentials in CI; fragile when Anthropic changes their UI (but that fragility is the **point** — it alerts you to needed tutorial updates); may need to run on a schedule (e.g., daily) rather than per-PR to avoid flaky failures blocking development.

#### 2. Functional correctness — does configuring the Kilotest MCP connector actually result in tool use?

The tutorial at `@/Users/pool/Documents/Topics/repos/a11yTesting/qai/public/tutorial.html:52-58` promises that after following the instructions, asking "What quality issues exist on the World Wide Web Consortium home page?" will result in the LLM using Kilotest tools.

**Approach A: API-level MCP integration test.** Instead of driving the claude.ai web UI, use the Claude API (or an MCP client library) to register the Kilotest MCP server at `https://kilotest.com/mcp`, submit the test question, and inspect the response for evidence of Kilotest tool calls. This tests the functional outcome without the fragility of web UI automation.

- **Pros**: More stable than UI testing; tests the actual capability; can run in CI.
- **Cons**: Tests the API path, not the web UI path — a gap between what the tutorial describes and what the test exercises; requires an Anthropic API key (which may cost money per run).

**Approach B: Full end-to-end Playwright test.** Drive a real browser through the entire tutorial flow: log in, add the connector, submit the test question, and verify the response mentions Kilotest tool usage. This is the gold standard but the most expensive and fragile.

- **Pros**: Tests exactly what the user experiences; catches both referential and functional breakage.
- **Cons**: Slow, flaky, requires credentials, costs API usage, and may be impractical for per-PR CI. Better suited to a scheduled nightly job.

#### 3. A practical incremental path

Given the project's minimalist philosophy, I'd recommend a layered approach, starting cheap and adding expense only as value is proven:

- **Layer 1 (cheapest, do first)**: An automated test that the Kilotest MCP URL (`https://kilotest.com/mcp`) is reachable and responds to a standard MCP handshake. This catches the most common functional failure (the URL changes or the server goes down) with zero credentials and minimal flakiness. It could be a unit test in your existing Node.js test runner.
- **Layer 2 (medium cost, do second)**: A Playwright test that logs into claude.ai and verifies the presence of the UI elements the tutorial references ("Customize," "Connectors," "Add custom connector," the form inputs). Run on a schedule (not per-PR) to avoid blocking development with third-party UI flakiness.
- **Layer 3 (highest cost, do last if at all)**: A full end-to-end Playwright test that completes the entire tutorial flow and verifies Kilotest tool use in the response. Run nightly or weekly.

#### 4. A complementary static approach

Regardless of the above, you could add a **tutorial content lint** — a test that parses `tutorial.html` and verifies:

- All referenced URLs (e.g., `https://claude.ai/login`, `https://kilotest.com/mcp`) return 200 responses.
- The Kilotest MCP URL in the tutorial matches the one actually being tested.
- UI labels mentioned in the text are internally consistent.

This is cheap, fast, and catches a class of content errors without any browser automation.

---

Would you like me to elaborate on any of these approaches, or shall we start designing the implementation for Layer 1 (the MCP reachability test)? I'd recommend starting there since it's the highest value-to-effort ratio and fits naturally into your existing test suite.

Edited relevant file

Viewed [sprint-4-studio.md](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/progress-reports/sprint-4-studio.md)

#### User Input 2

Yes, testing the QAI pages with Kilotest is on my agenda and not yet implemented. I want to begin that testing, when I do it, with the UI, and automate it only after I automate Kilotest testing in general. Then applying that automation to QAI will be trivial. I have added Kilotest testing to `sprint-4-studio.md` for future reference.

#### Planner Response 4

That's a sensible sequencing — manual Kilotest testing first, then generalize the automation, then apply it to QAI as a trivial step. It avoids building QAI-specific infrastructure that would be better solved once and reused.

That leaves tutorial-correctness testing as the remaining gap to design. Shall I start detailing the implementation plan for Layer 1 (the MCP reachability test), or would you prefer to discuss the overall approach further first?

#### User Input 3

I am also thinking about another scenario: A user has learned about the tutorial and takes a quick look at it. The user decides to save time by asking an AI agent to read and implement the tutorial and to report whether it worked and whether the user can now use the AI platform to check the quality of various web pages. Is that a futuristic fantasy, or do some AI agents already have the ability to fulfill such a request?

#### Planner Response 5

This is a timely question, and it's directly relevant to the testing gap we've been discussing.

### Current state of the art

**The technology exists, but the specific task sits at the edge of practical reliability.** Here's what's real today:

#### Agents with browser automation capability

- **Claude Computer Use** (Anthropic, Oct 2024): Claude can screenshot a screen, identify UI elements, click, type, and navigate web pages. It's designed for exactly this kind of "follow instructions to accomplish a task on a computer" scenario.
- **OpenAI Operator** (Jan 2025): A browser-using agent that navigates websites and completes tasks.
- **Devin** (Cognition): An AI software engineer agent with browser, terminal, and code editor access.
- **Browser-use** (open source): Combines LLMs with Playwright for agent-driven browser automation.

All of these can, in principle, read a tutorial page, parse its instructions, navigate to a URL, click buttons, fill forms, and report results.

#### Where this specific tutorial would break down

The tutorial at `@/Users/pool/Documents/Topics/repos/a11yTesting/qai/public/tutorial.html:33` instructs the user to navigate to `https://claude.ai/login` and create an account via Google or email. This is the hard part:

- **Authentication is the primary barrier.** Google OAuth flows, email verification, and CAPTCHAs are deliberately designed to block automated agents. Computer-use agents can handle simple login forms with stored credentials, but account **creation** with OAuth or email verification is a significant challenge.
- **Dynamic UI navigation is feasible but fragile.** The multi-step click sequence (Customize → Connectors → Add custom connector → fill form → submit) is within current agent capabilities, but claude.ai's UI is dynamic and may render differently than a screenshot-based agent expects.
- **Verifying tool use in the response** is the easiest part — an agent can read the response text and determine whether Kilotest tools were invoked.

#### The realistic scenario today

**Semi-autonomous, not fully autonomous.** A user could give an agent like Claude Computer Use or Operator the tutorial URL along with pre-authenticated browser session credentials (cookies for an existing claude.ai account). The agent could then:

1. Read the tutorial
2. Navigate to claude.ai (already logged in)
3. Follow the connector-adding steps
4. Submit the test question
5. Report whether Kilotest tools were used

This is achievable today, though with some flakiness. The fully autonomous version — where the agent also creates the account from scratch — is not reliable yet.

#### Relevance to your testing strategy

This is actually a **third approach** to tutorial-correctness testing that I didn't mention earlier: instead of writing a Playwright script that hard-codes the tutorial steps, you could use a computer-use agent that **reads the tutorial and decides for itself what steps to take**. The advantage is that the test would break not just when the UI changes, but when the **tutorial instructions themselves** become ambiguous or insufficient for an agent to follow — which is a proxy for whether a human could follow them too.

The disadvantage is cost (each run consumes LLM tokens), flakiness (agent behavior is non-deterministic), and the authentication barrier. But this approach is more aligned with your project's mission: if an AI agent can't follow your tutorial, that's a strong signal that a nontechnical human will struggle too.

**Bottom line**: Not a futuristic fantasy. The pieces exist today. A fully hands-off "read and implement" agent test is impractical due to authentication, but a semi-autonomous version (with a pre-authenticated session) is feasible now and likely to become more reliable over the next year. If you're building a testing roadmap, this is worth noting as a near-term option rather than a distant one.

## Part 2: Completing a capability

- What is currently incomplete, uncertain, or unreliable? The comment form.
- What is the smallest useful completion or stabilization step? A route and a handler for comment submissions.
- Does the work complete an existing capability or begin an unrelated feature? It partly completes an existing capability. It does not complete the alerting part of that capability.
- What existing behavior must remain unchanged? All existing behaviors except the instructions stating that the comment form is not yet operational.
- What new behavior must be verified after the work is complete? The correct updating of the comments file whenever a comment is submitted.

## Part 3: Designing test cases

Behavior to be tested: Following the comment link on the tutorial page.

Test cases:

- Normal: Comment page appears when the client requests the link destination.
- Edge: Client appends a `/` to the URL, but the comment page still appears.
- Failure: Client requests a misspelled URL. The server returns a 404 error.

In all cases, the test is an automated stateless unit test that starts a new server instance and then makes a request to it. Each test is occasionally replicated by a human user for confidence in the test-automation methods being employed.

## Part 4: AI-generated tests

The recommended progress in this part presupposes the absence of a test suite. QAI already has an extensive test suite. Therefore, I have created a different use of AI assistance for testing.

### AI proposal

The LLM had proposed “an automated test that the Kilotest MCP URL (`https://kilotest.com/mcp`) is reachable and responds to a standard MCP handshake”. I submitted this prompt: “Please draft a layer-1 test that would be added to `src/requestHandler.test.ts`.” The LLM supplied a draft but advised that it should be located in a new module instead. I accepted that advice and asked for a corresponding draft. The LLM provided a draft of a new module:

```typescript
// src/tutorial.test.ts

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'node-html-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getTutorialHTML = async (): Promise<string> => {
  const filePath = join(__dirname, '..', 'public', 'tutorial.html');
  return readFile(filePath, 'utf-8');
};

test('Kilotest MCP URL in tutorial is reachable and responds to initialize handshake', async () => {
  const html = await getTutorialHTML();
  const root = parse(html);
  const codeElements = root.querySelectorAll('code');
  const mcpUrl = codeElements
    .map(el => el.textContent.trim())
    .find(text => text.startsWith('https://kilotest.com/mcp'));
  assert.ok(mcpUrl, 'Tutorial contains the Kilotest MCP URL');
  const response = await fetch(mcpUrl!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: {
          name: 'qai-test',
          version: '0.1.0'
        }
      }
    }),
    signal: AbortSignal.timeout(10000)
  });
  assert.equal(response.status, 200);
  const contentType = response.headers.get('content-type') ?? '';
  let bodyText: string;
  if (contentType.includes('text/event-stream')) {
    const text = await response.text();
    const dataLine = text.split('\n').find(line => line.startsWith('data:'));
    assert.ok(dataLine, 'SSE response contains a data line');
    bodyText = dataLine!.slice(5).trim();
  } else {
    bodyText = await response.text();
  }
  const payload = JSON.parse(bodyText) as {
    jsonrpc: string;
    id: number;
    result: {
      protocolVersion: string;
      serverInfo: {name: string};
    };
  };
  assert.equal(payload.jsonrpc, '2.0');
  assert.equal(payload.id, 1);
  assert.ok(payload.result, 'Response contains a result');
  assert.ok(payload.result.protocolVersion, 'Result contains protocolVersion');
  assert.ok(payload.result.serverInfo, 'Result contains serverInfo');
});
```

The LLM added these design notes:

- **Extracts the URL from `tutorial.html`** rather than hard-coding it. If the tutorial's URL changes, the test checks the new URL automatically. If the URL is removed entirely, the test fails with a clear assertion message.
- **No server dependency**: Unlike the [requestHandler.test.ts](cci:7://file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.test.ts:0:0-0:0) tests, this test reads the HTML file directly from disk — no need to start the server.
- **Imports**: Uses `node:test`, `node:assert/strict`, `node:fs/promises`, `node:path`, `node:url`, and `node-html-parser` — all already in your dependency tree.
- **Coverage**: This file won't count toward the c8 coverage of `requestHandler.ts` or `util.ts`, which is correct — it tests tutorial content, not server code. Your c8 config targets `--check-coverage` globally, but c8 only measures files that are imported during the test run, so this file's lack of coverage impact on source files is fine.

### What to verify after adding

If the proposed test is added, I can verify it by running `npm test` and confirming:

1. The new test passes (assuming Kilotest is online).
2. The existing 10 tests still pass.
3. c8 coverage reporting still shows 100% for `requestHandler.ts` and `util.ts`.

### Critique

My initial critique of the proposal is this: The proposed test reads and parses the tutorial page as a file. This is intended to make the test immune to changes in the URL of the page, but it does not make the test immune to a change of the file name or file location in the filesystem, or to changes in the MCP server URL disclosed by the page. It seems unwise to me to try to make unit tests immune to changes in the codebase. Codebase changes can be expected to require test changes.

This critique seems fundamental. Therefore, I choose not to add the proposed test, but instead to extend the conversation with the LLM during Sprint 5 to understand the rationale for the proposal and make a well-informed decision on it.

## Part 5: Investigating a failing test

One test in `src/requestHandler.test.ts` verifies that the applicationn returns a 404 status error if the path is invalid. The test submits a request with an invalid path. If that path becomes valid, the test will fail with this message:

```text
✖ failing tests:

test at src/requestHandler.test.ts:33:1
✖ GET request to bad path (/blah) gets status 404 (1.751708ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  200 !== 404
```

That message will identify the failing test and permit a correction of the test.

## Part 6: Refactoring with a safety net

I obtained AI assistance in identifying candidates for refactoring. The recommended top candidate was the `handler` function in the `requestHandler.ts` file. That function “mixes routing, content-type resolution, file I/O, and response writing”. The LLM recommended creating “separate resolveContentType(file) and serveFile(res, file) helpers”. The benefits of such a refactoring were described as including more granular testability and less error-vulnerable code.

The candidates described by the LLM, in descending order of estimated impact, were:

1. **Split `handler` into single-responsibility helpers.**
   `requestHandler.ts` currently mixes routing, content-type resolution, file I/O, and response writing in one function. The `file.split('.').pop()!` lookup and the `readFile`/`writeHead`/`.end` block are good candidates for separate `resolveContentType(file)` and `serveFile(res, file)` helpers. That also removes the non-null `!` and makes the extension logic unit-testable.
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="29-56" />

2. **Unify response handling between success and error paths.**
   `handleError` in `util.ts` calls `res.writeHead(statusCode)` with no `Content-Type`, while the success path sets one. A shared `sendResponse(res, statusCode, body, contentType)` helper, or at least adding `text/plain` to errors, would make the two paths consistent and easier to extend.
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/util.ts" lines="34-41" />
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="48-51" />

3. **Extract the public directory to a named constant.**
   `join(__dirname, '..', 'public', file)` is computed inline. A `PUBLIC_DIR` constant at the top of `requestHandler.ts` would make the file-serving intent clearer and the path easier to change.
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="11-18" />
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="47-48" />

4. **Reduce repetition in `requestHandler.test.ts`.**
   The status and title tests for `/` and `/comments` repeat the same `fetch`/`parse`/`querySelector` sequence. A `getTitle(path)` helper would collapse the four near-identical test cases.
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.test.ts" lines="23-52" />

5. **HTML `<head>` duplication.**
   `tutorial.html` and `comments.html` share an identical `<head>` block and surrounding page structure. If the site grows beyond two pages, a shared template/partial would reduce that duplication.
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/public/tutorial.html" lines="1-13" />
   <ref_snippet file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/public/comments.html" lines="1-13" />

## Part 7: Build a Sprint 4 quality plan

1. Capability: Make the comments page a working, submittable form whose submission updates a comments file.
2. Existing behavior: The tutorial and comments pages must continue to be rendered on request.
3. New behavior: The comments page must accept form submissions and update the comments file.
4. Automated tests: The best evidence of success will be passed tests of:
   - Content of the comments page
   - Content of the acknowledgement of the submission of the comment form
   - Correct updating of the comments file upon submission of the comment form
5. Manual verification: A user will visit the tutorial page, follow the link to the comments page, and submit a comment. The comments file will be inspected before and after the submission.
6. AI assistance for the added functionalities and tests will be obtained and scrutinized.
7. The AI advice on refactoring will be reviewed after the additional tests have been added and then implemented, if approved, for the enhanced codebase.
