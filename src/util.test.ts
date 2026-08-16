// util.test.ts

import {htmlSanitize, stringify} from './util.ts';
import assert from 'node:assert/strict';
import {test} from 'node:test';

test('String converted to a string is unchanged', async () => {
  const message = stringify('This is a message');
  assert.equal(message, 'This is a message');
});

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

test('Plain string sanitized for HTML is unchanged', async () => {
  const saneString = htmlSanitize('This is a message');
  assert.equal(saneString, 'This is a message');
});

test('HTML-containing string is correctly sanitized for HTML', async () => {
  const saneString = htmlSanitize('He said \'We use the "<ul>" & "<ol>" elements for lists and "&apos;" for apostrophes.\'');
  assert.equal(saneString, 'He said &apos;We use the &quot;&lt;ul&gt;&quot; &amp; &quot;&lt;ol&gt;&quot; elements for lists and &quot;&amp;apos;&quot; for apostrophes.&apos;');
});
