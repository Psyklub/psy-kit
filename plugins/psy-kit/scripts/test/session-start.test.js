'use strict';

// Run with: node --test "plugins/psy-kit/scripts/test/*.test.js"

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', 'session-start.js');
const { buildPart, detectProfiles, lastJournalEntry, clipMiddle, PART_LIMIT } = require(SCRIPT);

function tempProject(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'psy-kit-test-'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content, 'utf8');
  }
  return dir;
}

function runHook(part, dir, env = {}) {
  return execFileSync(process.execPath, [SCRIPT, part], {
    input: JSON.stringify({ cwd: dir, session_id: 'test' }),
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir, PSY_KIT_HOME: path.join(dir, '.no-config'), ...env },
    encoding: 'utf8',
  });
}

test('a project without STATE.md gets nothing', () => {
  const dir = tempProject({ 'README.md': '# x' });
  for (const part of ['rules', 'profiles', 'state']) assert.strictEqual(runHook(part, dir), '');
});

test('the rules part carries the core rules as SessionStart context', () => {
  const dir = tempProject({ 'STATE.md': '# State' });
  const out = JSON.parse(runHook('rules', dir));
  assert.strictEqual(out.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.match(out.hookSpecificOutput.additionalContext, /Validate before building/);
  assert.doesNotMatch(out.hookSpecificOutput.additionalContext, /^---/m, 'frontmatter is stripped');
});

test('the state part carries STATE.md and only the last journal entry', () => {
  const journal = '# Journal\n\n## 2026-11-10 — old\nold notes\n\n```\n## not a heading\n```\n\n## 2026-11-12 — new\nnew notes\n';
  const dir = tempProject({ 'STATE.md': '# State\n\n**Going well.**', 'JOURNAL.md': journal });
  const text = JSON.parse(runHook('state', dir)).hookSpecificOutput.additionalContext;
  assert.match(text, /Going well/);
  assert.match(text, /new notes/);
  assert.doesNotMatch(text, /old notes/);
});

test('lastJournalEntry ignores headings inside code fences', () => {
  const entry = lastJournalEntry('## a\ntext\n```\n## fake\n```\n');
  assert.ok(entry.startsWith('## a'));
});

test('an open session is reported', () => {
  const dir = tempProject({
    'STATE.md': '# State',
    '.session.json': JSON.stringify({ subject: 'auth', started: '2026-11-12T10:00:00Z', baseline: null }),
  });
  const text = buildPart('state', dir, {});
  assert.match(text, /A session is still open: subject "auth"/);
});

test('profiles are detected at the root and one level down, never in node_modules', () => {
  assert.deepStrictEqual(detectProfiles(tempProject({ 'wrangler.toml': '' })), ['cloudflare']);
  assert.deepStrictEqual(detectProfiles(tempProject({ 'api/wrangler.jsonc': '{}' })), ['cloudflare']);
  assert.deepStrictEqual(detectProfiles(tempProject({ 'node_modules/wrangler.toml': '' })), []);
  const text = buildPart('profiles', tempProject({ 'STATE.md': '#', 'wrangler.toml': '' }), {});
  assert.match(text, /Production needs a yes/);
});

test('a wrong git identity is flagged, the right one is silent', (t) => {
  const dir = tempProject({ 'STATE.md': '# State' });
  try {
    execFileSync('git', ['init', '-q'], { cwd: dir });
    execFileSync('git', ['config', 'user.email', 'someone@example.com'], { cwd: dir });
  } catch (_e) {
    t.skip('git unavailable');
    return;
  }
  assert.match(buildPart('state', dir, { gitEmail: 'me@example.com' }), /Git identity warning/);
  assert.doesNotMatch(buildPart('state', dir, { gitEmail: 'Someone@example.com' }), /Git identity warning/);
  assert.doesNotMatch(buildPart('state', dir, {}), /Git identity warning/);
});

test('every part stays under the per-output cap, even with a huge STATE.md', () => {
  const dir = tempProject({ 'STATE.md': 'x'.repeat(50000), 'JOURNAL.md': `## big\n${'y'.repeat(50000)}` });
  for (const part of ['rules', 'profiles', 'state']) assert.ok(buildPart(part, dir, {}).length <= PART_LIMIT + 200);
});

test('clipMiddle keeps the head and the tail', () => {
  const clipped = clipMiddle(`HEAD${'m'.repeat(5000)}TAIL`, 1000, 'f');
  assert.ok(clipped.startsWith('HEAD') && clipped.endsWith('TAIL'));
});
