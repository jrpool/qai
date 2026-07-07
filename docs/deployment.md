# QAI: deployment

## Purpose

The purpose of this document is to support the maintenance of the current deployment of QAI and any future migration of QAI to a new deployment.

## Guest deployment

QAI is currently deployed as a guest of [Kilotest](https://github.com/jrpool/kilotest). The guest deployment makes use of the existing Kilotest infrastructure in order to simplify the deployment of QAI.

The details of the Kilotest deployment are documented in the [Kilotest `SERVICE.md` file](https://github.com/jrpool/kilotest/blob/main/SERVICE.md). The following details supplement that file.

## Node.js prerequisite

The code in QAI is written in TypeScript and not transpiled to JavaScript. Node versions before v23 do not natively execute TypeScript files. The Kilotest host runs Node v24 and thus satisfies this prerequisite.

## Environment variables

The `.env` file is not tracked by Git because in the future it may contain secrets. Therefore, it has been recreated on the deployment host.

## Package management

At present QAI has no run-time dependencies, so after the main branch is modified in the origin repository the deployment can be updated with:

- `git pull`
- `pm2 restart qai`

No `npm update` statement is required.

## Request management

The `Caddyfile` shown in the Kilotest `SERVICE.md` file includes a modification that provides request forwarding to QAI, which listens on port 3001.

If the port configured by the `.env` file were to change, the `Caddyfile` port for QAI would need to be updated accordingly.

## Process management

The PM2 process manager is installed globally on the deployment host and configured separately in each service. For QAI, the configuration is in the `ecosystem.json` file.

After updates, QAI is restarted with `pm2 restart qai`.

If any corruption requires recreating the QAI service in PM2, use:

```bash
pm2 delete qai
pm2 start ecosystem.json
```

## Repository access

The QAI repository on GitHub is private. This prevents anonymous users from fetching it and therefore requires the QAI maintainer to authenticate with a personal access token when cloning or pulling a branch.

That requirement is avoided by means of SSH:

- On the deployment host, the QAI maintainer (`linuxuser`) has configured an SSH key pair.
- On GitHub, the public key of that pair has been added as a deploy key to the QAI repository, with read but not write permission.
- On the deployment host, the remote repository access protocol has been changed from `https` to `ssh` with: `git remote set-url origin git@github.com:jrpool/qai.git`.
