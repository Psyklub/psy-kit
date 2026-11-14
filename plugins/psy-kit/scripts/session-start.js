#!/usr/bin/env node
// psy-kit SessionStart hook.
//
// Runs at the start of every Claude Code session. In a psy-kit project (a project
// with a STATE.md at its root) it hands Claude what is needed to resume work
// without asking the author anything. One invocation emits one part, so each
// output stays under the per-output context cap:
//
//   node session-start.js rules     -> the core rules
//   node session-start.js exchange  -> the exchange rules (the shape of every message to the author)
//   node session-start.js profiles  -> the rules of the profiles the project uses
//   node session-start.js state     -> STATE.md, the last JOURNAL.md entry,
//                                      an open session, a git identity warning
//
// Outside a psy-kit project it prints nothing. It never fails the session:
// every error is swallowed and the exit code is always 0.

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const PART_LIMIT = 9000; // stays under the 10,000-character cap of one hook output
const STATE_LIMIT = 5500;
const JOURNAL_LIMIT = 2500;

const RULES_DIR = path.join(__dirname, '..', 'rules');

// Profile name -> files whose presence (at the root or one level down) turns it on.
const PROFILES = {
  cloudflare: ['wrangler.toml', 'wrangler.json', 'wrangler.jsonc'],
};

const SKIPPED_DIRS = new Set(['node_modules', '.git', '.wrangler', 'dist', 'build', 'Library', 'Temp']);

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  } catch (_e) {
    return null;
  }
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (_e) {
    return null;
  }
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8').replace(/^﻿/, '');
  } catch (_e) {
    return '';
  }
}

function resolveProjectDir(input) {
  return process.env.CLAUDE_PROJECT_DIR || (input && input.cwd) || process.cwd();
}

function isPsyProject(dir) {
  return fs.existsSync(path.join(dir, 'STATE.md'));
}

function stripFrontmatter(text) {
  const withoutComments = text.replace(/<!--[\s\S]*?-->/g, '');
  const match = withoutComments.match(/^---\n[\s\S]*?\n---\n/);
  return (match ? withoutComments.slice(match[0].length) : withoutComments).trim();
}

// Keeps the head of a text; says where the rest is.
function clipHead(text, limit, file) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}\n\n[... cut here: read ${file} for the rest]`;
}

// Keeps the head and the tail: a journal entry opens with its title and ends
// with the latest notes, both matter more than the middle.
function clipMiddle(text, limit, file) {
  if (text.length <= limit) return text;
  const head = Math.floor(limit * 0.4);
  const tail = limit - head;
  return `${text.slice(0, head).trimEnd()}\n\n[... middle cut: read ${file} for it]\n\n${text.slice(-tail).trimStart()}`;
}

// The last "## " section of the journal, ignoring headings inside code fences.
function lastJournalEntry(text) {
  const lines = text.split('\n');
  let inFence = false;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) inFence = !inFence;
    else if (!inFence && /^## /.test(lines[i])) start = i;
  }
  return start < 0 ? null : lines.slice(start).join('\n').trim();
}

function detectProfiles(dir) {
  const found = [];
  const candidates = [dir];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && !SKIPPED_DIRS.has(entry.name)) {
        candidates.push(path.join(dir, entry.name));
      }
    }
  } catch (_e) {
    /* unreadable directory: root only */
  }
  for (const [profile, markers] of Object.entries(PROFILES)) {
    if (candidates.some((d) => markers.some((m) => fs.existsSync(path.join(d, m))))) found.push(profile);
  }
  return found;
}

function git(args, cwd) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      timeout: 3000,
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true,
    }).trim();
  } catch (_e) {
    return null;
  }
}

function loadUserConfig() {
  const home = process.env.PSY_KIT_HOME || path.join(os.homedir(), '.claude', 'psy-kit');
  return parseJson(readText(path.join(home, 'config.json')) || '') || {};
}

function rulesPart() {
  const core = readText(path.join(RULES_DIR, 'core.md'));
  if (!core) return '';
  return clipHead(
    `# psy-kit: core rules (loaded automatically, follow them without announcing them)\n\n${stripFrontmatter(core)}`,
    PART_LIMIT,
    path.join(RULES_DIR, 'core.md'),
  );
}

