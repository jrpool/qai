# QAI: requirements

## Functional requirements

The first useful version of QAI should explain and show a literate but nontechnical user how to connect LLMs to tools:

- on the `Claude Desktop`, `claude.ai`, and `Perplexity Pro` AI platforms
- with one method: registration of a streaming-HTTP MCP server requiring no authentication as a custom connector
- statically, with only text and images, but no video and no user interaction
- with the tools provided by the Kilotest MCP server as the example
- with an opportunity to submit comments, including suggestions for improvement

## Data requirements

The initial system needs to anticipate future extension by storing rudimentary structured data about user options, namely:

- AI platforms
- methods
- tutorial formats
- Domains

The initial system needs to capture any user comments and permit the maintainer to:

- be notified of their arrival
- delete them when disposed of

Initially, the maintainer assumes responsibility for, optionally, converting user comments into issues in the repository.

## Nonfunctional requirements

The project should begin with:

- a minimalistic architecture
- few dependencies
- simplistic styling

The new user should be able to use the system by visiting its URL with any current web browser, with no prerequisites, installations, configuration, or prior study.

The system should conform to all commonly accepted web accessibility standards.

The system should conform to the current HTML5 and CSS3 specifications.

## Motivation

The author of QAI is the maintainer of a set of tools for LLMs. Early testing revealed that these tools could let LLMs give dramatically more comprehensive and accurate answers to relevant questions, but only after preparation by the user. The user needed to ensure that the LLMs have access to the tools. That discovery motivates QAI.

## Initial scope

The initial scope of QAI is limited in these ways:

- Target platforms: QAI initially will show you how to connect LLMs to tools on **a few AI platforms**.
- Methods: QAI initially will show you **one method** for connecting LLMs to tools.
- Tutorial format: QAI initially will be **static**, with only text and images, but no video and no interaction with you.
- Domain: QAI will initially select a **single technical topic** as an example.

A limited initial scope will permit rapid prototyping, so you can try QAI out soon and provide comments and suggestions for improvement.
