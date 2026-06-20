#!/usr/bin/env node
/**
 * check-template-purity.mjs
 *
 * Scans templates/ for developer-specific contamination markers.
 * Run via: npm run check:templates
 * Also wired as a git pre-commit hook by scripts/setup-hooks.mjs.
 *
 * Exit 0 = clean. Exit 1 = contamination found (blocks commit).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

// Patterns that must NEVER appear in templates/ — developer machine / identity specific
const CONTAMINATION_PATTERNS = [
  { pattern: /\/home\/[a-z0-9_.-]+\//,            label: '絶対Unixホームパス (/home/<user>/)' },
  { pattern: /\/Users\/[a-z0-9_.-]+\//,           label: '絶対macOSホームパス (/Users/<user>/)' },
  { pattern: /[a-z0-9_-]+@users\.noreply\.github\.com/, label: 'gitコミット用no-replyメール' },
  { pattern: /~\/\.ssh\/aura_sdd/,                label: 'SSH秘密鍵パス (~/.ssh/aura_sdd)' },
  { pattern: /GIT_SSH_COMMAND.*aura_sdd/,         label: 'SSH鍵を使ったGitコマンド' },
];

function* walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDir(full);
    else yield full;
  }
}

if (!fs.existsSync(TEMPLATES_DIR)) {
  process.stderr.write('Error: templates/ ディレクトリが見つかりません。Aura-SDDルートから実行してください。\n');
  process.exit(1);
}

const violations = [];

for (const file of walkDir(TEMPLATES_DIR)) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  for (const { pattern, label } of CONTAMINATION_PATTERNS) {
    if (pattern.test(content)) {
      violations.push({ file: rel, label });
    }
  }
}

if (violations.length > 0) {
  process.stderr.write('\n❌ テンプレート純粋性チェック失敗\n\n');
  for (const v of violations) {
    process.stderr.write(`  ${v.file}\n    → ${v.label}\n\n`);
  }
  process.stderr.write('templates/ に開発者固有の情報が含まれています。\n');
  process.stderr.write('これらを除去してから再コミットしてください。\n\n');
  process.exit(1);
}

process.stdout.write('✓ テンプレート純粋性チェック合格（汚染マーカーなし）\n');
