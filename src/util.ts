// util.ts

// IMPORTS

import {ServerResponse} from 'node:http';

// Outputs a log to the console.
const log = (
  level: 'error' | 'warning' | 'info',
  type: 'listening' | 'response' | 'userError' | 'systemError',
  statusCode: number,
  content: unknown
) => {
  let message: string = '';
  if (typeof content === 'string') {
    message = content;
  }
  else if (content instanceof Error) {
    message = content.message;
  }
  else {
    message = String(content) || 'Unknown error';
  }
  console.log(JSON.stringify({
    time: new Date().toISOString(),
    level,
    type,
    statusCode,
    message
  }, null, 2));
};

// Serves and logs an error.
const handleError = (res: ServerResponse, statusCode: number, errorMessage: string) => {
  res.writeHead(statusCode);
  res.end(errorMessage);
  const type = statusCode >= 400 && statusCode < 500 ? 'userError' : 'systemError';
  const level = type === 'userError' ? 'info' : 'error';
  log(level, type, statusCode, errorMessage);
};

export {log, handleError};
