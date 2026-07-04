// IMPORTS

import {IncomingMessage, ServerResponse} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {handleError, log} from './util.ts';

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
  const url = req.url ?? '/';
  const file = routes[url];
  if (! file) {
    handleError(res, 404, `${url} not found`);
    return;
  }
  try {
    const content = await readFile(join(__dirname, '..', 'public', file), 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content);
    log('info', 'request', file);
  } catch (_) {
    handleError(res, 500, `Server failed to serve ${url}`);
  }
}

export {handler};
