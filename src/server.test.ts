import {before, after, test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer, type Server} from 'node:http';

let server: Server;

before(() => new Promise<void>(resolve => {
  server = createServer((_, res) => {
    res.writeHead(200);
    res.end('ok');
  });
  server.listen(3001, resolve);
}));

after(() => new Promise<void>(resolve => {
  server.close(() => resolve());
}));

test('GET request to root (/) gets response with status 200', async () => {
  const response = await fetch('http://localhost:3001/');
  assert.equal(response.status, 200);
});
