import {after, before, test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer, type Server} from 'node:http';
import {type AddressInfo} from 'node:net';
import {parse} from 'node-html-parser';
import {handler, routes} from './requestHandler.ts';

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

test('GET request to root (/) gets status 200', async () => {
  const response = await fetch(`http://localhost:${port}/`);
  assert.equal(response.status, 200);
});

test('GET request to comments page (/comments) gets status 200', async () => {
  const response = await fetch(`http://localhost:${port}/comments`);
  assert.equal(response.status, 200);
});

test('GET request to bad path (/blah) gets status 404', async () => {
  const response = await fetch(`http://localhost:${port}/blah`);
  assert.equal(response.status, 404);
});

test('GET request to root (/) gets tutorial title', async () => {
  const response = await fetch(`http://localhost:${port}/`);
  const html = await response.text();
  const root = parse(html);
  const title = root.querySelector('title');
  assert.equal(title?.textContent, 'Tutorial | QAI');
});

test('GET request to comments page (/comments) gets comments title', async () => {
  const response = await fetch(`http://localhost:${port}/comments`);
  const html = await response.text();
  const root = parse(html);
  const title = root.querySelector('title');
  assert.equal(title?.textContent, 'Comments | QAI');
});

test('GET request to root (/) if file unreadable gets status 500', async testContext => {
  const propertyMock = testContext.mock.property(routes, '/', 'nonexistent.html');
  const response = await fetch(`http://localhost:${port}/`);
  assert.equal(response.status, 500);
  propertyMock.mock.restore();
});

test('GET request to route with unknown content type gets status 500', async testContext => {
  const propertyMock = testContext.mock.property(routes, '/', 'unknown.xyz');
  const response = await fetch(`http://localhost:${port}/`);
  assert.equal(response.status, 500);
  const body = await response.text();
  assert.match(
    body,
    /Server failed to serve \/ \(unknown\.xyz\) because its content type is unknown/
  );
  propertyMock.mock.restore();
});
