import {createServer} from 'node:http';
import {handler} from './requestHandler.js';
import {log} from './util.js';

const PORT = process.env.PORT ?? 3001;

// Create a server and make it listen for requests.
createServer(handler).listen(PORT, () => {
  log('info', `Listening on port ${PORT}`);
});
