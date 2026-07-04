// IMPORTS

import {IncomingMessage, ServerResponse} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {log} from './util.js';

// CONSTANTS

const __dirname = dirname(fileURLToPath(import.meta.url));

// Route map: URL path → HTML file
const routes: Record<string, string> = {
  '/': 'tutorial.html',
  '/comments': 'comments.html'
};

// FUNCTIONS

// Handles requests.
const handler = async (req: IncomingMessage, res: ServerResponse) => {
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
    log('error', String(err));
    res.writeHead(500);
    res.end('Internal server error');
  }
}

export {handler};
