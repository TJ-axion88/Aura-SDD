import { describe, it, expect } from 'vitest';
import { agentList, getAgentDefinition } from '../src/agents/registry.js';

describe('agentList', () => {
  it('contains all 6 agents', () => {
    expect(agentList).toHaveLength(6);
    expect(agentList).toContain('claude-code');
    expect(agentList).toContain('cursor');
    expect(agentList).toContain('copilot');
    expect(agentList).toContain('codex');
    expect(agentList).toContain('windsurf');
    expect(agentList).toContain('gemini');
  });
});

describe('getAgentDefinition', () => {
  it('returns claude-code definition', () => {
    const def = getAgentDefinition('claude-code');
    expect(def.label).toBe('Claude Code');
    expect(def.manifestId).toBe('claude-code');
    expect(def.layout.commandsDir).toBe('.claude/skills');
    expect(def.layout.docFile).toBe('CLAUDE.md');
  });

  it('each agent has required fields', () => {
    for (const agent of agentList) {
      const def = getAgentDefinition(agent);
      expect(def.label).toBeTruthy();
      expect(def.manifestId).toBeTruthy();
      expect(def.layout.commandsDir).toBeTruthy();
      expect(def.layout.docFile).toBeTruthy();
      expect(def.aliasFlags.length).toBeGreaterThan(0);
    }
  });
});
