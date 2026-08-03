import {createServer} from 'node:http';
import {makeHandler} from './requestHandler.ts';
import {log} from './util.ts';
import {join} from 'node:path';

const PORT = process.env.PORT ?? 3001;

// Create a server and make it listen for requests.
createServer(makeHandler(join(__dirname, '..', 'db', 'comments.json'))).listen(PORT, () => {
  log('info', 'listening', PORT);
});
