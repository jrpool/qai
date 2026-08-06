# Sprint 4, Review, part 1

This is a review by SWE-1.7 Medium.

## Request

Review this repository as if you were joining the project for the first time. Identify what is easy to understand, what is confusing, and what information you would need before making changes. Assume that I shall ask for a thorough review later, and this review is an initial one with a brief report that summarily describes no more than 3 examples for each of the three categories of items to be identified.

## Planning

I’ll do a quick exploratory pass over the repository to produce the initial review.

## What is easy to understand

1. **Project purpose and documentation structure.** The `README.md` gives a concise overview of what QAI does, its current status, and a clear list of project documents to consult next. The `docs/` directory is well organized, with separate files for architecture, requirements, deployment, decisions, etc. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md" />

2. **Build and quality workflow.** `package.json` exposes a single `npm run check` script that runs type checking, HTML hinting, linting, and tests, which makes the development loop easy to discover. The GitHub Actions workflow in `.github/workflows/checks.yaml` is equally simple and mirrors that command. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/.github/workflows/checks.yaml" />

3. **Core request handling.** `src/requestHandler.ts` is laid out in a straightforward way: a `routes` map, a `contentTypeMap`, a `POST /comment` handler with validation, and a static-file fallback. The logic is readable without external frameworks. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="14-192" />

## What is confusing

1. **Version numbering inconsistency.** `package.json` declares version `1.0.0`, but `docs/architecture.md` repeatedly describes the current release as `0.3.0` and the first release as a development release beginning at `0.1.0`. It is not obvious which version is authoritative. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="7-81" />

2. **Where comments are actually stored.** The architecture lists the “origin repository” as the component responsible for persistent comment storage, and the data-flow diagram says comments flow from the Node.js server to the origin repository. In the code, however, comments are appended to a local `db/comments.json` file. It is unclear whether the origin repository is intended to be the storage mechanism, a backup, or a future replacement. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/architecture.md" lines="13-38" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/src/requestHandler.ts" lines="80-125" />

3. **Wildcard dependency versions.** `package.json` uses `*` for all `devDependencies`, and `npm ci` is used in CI. While `package-lock.json` can pin resolved versions locally, the wildcard ranges make it harder to know whether the project intentionally floats to latest major versions and whether the lockfile is the intended source of truth. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/package.json" lines="18-27" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/009-dependencies.md" />

## What I would need to know before making changes

1. **Branching and approval workflow.** The project uses a trunk-based model with sprint-specific feature branches, and the `main` branch is protected. I would need the exact branch naming convention, how to get a pull request approved, and who is authorized to merge, so I can follow the course’s required process. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/007-git-workflow.md" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/repository.md" lines="23-25" />

2. **Deployment and environment details.** The code and `ecosystem.json` reference an `.env` file with `PORT`, but the real production setup relies on the Kilotest deployment infrastructure. I would need access to or documentation on how deployments are triggered, what the production host expects, and how to update or restart the deployed instance. <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/deployment.md" /> <ref_file file="/Users/pool/Documents/Topics/repos/a11yTesting/qai/ecosystem.json" />

3. **External monitoring and alerting configuration.** The project has an external monitoring service polling every five minutes and alerting the maintainer on failure. I would need to know which service is used, what endpoint it hits, and how to update the maintainer contact information or add new alert conditions before I modify routes or deployment settings. `@/Users/pool/Documents/Topics/repos/a11yTesting/qai/README.md:27-28` `@/Users/pool/Documents/Topics/repos/a11yTesting/qai/docs/decisions/005-infrastructure-health.md`
