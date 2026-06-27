# QAI: architecture

## Overview

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

## Scope requirements

The initial system should not perform functions beyond those described above as functional requirements. For example, it should not:

- cover AI platforms other than `Claude Desktop`, `claude.ai`, and `Perplexity Pro`
- cover methods other than registration of a streaming-HTTP MCP server requiring no authentication as a custom connector
- include video
- give options to users
- include user interaction
- cover tools other than those provided by the Kilotest MCP server
- obtain identities or contact information from users
- require any authentication
