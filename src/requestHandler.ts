// IMPORTS

import {IncomingMessage, ServerResponse} from 'node:http';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {handleError, log} from './util.ts';

// CONSTANTS

const __dirname = dirname(fileURLToPath(import.meta.url));

// Map of paths to files.
export const routes: Record<string, string> = {
  '/': 'tutorial.html',
  '/comments': 'comments.html',
  '/favicon.ico': 'favicon.ico'
};
// Map of file extensions to content types.
const contentTypeMap: Record<string, string> = {
  'html': 'text/html',
  'css': 'text/css',
  'ico': 'image/x-icon'
};

// FUNCTIONS

// Handles requests.
export const makeHandler = (commentsFilePath: string) => {
  return async (request: IncomingMessage, response: ServerResponse) => {
    // If the request is a comment submission:
    if (request.method === 'POST' && request.url === '/comment') {
      const requestData: {error?: string; comment?: string} = await new Promise(resolve => {
        // Initialize an array of data from the response.
        const chunks: Buffer[] = [];
        // If the request throws an error:
        request.on('error', error => {
          /* c8 ignore next 4 */
          const {message} = error;
          // Populate the request data wih the error message and stop awaiting data.
          resolve({error: message});
          return;
        })
        // Otherwise, whenever the response delivers data:
        .on('data', chunk => {
          // Add them to the array.
          chunks.push(chunk);
        })
        // When the response is completed:
        .on('end', () => {
          const contentString = chunks.join('');
          // Get the form data.
          const params = new URLSearchParams(contentString);
          // Get the comment.
          const comment = params.get('comment') ?? '';
          // Populate the request data with it.
          resolve({comment});
        });
      });
      // If the request data contain an error message:
      /* c8 ignore next 5 */
      if (requestData.error) {
        // Serve and log it.
        handleError(response, requestData.error, 500);
        return;
      }
      const {comment} = requestData;
      // Otherwise, if they contain a comment:
      if (comment) {
        const commentLength = comment.length;
        // If its length is invalid:
        if (commentLength < 20 || commentLength > 1000) {
          // Get the applicable error message.
          const messageSpec = commentLength < 20 ? 'shorter than 20' : 'longer than 1000';
          const message = `Your comment was ${messageSpec} characters`;
          // Serve and log this.
          handleError(response, message, 422);
          return;
        }
        // Otherwise, i.e. if its length is valid, ensure the database directory exists.
        await mkdir(dirname(commentsFilePath), {recursive: true});
        let comments;
        try {
          // Get the comments file from it, if any.
          const commentsJSON = await readFile(commentsFilePath, 'utf8') ?? '[]';
          // Parse the comments.
          comments = JSON.parse(commentsJSON);
          // Get the comments submitted within the last 1000 seconds.
          const duplicates = comments.filter((commentData: {
            dateTime: string,
            content: string
          }) => new Date(commentData.dateTime).getTime() > Date.now() - 1000000)
          .filter((commentData: {
            dateTime: string,
            content: string
          }) => commentData.content === comment);
          // If the comment duplicates a recent one:
          if (duplicates.length) {
            // Serve and log this.
            handleError(response, 'Your comment repeats a recently submitted one, but you are welcome to submit a different comment', 422);
            return;
          }
        }
        // If processing the comments file fails:
        catch (error) {
          // If the cause is that the file does not exist:
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // Initialize the comments as empty.
            comments = [];
          }
          // Otherwise, i.e. if the cause is anything else:
          else {
            // Serve and log this and stop responding.
            handleError(response, 'Your comment was valid but could not be added to the existing comments for an unknown reason, so please submit a GitHub issue instead', 500);
            return;
          }
        }
        // If the comment is not a duplicate, add the new comment to any existing comments.
        comments.push({
          dateTime: new Date().toISOString(),
          content: requestData.comment
        });
        try {
          // Save them.
          await writeFile(commentsFilePath, JSON.stringify(comments, null, 2));
        }
        // If this fails:
        catch {
          // Serve and log this.
          handleError(
            response,
            'Your comment was valid and was added to the existing comments but could not be recorded for an unknown reason, so please submit a GitHub issue instead',
            500
          );
          return;
        }
        // Get the thanks page.
        let contentBuffer = await readFile(
          join(__dirname, '..', 'public', 'comment-ack.html'), 'utf8'
        );
        // Replace its placeholder with the comment.
        contentBuffer = contentBuffer.replace('__comment__', requestData.comment!);
        // Serve the page.
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(contentBuffer);
      }
      // Otherwise, i.e. if they are invalid:
      else {
        // Serve and log this.
        handleError(response, 'Your comment could not be obtained from your submission for an unknown reason, so please submit a GitHub issue instead', 500);
      }
      return;
    }
    // Otherwise, i.e. if it is not a comment submission, get its path.
    const url = request.url as string;
    // Get the corresponding file path.
    const file = routes[url];
    // If there is no file path:
    if (! file) {
      // Serve and log this.
      handleError(response, `${url} is not a valid path`, 404);
      return;
    }
    // Otherwise, i.e. if there is a file path, get the file content type.
    const contentType = contentTypeMap[file.split('.').pop()!] || '';
    // If this failed:
    if (! contentType) {
      // Serve and log this.
      handleError(
        response, `Your request is valid, but this server does not have the information it needs to serve the page`, 500
      );
      return;
    }
    // Otherwise, i.e. if it succeeded, get the file content.
    try {
      const contentBuffer = await readFile(join(__dirname, '..', 'public', file));
      // Serve it to the client.
      response.writeHead(200, {'Content-Type': contentType});
      response.end(contentBuffer);
      log('info', 'response', file, 200);
    }
    // If this failed:
    catch {
      // Serve and log this.
      handleError(
        response,
        'Your request was valid and the server tried to serve the page, but this failed for an unknown reason',
        500
      );
    }
  }
};
