import {stringify} from './util.ts';
import assert from 'node:assert/strict';
import {test} from 'node:test';

test('Error is converted to its message for logging', async () => {
  const message = stringify(new Error('This is a message'));
  assert.equal(message, 'This is a message');
});

test('Number is converted to its string representation for logging', async () => {
  const message = stringify(42);
  assert.equal(message, '42');
});

test('Empty array is converted to the unknown notice for logging', async () => {
  const message = stringify([]);
  assert.equal(message, 'Unknown content');
});
