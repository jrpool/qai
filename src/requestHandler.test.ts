// requestHandler.test.ts

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
} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeHandler, routes} from './requestHandler.ts';
import {type AlertResult} from './alerts.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Helpers for per-test isolated servers.
const startServer = async (
  commentsFilePath: string, sendAlert?: (subject: string, body: string) => Promise<AlertResult>
) => {
  const server = createServer(makeHandler(commentsFilePath, sendAlert));
  await new Promise<void>(resolve => {
    server.listen(0, () => resolve());
  });
  const port = (server.address() as AddressInfo).port;
  return {server, port};
};

const stopServer = (server: Server) => new Promise<void>(resolve => {
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
  assert.match(body, /\/blah is not a valid path/);
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
  assert.match(html, /Please comment by submitting this form/);
});

test('GET request to root (/) if file unreadable gets status 500', async testContext => {
  const propertyMock = testContext.mock.property(routes, '/', 'nonexistent.html');
  const response = await fetch(`http://localhost:${port}/`);
  assert.equal(response.status, 500);
  const body = await response.text();
  assert.match(body, /tried to serve the page, but this failed/);
  propertyMock.mock.restore();
});

test('GET request to route with unknown content type gets status 500', async testContext => {
  const propertyMock = testContext.mock.property(routes, '/', 'unknown.xyz');
  const response = await fetch(`http://localhost:${port}/`);
  assert.equal(response.status, 500);
  const body = await response.text();
  assert.match(body, /does not have the information it needs/);
  propertyMock.mock.restore();
});

