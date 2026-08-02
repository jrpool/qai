import {after, before, test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer, type Server} from 'node:http';
import {type AddressInfo} from 'node:net';
import {parse} from 'node-html-parser';
import {
  chmod,
  mkdtempDisposable,
  readFile,
  writeFile
} from 'node:fs/promises';import {tmpdir} from 'node:os';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeHandler, routes} from './requestHandler.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Helpers for per-test isolated servers.
const setServerUp = async (commentsFilePath: string) => {
  const server = createServer(makeHandler(commentsFilePath));
  await new Promise<void>(resolve => {
    server.listen(0, () => resolve());
  });
  const port = (server.address() as AddressInfo).port;
  return {server, port};
};

const tearServerDown = (server: Server) => new Promise<void>(resolve => {
  server.close(() => resolve());
});

// Shared server for existing GET tests.
let server: Server;
let port: number;

before(() => new Promise<void>(resolve => {
  server = createServer(makeHandler(join(__dirname, '..', 'db', 'comments.json')));
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
  'POST with valid comment and no comments file creates file with comment and acknowledges',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFile = join(dir.path, 'comments.json');
    const {server, port} = await setServerUp(commentsFile);
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 200);
      const fileContent = await readFile(commentsFile, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 1);
      assert.match(comments[0].dateTime, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      assert.ok(new Date().getTime() - new Date(comments[0].dateTime).getTime() < 1000);
      assert.equal(comments[0].content, submittedComment);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Thanks for your comment | QAI');
      assert.match(html, /maintainer has been notified/);
      assert.ok(html.includes(submittedComment));
    }
    finally {
      await tearServerDown(server);
    }
  }
);

test(
  'POST with valid comment and populated comments file appends comment and acknowledges',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFile = join(dir.path, 'comments.json');
    const existingComment = {
      dateTime: '2025-10-15T12:34:56.000Z',
      content: 'This is a pre-existing test comment.'
    };
    await writeFile(commentsFile, JSON.stringify([existingComment]), 'utf8');
    const {server, port} = await setServerUp(commentsFile);
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 200);
      const fileContent = await readFile(commentsFile, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 2);
      assert.equal(comments[0].content, existingComment.content);
      assert.match(comments[1].dateTime, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      assert.ok(new Date().getTime() - new Date(comments[1].dateTime).getTime() < 1000);
      assert.equal(comments[1].content, submittedComment);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Thanks for your comment | QAI');
      assert.match(html, /maintainer has been notified/);
      assert.ok(html.includes(submittedComment));
    }
    finally {
      await tearServerDown(server);
    }
  }
);

test(
  'POST with comment shorter than 20 characters gets 422 and error page',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFile = join(dir.path, 'comments.json');
    const {server, port} = await setServerUp(commentsFile);
    try {
      const submittedComment = 'Too short.';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 422);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Error | QAI');
      assert.match(html, /comment was shorter than 20 characters/);
      const fileExists = await readFile(commentsFile, 'utf8').then(
        () => true, () => false
      );
      assert.equal(fileExists, false);
    }
    finally {
      await tearServerDown(server);
    }
  }
);

test(
  'POST with comment longer than 1000 characters gets 422 and error page',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFile = join(dir.path, 'comments.json');
    const {server, port} = await setServerUp(commentsFile);
    try {
      const submittedComment = 'x'.repeat(1001);
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 422);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Error | QAI');
      assert.match(html, /comment was longer than 1000 characters/);
      const fileExists = await readFile(commentsFile, 'utf8').then(
        () => true, () => false
      );
      assert.equal(fileExists, false);
    }
    finally {
      await tearServerDown(server);
    }
  }
);

test(
  'POST with comment identical to a recent entry gets 422 and error page',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFile = join(dir.path, 'comments.json');
    const recentTime = new Date().toISOString();
    const duplicateContent = 'This is a comment that will be submitted twice.';
    const existingComment = {dateTime: recentTime, content: duplicateContent};
    await writeFile(commentsFile, JSON.stringify([existingComment]), 'utf8');
    const {server, port} = await setServerUp(commentsFile);
    try {
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(duplicateContent)}`
      });
      assert.equal(response.status, 422);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Error | QAI');
      assert.match(html, /comment is a duplicate/);
      const fileContent = await readFile(commentsFile, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 1);
    }
    finally {
      await tearServerDown(server);
    }
  }
);

test(
  'POST with valid comment when comments file is not writable gets 500 and error page',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFile = join(dir.path, 'comments.json');
    await writeFile(commentsFile, '[]', 'utf8');
    await chmod(commentsFile, 0o444);
    const {server, port} = await setServerUp(commentsFile);
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 500);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Error | QAI');
      assert.match(html, /A system error prevented your comment from being recorded. The maintainer has been notified. Please submit a GitHub issue instead./);
      const fileContent = await readFile(commentsFile, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 0);
    }
    finally {
      await chmod(commentsFile, 0o644);
      await tearServerDown(server);
    }
  }
);
