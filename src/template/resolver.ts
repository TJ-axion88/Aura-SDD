import fs from 'fs';
import path from 'path';
import { fileExists } from '../utils/fs.js';

export type CompositionStrategy = 'replace' | 'prepend' | 'append';

export type PresetOverride = {
  strategy: CompositionStrategy;
  content: string;
};

export class TemplateResolver {
  private projectRoot: string;
  private builtinDir: string;

  constructor(projectRoot: string, builtinDir: string) {
    this.projectRoot = projectRoot;
    this.builtinDir = builtinDir;
  }

  resolve(templateName: string): string {
    const auraDir = path.join(this.projectRoot, '.aura');

    // 1. Project-local override
    const localOverride = path.join(auraDir, 'templates', 'overrides', templateName);
    if (fileExists(localOverride)) return fs.readFileSync(localOverride, 'utf8');

    // 2. Installed presets (sorted by priority)
    const presetsDir = path.join(auraDir, 'presets');
    const presetContent = this.resolveFromPresets(presetsDir, templateName);
    if (presetContent !== null) return presetContent;

    // 3. Installed extensions
    const extensionsDir = path.join(auraDir, 'extensions');
    const extContent = this.resolveFromExtensions(extensionsDir, templateName);
    if (extContent !== null) return extContent;

    // 4. Built-in default
    const builtin = path.join(this.builtinDir, templateName);
    if (fileExists(builtin)) return fs.readFileSync(builtin, 'utf8');

    throw new Error(`Template not found: "${templateName}"`);
  }

  private resolveFromPresets(presetsDir: string, name: string): string | null {
    if (!fileExists(presetsDir)) return null;

    const entries = fs.readdirSync(presetsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => {
        const configPath = path.join(presetsDir, e.name, 'preset.yml');
        const priority = this.readPriority(configPath);
        return { name: e.name, priority };
      })
      .sort((a, b) => a.priority - b.priority);

    for (const entry of entries) {
      const tmpl = path.join(presetsDir, entry.name, 'templates', name);
      if (fileExists(tmpl)) return fs.readFileSync(tmpl, 'utf8');
    }
    return null;
  }

  private resolveFromExtensions(extensionsDir: string, name: string): string | null {
    if (!fileExists(extensionsDir)) return null;

    const entries = fs.readdirSync(extensionsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory());

    for (const entry of entries) {
      const tmpl = path.join(extensionsDir, entry.name, 'templates', name);
      if (fileExists(tmpl)) return fs.readFileSync(tmpl, 'utf8');
    }
    return null;
  }

  private readPriority(configPath: string): number {
    if (!fileExists(configPath)) return 999;
    const content = fs.readFileSync(configPath, 'utf8');
    const match = content.match(/priority:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 999;
  }

  compose(base: string, override: string, strategy: CompositionStrategy): string {
    switch (strategy) {
      case 'replace': return override;
      case 'prepend': return override + '\n\n' + base;
      case 'append': return base + '\n\n' + override;
    }
  }
}
