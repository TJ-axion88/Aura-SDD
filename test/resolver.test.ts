import { describe, it, expect } from 'vitest';
import { TemplateResolver } from '../src/template/resolver.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aura-resolver-'));

describe('TemplateResolver', () => {
  it('throws when template not found in empty dirs', () => {
    const dir = tmpDir();
    const builtinDir = tmpDir();
    const resolver = new TemplateResolver(dir, builtinDir);
    expect(() => resolver.resolve('nonexistent-template.md')).toThrow('Template not found');
  });

  it('returns built-in content when present', () => {
    const projectDir = tmpDir();
    const builtinDir = tmpDir();
    fs.writeFileSync(path.join(builtinDir, 'spec.md'), '# Built-in Spec');

    const resolver = new TemplateResolver(projectDir, builtinDir);
    const result = resolver.resolve('spec.md');
    expect(result).toBe('# Built-in Spec');
  });

  it('local override takes priority over built-in', () => {
    const projectDir = tmpDir();
    const builtinDir = tmpDir();

    // Built-in
    fs.writeFileSync(path.join(builtinDir, 'spec.md'), '# Built-in Spec');

    // Local override at .aura/templates/overrides/spec.md
    const overridesDir = path.join(projectDir, '.aura', 'templates', 'overrides');
    fs.mkdirSync(overridesDir, { recursive: true });
    fs.writeFileSync(path.join(overridesDir, 'spec.md'), '# Local Override');

    const resolver = new TemplateResolver(projectDir, builtinDir);
    const result = resolver.resolve('spec.md');
    expect(result).toBe('# Local Override');
  });

  it('compose replace returns override only', () => {
    const resolver = new TemplateResolver(tmpDir(), tmpDir());
    expect(resolver.compose('base', 'override', 'replace')).toBe('override');
  });

  it('compose prepend puts override before base', () => {
    const resolver = new TemplateResolver(tmpDir(), tmpDir());
    expect(resolver.compose('base', 'prefix', 'prepend')).toBe('prefix\n\nbase');
  });

  it('compose append puts override after base', () => {
    const resolver = new TemplateResolver(tmpDir(), tmpDir());
    expect(resolver.compose('base', 'suffix', 'append')).toBe('base\n\nsuffix');
  });
});
