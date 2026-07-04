import {createServer} from 'node:http';
import {handler} from './requestHandler.ts';
import {log} from './util.ts';

const PORT = process.env.PORT ?? 3001;

// Create a server and make it listen for requests.
createServer(handler).listen(PORT, () => {
  log('info', 'listening', NaN, PORT);
});
