import {before, after, test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer, type Server} from 'node:http';
import {type AddressInfo} from 'node:net';
import {parse} from 'node-html-parser';
import {handler} from './requestHandler.ts';

let server: Server;
let port: number;

before(() => new Promise<void>(resolve => {
  server = createServer(handler);
  server.listen(0, () => {
    port = (server.address() as AddressInfo).port;
    resolve();
  });
}));

after(() => new Promise<void>(resolve => {
  server.close(() => resolve());
}));

test('GET request to root (/) gets response with status 200', async () => {
  const response = await fetch(`http://localhost:${port}/`);
  assert.equal(response.status, 200);
});

test('GET request to comments page (/comments) gets response with status 200', async () => {
  const response = await fetch(`http://localhost:${port}/comments`);
  assert.equal(response.status, 200);
});

test('GET request to bad path (/blah) gets response with status 404', async () => {
  const response = await fetch(`http://localhost:${port}/blah`);
  assert.equal(response.status, 404);
});

test('GET request to root (/) gets the tutorial title', async () => {
  const response = await fetch(`http://localhost:${port}/`);
  const html = await response.text();
  const root = parse(html);
  const title = root.querySelector('title');
  assert.equal(title?.textContent, 'Tutorial | QAI');
});

test('GET request to comments page (/comments) gets the comments title', async () => {
  const response = await fetch(`http://localhost:${port}/comments`);
  const html = await response.text();
  const root = parse(html);
  const title = root.querySelector('title');
  assert.equal(title?.textContent, 'Comments | QAI');
});
