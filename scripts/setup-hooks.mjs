#!/usr/bin/env node
/**
 * setup-hooks.mjs
 *
 * One-time setup: installs git pre-commit hook that runs check-template-purity.mjs.
 * Run once after cloning: node scripts/setup-hooks.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const HOOK_CONTENT = `#!/bin/sh
# pre-commit hook: テンプレート純粋性チェック（setup-hooks.mjs が生成）
cd "$(git rev-parse --show-toplevel)"
node scripts/check-template-purity.mjs
if [ $? -ne 0 ]; then
  echo ""
  echo "コミットをブロックしました。templates/ の汚染マーカーを除去してください。"
  exit 1
fi
`;

const hooksDir = path.join(ROOT, '.git', 'hooks');
const hookPath = path.join(hooksDir, 'pre-commit');

if (!fs.existsSync(hooksDir)) {
  process.stderr.write('Error: .git/hooks/ が見つかりません。Aura-SDDリポジトリルートから実行してください。\n');
  process.exit(1);
}

fs.writeFileSync(hookPath, HOOK_CONTENT, { mode: 0o755 });
process.stdout.write(`✓ pre-commit フック設定完了: ${hookPath}\n`);
process.stdout.write('  コミット前に自動的にテンプレート純粋性チェックが実行されます。\n');
