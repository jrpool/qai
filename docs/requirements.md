# QAI: requirements

## Functional requirements

The first release of QAI should explain and show a literate but nontechnical user how to connect LLMs to tools:

- on the `Claude Desktop`, `claude.ai`, and `Perplexity Pro` AI platforms
- with one method: registration of a streaming-HTTP MCP server requiring no authentication as a custom connector
- statically, with only text and images
- with the tools provided by the Kilotest MCP server as the example
- with an opportunity to submit comments, including suggestions for improvement

## Data requirements

The initial system needs to anticipate future extension by storing rudimentary structured data about user options, namely:

- AI platforms
- methods
- tutorial formats
- domains

The initial system needs to capture any user comments and permit the maintainer to:

- be notified of their arrival
- delete them when disposed of

Initially, the maintainer assumes responsibility for, optionally, converting user comments into issues in the repository.

## Nonfunctional requirements

The project should begin with:

- a minimalistic architecture
- few dependencies
- minimal styling

A new user should be able to use the system by visiting its URL with any current web browser, with no prerequisites, installations, configuration, or prior study. Development of later versions will be dependent on trials of the first version with realistic users not affiliated with the project and collection of their comments. Therefore, QAI must, from the first version, be visitable on the public Internet.

The system should conform to all commonly accepted web accessibility standards and best practices, as operationalized by Kilotest, and its pages should therefore be issue-free in Kilotest testing.

The system should conform to the current HTML5 and CSS3 specifications.

## Scope requirements

The initial system should not perform functions beyond those described above as functional requirements. For example, it should not:

- cover AI platforms other than `Claude Desktop`, `claude.ai`, and `Perplexity Pro`
- cover methods other than registration of a streaming-HTTP MCP server requiring no authentication as a custom connector
- include video
- offer options to users other than links
- adapt its content to user behavior, other than link activation
- cover tools other than those provided by the Kilotest MCP server
- obtain identities or contact information from users
- require any authentication
