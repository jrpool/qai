# QAI: repository

## Purpose

The purpose of this document is to describe repository management for QAI.

## Host

The host of the [origin repository](https://github.com/jrpool/qai) is GitHub.

## Visibility

The `qai` repository on GitHub was initially private, but is now public.

When the visibility was private, that visibility prevented anonymous users from fetching it and therefore required the QAI maintainer to authenticate with a personal access token when cloning or pulling a branch. That requirement was avoided by means of SSH:

- On the deployment host, the QAI maintainer (`linuxuser`) had configured an SSH key pair.
- On GitHub, the public key of that pair had been added as a deploy key to the QAI repository, with read but not write permission.
- On the local host, the remote repository access protocol had been changed from `https` to `ssh` with: `git remote set-url origin git@github.com:jrpool/qai.git`.

Those settings are compatible with public visibility, too.

## Branch protection

The `main` branch is protected by the `qai-main` ruleset, a copy of which is stored at `docs/rulesets/qai-main.json`. That ruleset requires successful checks before a pull request is merged into `main`. The checks are defined in `.github/workflows/checks.yaml`.
