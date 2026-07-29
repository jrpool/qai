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

*Viewed [package.json](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json) *

*Viewed [.htmlhintrc](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.htmlhintrc) *

*Viewed [eslint.config.mjs](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/eslint.config.mjs) *

*Listed directory [.github](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.github) *

*Listed directory [docs](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs) *

*Listed directory [workflows](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows) *

*Listed directory [rulesets](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/rulesets) *

*Viewed [sprint-4-studio.md](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/progress-reports/sprint-4-studio.md) *

*Viewed [manual-verification.md](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/manual-verification.md) *

*Viewed [checks.yaml](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows/checks.yaml) *

*Viewed [qai-main.json](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/rulesets/qai-main.json) *

*Viewed [future.md](file:///Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/future.md) *

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
- **Cons**: Requires Claude account credentials in CI; fragile when Anthropic changes their UI (but that fragility is the *point* — it alerts you to needed tutorial updates); may need to run on a schedule (e.g., daily) rather than per-PR to avoid flaky failures blocking development.

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

- **Authentication is the primary barrier.** Google OAuth flows, email verification, and CAPTCHAs are deliberately designed to block automated agents. Computer-use agents can handle simple login forms with stored credentials, but account *creation* with OAuth or email verification is a significant challenge.
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

This is actually a **third approach** to tutorial-correctness testing that I didn't mention earlier: instead of writing a Playwright script that hard-codes the tutorial steps, you could use a computer-use agent that *reads the tutorial and decides for itself what steps to take*. The advantage is that the test would break not just when the UI changes, but when the *tutorial instructions themselves* become ambiguous or insufficient for an agent to follow — which is a proxy for whether a human could follow them too.

The disadvantage is cost (each run consumes LLM tokens), flakiness (agent behavior is non-deterministic), and the authentication barrier. But this approach is more aligned with your project's mission: if an AI agent can't follow your tutorial, that's a strong signal that a nontechnical human will struggle too.

**Bottom line**: Not a futuristic fantasy. The pieces exist today. A fully hands-off "read and implement" agent test is impractical due to authentication, but a semi-autonomous version (with a pre-authenticated session) is feasible now and likely to become more reliable over the next year. If you're building a testing roadmap, this is worth noting as a near-term option rather than a distant one.

## Part 2: Completing a capability

- What is currently incomplete, uncertain, or unreliable? The comment form.
- What is the smallest useful completion or stabilization step? A route and a handler for comment submissions.
- Does the work complete an existing capability or begin an unrelated feature? It partly completes an existing capability. It does not complete the alerting part of that capability.
- What existing behavior must remain unchanged? All existing behaviors except the instructions stating that the comment form is not yet operational.
- What new behavior must be verified after the work is complete? The correct updating of the comments file whenever a comment is submitted.
