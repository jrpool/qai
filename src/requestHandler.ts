// IMPORTS

import {IncomingMessage, ServerResponse} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {handleError, log} from './util.ts';

// CONSTANTS

const __dirname = dirname(fileURLToPath(import.meta.url));

// Route map: URL path → HTML file
export const routes: Record<string, string> = {
  '/': 'tutorial.html',
  '/comments': 'comments.html'
};

// FUNCTIONS

// Handles requests.
export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url as string;
  const file = routes[url];
  if (! file) {
    handleError(res, `${url} not found`, 404);
    return;
  }
  try {
    // Get the HTML file content.
    const content = await readFile(join(__dirname, '..', 'public', file), 'utf-8');
    // Serve it to the client.
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content);
    log('info', 'response', file, 200);
  } catch (_) {
    handleError(res, `Server failed to serve ${url} (${file})`, 500);
  }
}
