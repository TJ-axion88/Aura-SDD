import { describe, it, expect } from 'vitest';
import { loadManifest, getTemplatesRoot } from '../src/manifest/loader.js';
import { processManifest } from '../src/manifest/processor.js';
import { buildContext } from '../src/template/context.js';

describe('loadManifest', () => {
  it('loads claude-code manifest', () => {
    const m = loadManifest('claude-code');
    expect(m.version).toBe(1);
    expect(m.artifacts.length).toBeGreaterThan(0);
  });

  it('all 6 agent manifests are valid', () => {
    const agents = ['claude-code', 'cursor', 'copilot', 'codex', 'windsurf', 'gemini'];
    for (const agent of agents) {
      const m = loadManifest(agent);
      expect(m.version).toBe(1);
      expect(Array.isArray(m.artifacts)).toBe(true);
      expect(m.artifacts.length).toBeGreaterThan(0);
    }
  });

  it('each manifest has a workflows artifact', () => {
    const agents = ['claude-code', 'cursor', 'copilot', 'codex', 'windsurf', 'gemini'];
    for (const agent of agents) {
      const m = loadManifest(agent);
      const workflowArtifacts = m.artifacts.filter((a) => a.category === 'workflows');
      expect(workflowArtifacts.length).toBeGreaterThanOrEqual(3); // full-sdd + tdd + lean-sdd
    }
  });
});

describe('processManifest', () => {
  it('produces files for claude-code install', () => {
    const m = loadManifest('claude-code');
    const ctx = buildContext('claude-code', 'en', '.aura', 'full', '1.0.0');
    const templatesRoot = getTemplatesRoot();
    const files = processManifest(m, ctx, templatesRoot, '/tmp/test-project');
    expect(files.length).toBeGreaterThan(0);
    expect(files.every((f) => f.destPath.startsWith('/tmp/test-project'))).toBe(true);
  });

  it('applies profile condition — lean profile skips non-lean artifacts', () => {
    const m = loadManifest('claude-code');
    const mWithCondition = {
      ...m,
      artifacts: [
        ...m.artifacts,
        {
          id: 'lean_only',
          source: { type: 'templateFile' as const, from: 'shared/workflows/lean-sdd.json', toDir: '.aura/test' },
          category: 'workflows',
          when: { profile: 'lean' as const },
        },
      ],
    };
    const ctxFull = buildContext('claude-code', 'en', '.aura', 'full', '1.0.0');
    const ctxLean = buildContext('claude-code', 'en', '.aura', 'lean', '1.0.0');
    const templatesRoot = getTemplatesRoot();

    const fullFiles = processManifest(mWithCondition, ctxFull, templatesRoot, '/tmp/t');
    const leanFiles = processManifest(mWithCondition, ctxLean, templatesRoot, '/tmp/t');

    const leanOnlyInFull = fullFiles.filter((f) => f.artifactId === 'lean_only');
    const leanOnlyInLean = leanFiles.filter((f) => f.artifactId === 'lean_only');

    expect(leanOnlyInFull).toHaveLength(0);
    expect(leanOnlyInLean).toHaveLength(1);
  });
});
