# Sprint 5 demo

## Project Overview

- What problem does your project solve? Users of AI platforms do not know how to make LLMs give correct answers totechnical questions.
- Who are the intended users? Users like them.
- Why did you choose this project? I am maintaining an MCP server and want LLMs to use it when it will improve answer quality.

## Software Demonstration

- Demonstrate one or more important workflows. Tutorial page, Comment page, comment submission.
- Explain what the software is doing.
- Show the project working successfully.

## Architecture

- Explain the major components. Node.js server; HTML5 pages; comments file; external monitoring and alerting.
- Describe how data flows through the system. Comments: browser to server to (A) filesystem and (B) alerting service.
- Discuss one architectural decision that significantly influenced your implementation. File-system storage simplifies persistence.

## Testing and Verification

- Describe how you verified that your software works correctly. TSC, HTMLHint, ESLint, node:test, node-html-parser, c8.
- Discuss any important issues you discovered and how you addressed them. Injection; sanitization.

## AI Collaboration

- Describe how AI assisted your engineering work. All aspects.
- Explain one example where you accepted AI recommendations. Collect application code in src directory.
- Explain one example where you rejected or modified AI recommendations. Added missing assertions to tests.

## Engineering Reflection

- What engineering decision are you most proud of? Stick to latest versions of dependencies.
- What was the most challenging part of the project? Test coverage.
- If you continued the project, what would you build next? More versatile tutorial.
