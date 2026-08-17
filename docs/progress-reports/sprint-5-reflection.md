# Sprint 5 reflection

This document reports on the progress made in this project during Sprint 5 in University of Oregon CS 399, under whose auspices this project is being developed.

## Sprint purpose

### Most valuable feedback

The main recommendations received from reviewers about Sprint 4 were:

- Add tests for failure modes.
- Make the project history more transparent.
- Add detail to the installation and running instructions in `README.md`.
- Make the documentation about persistence clearer.
- Keep or revise the promise to notify the manager of submitted comments.
- Sanitize user input before it is rendered to prevent injection attacks.

I consider all of them appropriate. I find the last one on security the most valuable.

### Improvements made

- Sanitization: I added sanitization to comments before they are rendered on the web and also before they are transmitted to the manager by email. Human testing showed that even plain-text email messages are treated as HTML by some email clients.
- I kept the notification promise by adding alerting of the manager about comment submissions.
- I added automated tests for the new features and for failure modes.
- I updated the documentation to reflect the current state of the project.
- I added a Sprint 5 progress report to help make the project history visible.

The last two recommendations, for promise keeping and attack prevention, had the greatest impact.

The project now does what it says and says what it does. Potential further improvements are described as such.

### Engineering judgment

I decided to postpone improvements in the clarity of the documentation for other developers. As this project evolves, it may get joined to its related Kilotest project as a feature of that project. I have not yet decided or even begun evaluating that possibility, but, if the project evolves in that direction the instructions will change drastically.

### Looking back

One engineering decision that I made over resistance was the decision to require explicit exclusion of code lines from a 100% `c8` coverage requirement. The AI advice about this was uniformly skeptical, with recommendations to set coverage minima at 85% or 90%, but it seemed to be based on common developer behavior rather than principles. In the end, `c8` has been authorized to ignore only 9 lines of code. Testing, in my judgment, has been made more rigorous by this decision.

### Looking forward

My next priority is to do more research on how AI platforms discover and use external tools.

The technologies of tool use are changing rapidly, and the number of platforms and models is also growing. An application like QAI becomes useless if changes in technology render the methods that it teaches obsolete.
