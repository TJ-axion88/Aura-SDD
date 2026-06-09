import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AgentType } from '../agents/registry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_ROOT = path.resolve(__dirname, '../../templates');

export type ManifestArtifactSource =
  | { type: 'templateDir'; fromDir: string; toDir: string }
  | { type: 'templateFile'; from: string; toDir: string; rename?: string };

export type ManifestArtifact = {
  id: string;
  source: ManifestArtifactSource;
  category: string;
  when?: { agent?: AgentType; profile?: string };
};

export type Manifest = {
  version: number;
  artifacts: ManifestArtifact[];
};

export const loadManifest = (agentOrPath: AgentType | string): Manifest => {
  let manifestPath: string;

  if (agentOrPath.endsWith('.json') || agentOrPath.includes('/') || agentOrPath.includes('\\')) {
    manifestPath = path.resolve(agentOrPath);
  } else {
    manifestPath = path.join(TEMPLATES_ROOT, 'manifests', `${agentOrPath}.json`);
  }

  const raw = fs.readFileSync(manifestPath, 'utf8');
  return JSON.parse(raw) as Manifest;
};

export const getTemplatesRoot = (): string => TEMPLATES_ROOT;
