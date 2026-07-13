// util.ts

// IMPORTS

import {ServerResponse} from 'node:http';

// Converts content to a string.
export const stringify = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (content instanceof Error) {
    return content.message;
  }
  return String(content) || 'Unknown content';
};

// Outputs a log to the console.
export const log = (
  level: 'error' | 'warning' | 'info',
  type: 'listening' | 'response' | 'userError' | 'systemError',
  content: unknown,
  statusCode?: number
) => {
  console.log(JSON.stringify({
    time: new Date().toISOString(),
    level,
    type,
    message: stringify(content),
    statusCode
  }, null, 2));
};

// Serves and logs an error.
export const handleError = (res: ServerResponse, errorMessage: string, statusCode: number) => {
  res.writeHead(statusCode);
  res.end(errorMessage);
  const type = statusCode >= 400 && statusCode < 500 ? 'userError' : 'systemError';
  const level = type === 'userError' ? 'info' : 'error';
  log(level, type, errorMessage, statusCode);
};
