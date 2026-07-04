// util.ts

// IMPORTS

import {ServerResponse} from 'node:http';

// Outputs a log to the console.
const log: (
  level: 'error' | 'warning' | 'info',
  type: 'listening' | 'request' | 'userError' | 'systemError',
  statusCode: number,
  content: any
) => void = (
  level: 'error' | 'warning' | 'info',
  type: 'listening' | 'request' | 'userError' | 'systemError',
  statusCode: number,
  content: any
) => {
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
    time: new Date().toISOString(),
    level,
    type,
    statusCode,
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
  const type = statusCode >= 400 && statusCode < 500 ? 'userError' : 'systemError';
  const level = type === 'userError' ? 'info' : 'error';
  log(level, type, statusCode, errorMessage);
};

export {log, handleError};
