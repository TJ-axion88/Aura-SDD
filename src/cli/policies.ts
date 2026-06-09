export type ConflictPolicy = 'prompt' | 'skip' | 'force';

export type FileCategory = 'skills' | 'docs' | 'settings' | 'workflows' | 'unknown';

export const detectCategory = (relativePath: string): FileCategory => {
  if (relativePath.includes('/skills/') || relativePath.includes('\\skills\\')) return 'skills';
  if (relativePath.endsWith('CLAUDE.md') || relativePath.endsWith('AGENTS.md') ||
      relativePath.endsWith('GEMINI.md') || relativePath.endsWith('copilot-instructions.md') ||
      relativePath.endsWith('.cursorrules') || relativePath.endsWith('windsurf-context.md')) return 'docs';
  if (relativePath.includes('/settings/') || relativePath.includes('\\settings\\')) return 'settings';
  if (relativePath.includes('/workflows/') || relativePath.includes('\\workflows\\')) return 'workflows';
  return 'unknown';
};

export const defaultPolicy: Record<FileCategory, ConflictPolicy> = {
  skills: 'prompt',
  docs: 'prompt',
  settings: 'skip',
  workflows: 'skip',
  unknown: 'prompt',
};
