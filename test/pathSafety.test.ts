import { describe, it, expect } from 'vitest';
import { isSafePath, assertSafePath, sanitizeRelativePath } from '../src/utils/pathSafety.js';

describe('isSafePath', () => {
  it('allows paths within base', () => {
    expect(isSafePath('/base/dir', 'sub/file.txt')).toBe(true);
  });

  it('blocks path traversal with ..', () => {
    expect(isSafePath('/base/dir', '../../etc/passwd')).toBe(false);
  });

  it('allows exact base path', () => {
    expect(isSafePath('/base/dir', '.')).toBe(true);
  });
});

describe('assertSafePath', () => {
  it('does not throw for safe path', () => {
    expect(() => assertSafePath('/base', 'sub/file')).not.toThrow();
  });

  it('throws for traversal', () => {
    expect(() => assertSafePath('/base', '../../etc/passwd')).toThrow('Path traversal');
  });
});

describe('sanitizeRelativePath', () => {
  it('accepts normal relative paths', () => {
    expect(sanitizeRelativePath('src/file.ts')).toBe('src/file.ts');
  });

  it('throws for paths starting with ..', () => {
    expect(() => sanitizeRelativePath('../escape')).toThrow('Unsafe path');
  });

  it('throws for absolute paths', () => {
    expect(() => sanitizeRelativePath('/absolute/path')).toThrow('Unsafe path');
  });
});
