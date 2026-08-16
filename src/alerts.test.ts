// alerts.test.ts

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer, type Server, type IncomingMessage, type ServerResponse} from 'node:http';
import {type AddressInfo} from 'node:net';
import {makeSendAlert} from './alerts.ts';

// Base configuration for a test alert, overridden per test as needed.
const baseConfig = {
  protocol: 'http' as const,
  managerEmail: 'manager@example.com',
  apiPath: '/emails',
  apiKey: 'test-key',
  from: 'qai@example.com'
};

// Starts a local server with a handler and returns it with its port.
const startServer = async (
  handler: (req: IncomingMessage, res: ServerResponse) => void
) => {
  const server = createServer(handler);
  await new Promise<void>(resolve => {
    server.listen(0, () => resolve());
  });
  const port = (server.address() as AddressInfo).port;
  return {server, port};
};

// Stops a local server.
const stopServer = (server: Server) => new Promise<void>(resolve => {
  server.close(() => resolve());
});

// Gets a port number that is not currently in use.
const getDeadPort = () => new Promise<number>(resolve => {
  const server = createServer();
  server.listen(0, () => {
    const port = (server.address() as AddressInfo).port;
    server.close(() => resolve(port));
  });
});

test('Unconfigured alert returns unconfigured status', async () => {
  const sendAlert = makeSendAlert({});
  const result = await sendAlert('Test subject', 'Test body');
  assert.equal(result.status, 'unconfigured');
});

test('Delivered alert returns delivered status', async () => {
  const {server, port} = await startServer((_, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{}');
  });
  try {
    const sendAlert = makeSendAlert({
      ...baseConfig,
      apiHost: `localhost:${port}`
    });
    const result = await sendAlert('Test subject', 'Test body');
    assert.equal(result.status, 'delivered');
  }
  finally {
    await stopServer(server);
  }
});

test('Non-2xx response returns failed status with reason', async () => {
  const {server, port} = await startServer((req, res) => {
    res.writeHead(500);
    res.end('Internal error');
  });
  try {
    const sendAlert = makeSendAlert({
      ...baseConfig,
      apiHost: `localhost:${port}`
    });
    const result = await sendAlert('Test subject', 'Test body');
    assert.equal(result.status, 'failed');
    assert.match((result as {reason: string}).reason, /500/);
  }
  finally {
    await stopServer(server);
  }
});

test('Network error returns failed status with reason', async () => {
  const port = await getDeadPort();
  const sendAlert = makeSendAlert({
    ...baseConfig,
    apiHost: `localhost:${port}`
  });
  const result = await sendAlert('Test subject', 'Test body');
  assert.equal(result.status, 'failed');
  assert.ok((result as {reason: string}).reason.length > 0);
});

test('timeout returns failed status with timeout reason', async () => {
  const {server, port} = await startServer((req, res) => {
    setTimeout(() => {
      res.writeHead(200);
      res.end('{}');
    }, 200);
  });
  try {
    const sendAlert = makeSendAlert({
      ...baseConfig,
      apiHost: `localhost:${port}`,
      timeout: 50
    });
    const result = await sendAlert('Test subject', 'Test body');
    assert.equal(result.status, 'failed');
    assert.match((result as {reason: string}).reason, /timeout/i);
  }
  finally {
    await stopServer(server);
  }
});
