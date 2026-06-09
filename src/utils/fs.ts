import fs from 'fs';
import path from 'path';

export const readFileOr = (filePath: string, fallback: string): string => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return fallback;
  }
};

export const writeFileSafe = (filePath: string, content: string): void => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
};

export const copyFileSafe = (src: string, dest: string): void => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
};

export const fileExists = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
};

export const dirExists = (dirPath: string): boolean => {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
};

export const listFiles = (dirPath: string): string[] => {
  if (!dirExists(dirPath)) return [];
  return fs.readdirSync(dirPath);
};

export const listFilesRecursive = (dirPath: string, base = dirPath): string[] => {
  if (!dirExists(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(full, base));
    } else {
      files.push(path.relative(base, full));
    }
  }
  return files;
};

export const backupFile = (filePath: string, backupDir?: string): string => {
  const dir = backupDir ?? path.dirname(filePath);
  const name = path.basename(filePath);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = path.join(dir, `${name}.${ts}.bak`);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(filePath, dest);
  return dest;
};
