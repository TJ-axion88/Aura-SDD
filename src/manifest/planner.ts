import { fileExists } from '../utils/fs.js';
import { detectCategory } from '../cli/policies.js';
import type { ProcessedFile } from './processor.js';

export type FileAction = 'write' | 'skip' | 'overwrite' | 'backup_overwrite' | 'prompt';

export type PlannedFile = ProcessedFile & {
  action: FileAction;
  exists: boolean;
};

export const planInstall = (
  files: ProcessedFile[],
  overwritePolicy: 'prompt' | 'skip' | 'force',
): PlannedFile[] =>
  files.map((f) => {
    const exists = fileExists(f.destPath);
    let action: FileAction;

    if (!exists) {
      action = 'write';
    } else if (overwritePolicy === 'force') {
      action = 'overwrite';
    } else if (overwritePolicy === 'skip') {
      action = 'skip';
    } else {
      action = 'prompt';
    }

    return { ...f, action, exists };
  });

export const summarizePlan = (planned: PlannedFile[]): string => {
  const write = planned.filter((f) => f.action === 'write').length;
  const overwrite = planned.filter((f) => f.action === 'overwrite').length;
  const skip = planned.filter((f) => f.action === 'skip').length;
  const prompt = planned.filter((f) => f.action === 'prompt').length;
  const parts = [];
  if (write > 0) parts.push(`${write} new`);
  if (overwrite > 0) parts.push(`${overwrite} overwrite`);
  if (skip > 0) parts.push(`${skip} skip`);
  if (prompt > 0) parts.push(`${prompt} conflict (will prompt)`);
  return parts.join(', ');
};
