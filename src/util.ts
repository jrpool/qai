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

// Sanitizes a string for rendering in HTML.
export const htmlSanitize = (content: string): string => content
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

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
export const handleError = (response: ServerResponse, errorMessage: string, statusCode: number) => {
  response.writeHead(statusCode);
  response.end(errorMessage);
  const type = statusCode >= 400 && statusCode < 500 ? 'userError' : 'systemError';
  const level = type === 'userError' ? 'info' : 'error';
  log(level, type, errorMessage, statusCode);
};
