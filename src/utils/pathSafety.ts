import path from 'path';

export const isSafePath = (base: string, target: string): boolean => {
  const resolved = path.resolve(base, target);
  const normalizedBase = path.resolve(base);
  return resolved.startsWith(normalizedBase + path.sep) || resolved === normalizedBase;
};

export const assertSafePath = (base: string, target: string): void => {
  if (!isSafePath(base, target)) {
    throw new Error(`Path traversal detected: "${target}" escapes base "${base}"`);
  }
};

export const sanitizeRelativePath = (p: string): string => {
  const normalized = path.normalize(p);
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
    throw new Error(`Unsafe path segment: "${p}"`);
  }
  return normalized;
};
