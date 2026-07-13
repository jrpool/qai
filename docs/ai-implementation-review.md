# QAI: AI implementation review

## AI implementation assistance

The design, implementation, deployment, and documentation of this application have been assisted at every stage by artificial intelligence (AI) platforms.

The assistance has been incremental rather than comprehensive. This means that:

- The developer has defined the purposes, audience, value proposition, functionalities, and technical stack.
- During some such definitions, the developer has presented alternatives for AI evaluation.
- After each such definition has been drafted, the developer has requested AI review and has made revisions on the basis of review results.
- The developer has not asked any AI platform to undertake any such definition draft from its beginning.

In all cases, the developer has invoked “Ask” mode and not “Code” mode while obtaining AI assistance. Nonetheless, the developer has in some cases, after scrutiny, copied code proposals made by AI platforms and pasted them into the codebase.

## AI engineering review

The developer has obtained AI reviews of the documentation and of the conformity of the implementation to the requirements and decisions described in the documentation. The reviews have resulted in documentation improvements and implementation revisions.

## Accepted suggestion

The developer has accepted most suggestions made by AI platforms during requested reviews, but not without scrutiny.

One example of an accepted suggestion is to store the PM2 process manager’s configuration in a file named `ecosystem.json` instead of `.config.cjs`.

The evolution of that suggestion was not simple. The AI platform initially recommended a `.config.cjs` file for reasons that were not persuasive. The developer challenged the reasoning, and the AI platform responded: “You're right to question that — I was wrong. A JSON file would actually avoid the type problem entirely.”

## Rejected/postponed suggestion

The developer has rejected or postponed few suggestions made by AI platforms during requested reviews.

One example of a rejected suggestion is the suggested decrease of the required code coverage by the automated tests to a fraction less than 99%. The basis for the suggestion was that lower coverage requirements are common in software projects. The developer considered this a poor justification for setting a coverage requirement. The developer decided that being required to explicitly exempt lines from coverage for appropriate reasons is a valuable discipline.

## Manual verification after AI review

The developer has performed verifications after code changes, including changes that implement AI suggestions.

## Engineering responsibility statement

The developer assumes the entire responsibility for the design, implementation, deployment, and documentation of this application.

It would be unrealistic to claim that absolutely no delegation of authority to AI platforms takes place during the development of this, or any AI-assisted, software project. The extent of such delegation varies with the trust that AI platforms have earned, the criticality of the task, and the desire of the developer to acquire personal competence in particular technologies. Any delegation, however, leaves accountability with the developer.