function exchangePart() {
  const text = readText(path.join(RULES_DIR, 'exchange.md'));
  if (!text) return '';
  return clipHead(
    `# psy-kit: exchange rules (the shape of every message to the author, follow them without announcing them)

${stripFrontmatter(text)}`,
    PART_LIMIT,
    path.join(RULES_DIR, 'exchange.md'),
  );
}

function profilesPart(dir) {
  const blocks = [];
  for (const profile of detectProfiles(dir)) {
    const file = path.join(RULES_DIR, `${profile}.md`);
    const text = readText(file);
    if (text) blocks.push(stripFrontmatter(text));
  }
  if (blocks.length === 0) return '';
  return clipHead(`# psy-kit: profile rules for this project\n\n${blocks.join('\n\n')}`, PART_LIMIT, RULES_DIR);
}

function openSessionBlock(dir) {
  const session = parseJson(readText(path.join(dir, '.session.json')) || '');
  if (!session) return null;
  const lines = [
    '## Open session',
    `A session is still open: subject "${session.subject || '?'}", started ${session.started || '?'}.`,
    'It was never closed with end-session. Tell the author in one line and offer: continue it, or close it first.',
  ];
  if (session.baseline) {
    const stat = git(['diff', '--stat', session.baseline], dir);
    if (stat) lines.push('', 'Changes since its baseline:', '```', clipHead(stat, 1500, 'git diff --stat'), '```');
  }
  return lines.join('\n');
}

function identityBlock(dir, config) {
  if (!config.gitEmail) return null;
  if (git(['rev-parse', '--is-inside-work-tree'], dir) !== 'true') return null;
  const email = git(['config', 'user.email'], dir) || '(none)';
  if (email.toLowerCase() === String(config.gitEmail).toLowerCase()) return null;
  return [
    '## Git identity warning',
    `This repository commits as ${email}, not as the expected identity ${config.gitEmail}.`,
    'Tell the author before the first commit and offer to set the expected identity locally (git config user.email).',
  ].join('\n');
}

function statePart(dir, config) {
  const blocks = [
    '# psy-kit: where this project stands (loaded automatically)',
    'Use it to resume without making the author retype anything. Do not summarize it unprompted: wait for the author, or for start-session.',
  ];
  const state = readText(path.join(dir, 'STATE.md'));
  if (state) blocks.push(`## STATE.md\n\n${clipHead(state.trim(), STATE_LIMIT, 'STATE.md')}`);
  const journal = readText(path.join(dir, 'JOURNAL.md'));
  const entry = journal ? lastJournalEntry(journal) : null;
  if (entry) blocks.push(`## Last JOURNAL.md entry\n\n${clipMiddle(entry, JOURNAL_LIMIT, 'JOURNAL.md')}`);
  const session = openSessionBlock(dir);
  if (session) blocks.push(session);
  const identity = identityBlock(dir, config);
  if (identity) blocks.push(identity);
  return clipHead(blocks.join('\n\n'), PART_LIMIT, 'STATE.md');
}

function buildPart(part, dir, config) {
  if (!isPsyProject(dir)) return '';
  if (part === 'rules') return rulesPart();
  if (part === 'exchange') return exchangePart();
  if (part === 'profiles') return profilesPart(dir);
  if (part === 'state') return statePart(dir, config);
  return '';
}

function main() {
  const part = process.argv[2] || 'state';
  const input = parseJson(readStdin()) || {};
  const text = buildPart(part, resolveProjectDir(input), loadUserConfig());
  if (!text) return;
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: text } }),
  );
}

if (require.main === module) {
  try {
    main();
  } catch (_e) {
    /* never break a session */
  }
  process.exitCode = 0;
}

module.exports = { buildPart, detectProfiles, lastJournalEntry, clipHead, clipMiddle, stripFrontmatter, PART_LIMIT };
