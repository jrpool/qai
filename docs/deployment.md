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

## Process management

The PM2 process manager is installed globally on the deployment host and configured separately in each service. For QAI, the configuration is in the `ecosystem.json` file.

After updates, QAI is restarted with `pm2 restart qai`.

If any corruption requires recreating the QAI service in PM2, use:

```bash
pm2 delete qai
pm2 start ecosystem.json
```

At present QAI has no run-time dependencies, so after the main branch is modified in the origin repository the deployment can be updated with `git pull` and then `pm2 restart qai`. No `npm update` statement is required.

## Request management

The `Caddyfile` shown in the Kilotest `SERVICE.md` file includes a modification that provides request forwarding to QAI, which listens on port 3001.

If the port configured by the `.env` file were to change, the `Caddyfile` port for QAI would need to be updated accordingly.

## Health

The health of the deployment is monitored by [UptimeRobot](https://dashboard.uptimerobot.com/monitors/803546556). That services checks `https://kilotest.com/qai` once per hour and sends an email message to the maintainer in either of two cases:

- The response status code is 502. In that case, the message says `Root cause: HTTP 502 - BAD GATEWAY`.
- The response times out. In that case, the message says `Root cause: CONNECTION TIMEOUT`.

The service sends another message saying `The latest incident has been resolved and your monitor is up again` after a successful check after an unsuccessful one.