test(
  'POST with valid comment and no comments file creates file with comment and acknowledges',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const {server, port} = await startServer(join(dir.path, 'comments.json'));
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 200);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Thanks for your comment | QAI');
      const blockquote = root.querySelector('blockquote');
      assert.equal(blockquote?.querySelector('p')?.textContent, submittedComment);
      const main = root.querySelector('main');
      assert.match(main?.textContent || '', /maintainer of QAI has been notified/);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with valid comment and populated comments file appends comment and acknowledges',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    const existingComments = [
      {
        dateTime: '2025-10-15T12:34:56.000Z',
        content: 'This is a pre-existing test comment.'
      },
      {
        dateTime: '2026-02-15T12:34:56.000Z',
        content: 'This is another pre-existing test comment.'
      }
    ];
    await writeFile(commentsFilePath, JSON.stringify(existingComments), 'utf8');
    const {server, port} = await startServer(commentsFilePath);
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 200);
      const fileContent = await readFile(commentsFilePath, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 3);
      assert.equal(comments[0].content, existingComments[0].content);
      assert.match(comments[2].dateTime, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      assert.ok(new Date().getTime() - new Date(comments[2].dateTime).getTime() < 1000);
      assert.equal(comments[2].content, submittedComment);
      const html = await response.text();
      const root = parse(html);
      const title = root.querySelector('title');
      assert.equal(title?.textContent, 'Thanks for your comment | QAI');
      const blockquote = root.querySelector('blockquote');
      assert.equal(blockquote?.querySelector('p')?.textContent, submittedComment);
      const main = root.querySelector('main');
      assert.match(main?.textContent || '', /maintainer of QAI has been notified/);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with comment containing HTML markup saves and renders it as text',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    await writeFile(commentsFilePath, '[]', 'utf8');
    const {server, port} = await startServer(commentsFilePath);
    try {
      const submittedComment = 'You should use this image: <img src="x" onerror="alert(1)">';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 200);
      const html = await response.text();
      const root = parse(html);
      const blockquote = root.querySelector('blockquote');
      assert.equal(blockquote?.querySelectorAll('img')?.length, 0);
      assert.equal(blockquote?.querySelectorAll('script')?.length, 0);
      assert.equal(blockquote?.querySelector('p')?.textContent, submittedComment);
      const fileContent = await readFile(commentsFilePath, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 1);
      assert.equal(comments[0].content, submittedComment);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with comment shorter than 20 characters gets 422 and error message',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    const {server, port} = await startServer(commentsFilePath);
    try {
      const submittedComment = 'Too short.';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 422);
      const message = await response.text();
      assert.match(message, /comment was shorter than 20 characters/);
      const fileExists = await readFile(commentsFilePath, 'utf8').then(
        () => true, () => false
      );
      assert.equal(fileExists, false);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with comment longer than 1000 characters gets 422 and error message',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    const {server, port} = await startServer(commentsFilePath);
    try {
      const submittedComment = 'x'.repeat(1001);
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 422);
      const message = await response.text();
      assert.match(message, /comment was longer than 1000 characters/);
      const fileExists = await readFile(commentsFilePath, 'utf8').then(
        () => true, () => false
      );
      assert.equal(fileExists, false);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with comment identical to a recent entry gets 422 and error message',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    const recentTime = new Date().toISOString();
    const duplicateContent = 'This is a comment that will be submitted twice.';
    const existingComment = {dateTime: recentTime, content: duplicateContent};
    await writeFile(commentsFilePath, JSON.stringify([existingComment]), 'utf8');
    const {server, port} = await startServer(commentsFilePath);
    try {
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(duplicateContent)}`
      });
      assert.equal(response.status, 422);
      const message = await response.text();
      assert.match(message, /Your comment repeats a recently submitted one/);
      const fileContent = await readFile(commentsFilePath, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 1);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with valid comment when comments file is not readable gets 500 and error message',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    await writeFile(commentsFilePath, '[]', 'utf8');
    await chmod(commentsFilePath, 0o000);
    const {server, port} = await startServer(commentsFilePath);
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 500);
      const message = await response.text();
      assert.match(message, /could not be added to the existing comments/);
    }
    finally {
      // In case the OS requires this for deletion.
      await chmod(commentsFilePath, 0o644);
      await stopServer(server);
    }
  }
);

test(
  'POST with valid comment when comments file is not writable gets 500 and error message',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    await writeFile(commentsFilePath, '[]', 'utf8');
    await chmod(commentsFilePath, 0o444);
    const {server, port} = await startServer(commentsFilePath);
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 500);
      const message = await response.text();
      assert.match(message, /could not be recorded/);
      const fileContent = await readFile(commentsFilePath, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 0);
    }
    finally {
      // In case the OS requires this for deletion.
      await chmod(commentsFilePath, 0o644);
      await stopServer(server);
    }
  }
);

test(
  'POST with no comment field gets 500 and error message',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    await writeFile(commentsFilePath, '[]', 'utf8');
    const {server, port} = await startServer(commentsFilePath);
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `noncomment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 500);
      const message = await response.text();
      assert.match(message, /could not be obtained/);
      const fileContent = await readFile(commentsFilePath, 'utf8');
      const comments = JSON.parse(fileContent);
      assert.equal(comments.length, 0);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with valid comment and failed alert acknowledges with no delivery confirmation',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    const {server, port} = await startServer(
      commentsFilePath, () => Promise.resolve({status: 'failed', reason: 'timeout'})
    );
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 200);
      const html = await response.text();
      const root = parse(html);
      const main = root.querySelector('main');
      assert.match(main?.textContent || '', /got no delivery confirmation/);
    }
    finally {
      await stopServer(server);
    }
  }
);

test(
  'POST with valid comment and unconfigured alert acknowledges without notification claim',
  async () => {
    await using dir = await mkdtempDisposable(join(tmpdir(), 'qai-test-'));
    const commentsFilePath = join(dir.path, 'comments.json');
    const {server, port} = await startServer(
      commentsFilePath,
      () => Promise.resolve({status: 'unconfigured'})
    );
    try {
      const submittedComment = 'Can you create a similar tutorial for the <ABC&XYZ> AI platform?';
      const response = await fetch(`http://localhost:${port}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `comment=${encodeURIComponent(submittedComment)}`
      });
      assert.equal(response.status, 200);
      const html = await response.text();
      const root = parse(html);
      const main = root.querySelector('main');
      assert.match(main?.textContent || '', /The maintainer will see your comment/);
      assert.doesNotMatch(main?.textContent || '', /tried to notify/);
    }
    finally {
      await stopServer(server);
    }
  }
);
