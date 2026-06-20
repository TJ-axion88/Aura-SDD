import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

const CONTAMINATION_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\/home\/[a-z0-9_.-]+\//,          label: 'absolute Unix home path (/home/<user>/)' },
  { pattern: /\/Users\/[a-z0-9_.-]+\//,         label: 'absolute macOS home path (/Users/<user>/)' },
  { pattern: /[a-z0-9_-]+@users\.noreply\.github\.com/, label: 'git no-reply commit email' },
  { pattern: /~\/\.ssh\/aura_sdd/,              label: 'SSH key path (~/.ssh/aura_sdd)' },
  { pattern: /GIT_SSH_COMMAND.*aura_sdd/,       label: 'SSH-keyed git command' },
];

function walkDir(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

describe('Template purity', () => {
  const files = walkDir(TEMPLATES_DIR);

  for (const { pattern, label } of CONTAMINATION_PATTERNS) {
    it(`templates/ must not contain: ${label}`, () => {
      const violations: string[] = [];
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        if (pattern.test(content)) {
          violations.push(path.relative(ROOT, file));
        }
      }
      if (violations.length > 0) {
        expect.fail(
          `Contamination found in templates/:\n` +
          violations.map(f => `  ${f}`).join('\n'),
        );
      }
      expect(violations).toHaveLength(0);
    });
  }
});
