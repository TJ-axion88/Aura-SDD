import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../src/template/renderer.js';

describe('renderTemplate', () => {
  it('substitutes known variables', () => {
    const result = renderTemplate('Hello {{AGENT}} in {{LANG}}', {
      AGENT: 'claude-code',
      AGENT_LABEL: 'Claude Code',
      AGENT_DIR: '.claude',
      AGENT_DOC: 'CLAUDE.md',
      AGENT_COMMANDS_DIR: '.claude/skills',
      LANG: 'ja',
      AURA_DIR: '.aura',
      PROFILE: 'full',
      VERSION: '1.0.0',
    });
    expect(result).toBe('Hello claude-code in ja');
  });

  it('leaves unknown variables unchanged', () => {
    const result = renderTemplate('{{UNKNOWN_VAR}}', {
      AGENT: 'claude-code',
      AGENT_LABEL: 'Claude Code',
      AGENT_DIR: '.claude',
      AGENT_DOC: 'CLAUDE.md',
      AGENT_COMMANDS_DIR: '.claude/skills',
      LANG: 'en',
      AURA_DIR: '.aura',
      PROFILE: 'full',
      VERSION: '1.0.0',
    });
    expect(result).toBe('{{UNKNOWN_VAR}}');
  });

  it('handles multiple occurrences', () => {
    const result = renderTemplate('{{AURA_DIR}}/specs and {{AURA_DIR}}/steering', {
      AGENT: 'claude-code',
      AGENT_LABEL: 'Claude Code',
      AGENT_DIR: '.claude',
      AGENT_DOC: 'CLAUDE.md',
      AGENT_COMMANDS_DIR: '.claude/skills',
      LANG: 'en',
      AURA_DIR: '.aura',
      PROFILE: 'full',
      VERSION: '1.0.0',
    });
    expect(result).toBe('.aura/specs and .aura/steering');
  });
});
