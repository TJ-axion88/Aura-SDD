export type ConflictPolicy = 'prompt' | 'skip' | 'force';

export type FileCategory = 'skills' | 'docs' | 'settings' | 'workflows' | 'unknown';

export const detectCategory = (relativePath: string): FileCategory => {
  if (relativePath.includes('/skills/') || relativePath.includes('\\skills\\')) return 'skills';
  if (
    relativePath.endsWith('CLAUDE.md') || relativePath.endsWith('AGENTS.md') ||
    relativePath.endsWith('GEMINI.md') || relativePath.endsWith('copilot-instructions.md') ||
    relativePath.endsWith('.cursorrules') || relativePath.endsWith('windsurf-context.md') ||
    relativePath.endsWith('opencode-context.md') || relativePath.endsWith('kiro-context.md') ||
    relativePath.endsWith('antigravity-context.md')
  ) return 'docs';
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

export class CategoryPolicyStore {
  private sticky = new Map<FileCategory, 'skip' | 'force'>();

  getEffective(category: FileCategory, base: ConflictPolicy): ConflictPolicy {
    return this.sticky.get(category) ?? base;
  }

  setSticky(category: FileCategory, decision: 'skip' | 'force'): void {
    this.sticky.set(category, decision);
  }

  clear(): void {
    this.sticky.clear();
  }
}
