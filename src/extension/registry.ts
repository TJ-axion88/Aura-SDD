import fs from 'fs';
import path from 'path';
import { fileExists } from '../utils/fs.js';

export type ExtensionSkill = {
  name: string;
  file: string;
};

export type ExtensionHooks = {
  post_impl?: string;
  pre_spec?: string;
};

export type ExtensionManifest = {
  name: string;
  version: string;
  description?: string;
  skills?: ExtensionSkill[];
  hooks?: ExtensionHooks;
  requires?: { aura?: string };
};

export type InstalledExtension = ExtensionManifest & {
  id: string;
  installPath: string;
  enabled: boolean;
};

export const loadExtensionManifest = (extDir: string): ExtensionManifest => {
  const manifestPath = path.join(extDir, 'extension.yml');
  if (!fileExists(manifestPath)) {
    throw new Error(`Extension manifest not found: ${manifestPath}`);
  }
  // Minimal YAML parse: read key: value pairs
  const content = fs.readFileSync(manifestPath, 'utf8');
  return parseExtensionYml(content);
};

const parseExtensionYml = (content: string): ExtensionManifest => {
  // For v1.0 we support JSON-embedded extension manifests via .json files too
  // Full YAML parsing requires external dep; use structured format
  const lines = content.split('\n');
  const manifest: Partial<ExtensionManifest> = {};
  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    const val = rest.join(':').trim();
    if (key?.trim() === 'name') manifest.name = val;
    else if (key?.trim() === 'version') manifest.version = val;
    else if (key?.trim() === 'description') manifest.description = val;
  }
  return manifest as ExtensionManifest;
};

export const listExtensions = (auraDir: string): InstalledExtension[] => {
  const extDir = path.join(auraDir, 'extensions');
  if (!fileExists(extDir)) return [];

  return fs.readdirSync(extDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const installPath = path.join(extDir, e.name);
      try {
        const manifest = loadExtensionManifest(installPath);
        const disabledMarker = path.join(installPath, '.disabled');
        return { ...manifest, id: e.name, installPath, enabled: !fileExists(disabledMarker) };
      } catch {
        return null;
      }
    })
    .filter((e): e is InstalledExtension => e !== null);
};
