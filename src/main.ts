// main.ts

// IMPORTS

import {createServer} from 'node:http';
import {makeHandler} from './requestHandler.ts';
import {makeSendAlert} from './alerts.ts';
import {log} from './util.ts';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

// CONSTANTS

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 3001;
// Creator of an alert sender from the environment configuration.
const sendAlert = makeSendAlert({
  protocol: process.env.ALERT_PROTOCOL as 'http' | 'https' | undefined,
  managerEmail: process.env.MANAGER_EMAIL,
  apiHost: process.env.ALERT_API_HOST,
  apiPath: process.env.ALERT_API_PATH,
  apiKey: process.env.ALERT_API_KEY,
  from: process.env.ALERT_FROM
});

// EXECUTION

// Create a server and make it listen for requests.
createServer(makeHandler(join(__dirname, '..', 'db', 'comments.json'), sendAlert))
.listen(PORT, () => {
  log('info', 'listening', PORT);
});
