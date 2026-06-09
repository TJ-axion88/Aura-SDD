import { describe, it, expect } from 'vitest';
import { parseArgs } from '../src/cli/args.js';

describe('parseArgs', () => {
  it('parses --claude-code flag', () => {
    const result = parseArgs(['--claude-code']);
    expect(result.agent).toBe('claude-code');
  });

  it('parses --claude alias', () => {
    const result = parseArgs(['--claude']);
    expect(result.agent).toBe('claude-code');
  });

  it('parses --cursor flag', () => {
    const result = parseArgs(['--cursor']);
    expect(result.agent).toBe('cursor');
  });

  it('parses --lang ja', () => {
    const result = parseArgs(['--lang', 'ja']);
    expect(result.lang).toBe('ja');
  });

  it('parses --dry-run', () => {
    const result = parseArgs(['--dry-run']);
    expect(result.dryRun).toBe(true);
  });

  it('parses --profile lean', () => {
    const result = parseArgs(['--profile', 'lean']);
    expect(result.profile).toBe('lean');
  });

  it('parses -y shorthand', () => {
    const result = parseArgs(['-y']);
    expect(result.yes).toBe(true);
  });

  it('detects workflow subcommand', () => {
    const result = parseArgs(['workflow', 'run', 'full-sdd']);
    expect(result.subcommand).toBe('workflow');
    expect(result.subcommandArgs).toEqual(['run', 'full-sdd']);
  });

  it('throws on unknown flag', () => {
    expect(() => parseArgs(['--unknown-flag'])).toThrow();
  });

  it('throws on conflicting agents', () => {
    expect(() => parseArgs(['--claude', '--cursor'])).toThrow();
  });
});
