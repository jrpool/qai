// IMPORTS

import {createServer, IncomingMessage, ServerResponse} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import pino from 'pino';

// CONSTANTS

const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = pino();
const PORT = process.env.PORT ?? 3001;

// Route map: URL path → HTML file
const routes: Record<string, string> = {
  '/': 'tutorial.html',
  '/comments': 'comments.html'
};

// FUNCTIONS

// Handles requests.
async function handler(req: IncomingMessage, res: ServerResponse) {
  const file = routes[req.url ?? '/'];
  if (!file) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  try {
    const content = await readFile(join(__dirname, '..', 'public',file), 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content);
  } catch (err) {
    logger.error(err);
    res.writeHead(500);
    res.end('Internal server error');
  }
}

createServer(handler).listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
