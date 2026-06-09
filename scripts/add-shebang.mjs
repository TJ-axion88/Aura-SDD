import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const cliPath = join(process.cwd(), 'dist', 'cli.js');
const content = readFileSync(cliPath, 'utf8');
if (!content.startsWith('#!/usr/bin/env node')) {
  writeFileSync(cliPath, '#!/usr/bin/env node\n' + content);
}
import { chmodSync } from 'fs';
chmodSync(cliPath, 0o755);
