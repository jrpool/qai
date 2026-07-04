// util.ts

// IMPORTS

import {ServerResponse} from 'node:http';

// Logs a message to the console.
const log: (level: 'error' | 'warning' | 'info', content: any) => void = (level: string, content: any) => {
  let message: string = content;
  if (typeof content !== 'string') {
    if (typeof content === 'object' && content instanceof Error) {
      message = content.message;
    }
    else {
      message = String(content) || 'Unknown error';
    }
  }
  console.log(JSON.stringify({
    level,
    message
  }, null, 2));
};

// Serves and logs an error.
const handleError: (
  res: ServerResponse,
  statusCode: number,
  errorMessage: String
) => void = (res: ServerResponse, statusCode: number, errorMessage: String) => {
  res.writeHead(statusCode);
  res.end(errorMessage);
  log('error', errorMessage);
};

export {log, handleError};
