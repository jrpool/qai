import {createServer} from 'node:http';
import {makeHandler} from './requestHandler.ts';
import {log} from './util.ts';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 3001;

// Create a server and make it listen for requests.
createServer(makeHandler(join(__dirname, '..', 'db', 'comments.json'))).listen(PORT, () => {
  log('info', 'listening', PORT);
});
