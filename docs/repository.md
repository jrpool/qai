# QAI: repository

## Purpose

The purpose of this document is to describe repository management for QAI.

## Host

The host of the [origin repository](https://github.com/jrpool/qai) is GitHub.

## Visibility

The `qai` repository on GitHub is public.

The QAI maintainer authenticates with a personal access token when required by GitHub.

- On the deployment host, the QAI maintainer (`linuxuser`) has configured an SSH key pair.
- On GitHub, the public key of that pair has been added as a deploy key to the QAI repository, with read but not write permission.

## Branch protection

The `main` branch is protected by the `qai-main` ruleset, a copy of which is stored at `docs/rulesets/qai-main.json`. That ruleset requires successful checks before a pull request is merged into `main`. The checks are defined in `.github/workflows/checks.yaml`.
