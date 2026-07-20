// IMPORTS

import {IncomingMessage, ServerResponse} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {handleError, log} from './util.ts';

// CONSTANTS

const __dirname = dirname(fileURLToPath(import.meta.url));

// Route map: URL path → file
export const routes: Record<string, string> = {
  '/': 'tutorial.html',
  '/comments': 'comments.html',
  '/favicon.ico': 'favicon.ico'
};
const contentTypeMap: Record<string, string> = {
  'html': 'text/html',
  'css': 'text/css',
  'ico': 'image/x-icon'
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
    // Get the file content type.
    const contentType = contentTypeMap[file.split('.').pop()!] || '';
    // If this failed:
    if (! contentType) {
      handleError(res, `Server failed to serve ${url} (${file}) because its content type is unknown`, 500);
      return;
    }
    // Otherwise, i.e. if it succeeded, get the file content.
    const contentBuffer = await readFile(join(__dirname, '..', 'public', file));
    // Serve it to the client.
    res.writeHead(200, {'Content-Type': contentType});
    res.end(contentBuffer);
    log('info', 'response', file, 200);
  }
  catch {
    handleError(res, `Server failed to serve ${url} (${file})`, 500);
  }
}
