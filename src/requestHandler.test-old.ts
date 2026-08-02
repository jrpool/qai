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

test('GET request to bad path (/blah) gets status 404', async () => {
  const response = await fetch(`http://localhost:${port}/blah`);
  assert.equal(response.status, 404);
  const body = await response.text();
  assert.match(body, /\/blah not found/);
});

test('GET request to root (/) gets status 200 and tutorial page', async () => {
  const response = await fetch(`http://localhost:${port}/`);
  const html = await response.text();
  const root = parse(html);
  const title = root.querySelector('title');
  assert.equal(response.status, 200);
  assert.equal(title?.textContent, 'Tutorial | QAI');
  assert.match(html, /This tutorial shows you how/);
});

test('GET request to comments page (/comments) gets status 200 and comments page', async () => {
  const response = await fetch(`http://localhost:${port}/comments`);
  const html = await response.text();
  const root = parse(html);
  const title = root.querySelector('title');
  assert.equal(response.status, 200);
  assert.equal(title?.textContent, 'Comments | QAI');
  assert.match(html, /Please comment by submitting a comment with this form/);
});

test('GET request to root (/) if file unreadable gets status 500', async testContext => {
  const propertyMock = testContext.mock.property(routes, '/', 'nonexistent.html');
  const response = await fetch(`http://localhost:${port}/`);
  assert.equal(response.status, 500);
  const body = await response.text();
  assert.match(body, /Server failed to serve \/ \(nonexistent.html\)/);
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

test(
  'compliant POST request to comment handler (/comment) records comment and serves thanks page',
  async testContext => {
    const writeFileCalls: {path: string; data: string}[] = [];
    const existingCommentsData = [
      {
        dateTime: '2025-10-15T12:34:56',
        content: 'This is a test comment & the new comment should be appended to it.'
      }
    ];
    const readFileMock = testContext.mock.method(
      await import('node:fs/promises'),
      'readFile',
      async () => Buffer.from(JSON.stringify(existingCommentsData))
    );
    const writeFileMock = testContext.mock.method(
      await import('node:fs/promises'),
      'writeFile',
      async (path: string, data: string) => {
        writeFileCalls.push({path, data});
      }
    );
    const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
    const response = await fetch(`http://localhost:${port}/comment`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `comment=${encodeURIComponent(submittedComment)}`
    });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/comment-ack');
    assert.equal(writeFileCalls.length, 1);
    const commentsData = JSON.parse(writeFileCalls[0].data);
    assert.equal(commentsData.length, 1);
    const commentData = commentsData.pop();
    assert.match(commentData.dateTime, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    assert.ok(new Date().getTime() - new Date(commentData.dateTime).getTime() < 1000);
    assert.equal(commentData.content, submittedComment);
    const ackResponse = await fetch(`http://localhost:${port}/comment-ack`);
    assert.equal(ackResponse.status, 200);
    const html = await ackResponse.text();
    const root = parse(html);
    const title = root.querySelector('title');
    assert.equal(title?.textContent, 'Thank you for your comment | QAI');
    assert.match(html, /and the QAI maintainer has been notified/);
    assert.ok(html.includes(submittedComment));
    readFileMock.mock.restore();
    writeFileMock.mock.restore();
  }
);
