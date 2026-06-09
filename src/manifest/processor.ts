import path from 'path';
import { listFilesRecursive, fileExists } from '../utils/fs.js';
import { assertSafePath } from '../utils/pathSafety.js';
import type { Manifest, ManifestArtifact } from './loader.js';
import type { TemplateContext } from '../template/context.js';
import { renderTemplate } from '../template/renderer.js';

export type ProcessedFile = {
  srcPath: string;
  destPath: string;
  artifactId: string;
  category: string;
};

export const processManifest = (
  manifest: Manifest,
  context: TemplateContext,
  templatesRoot: string,
  destRoot: string,
): ProcessedFile[] => {
  const files: ProcessedFile[] = [];

  for (const artifact of manifest.artifacts) {
    if (!matchesCondition(artifact, context)) continue;

    const { source } = artifact;

    if (source.type === 'templateDir') {
      const srcDir = path.join(
        templatesRoot,
        renderTemplate(source.fromDir, context),
      );
      const toDir = renderTemplate(source.toDir, context);
      assertSafePath(destRoot, toDir);

      const relFiles = listFilesRecursive(srcDir);
      for (const rel of relFiles) {
        files.push({
          srcPath: path.join(srcDir, rel),
          destPath: path.join(destRoot, toDir, rel),
          artifactId: artifact.id,
          category: artifact.category,
        });
      }
    } else if (source.type === 'templateFile') {
      const srcPath = path.join(
        templatesRoot,
        renderTemplate(source.from, context),
      );
      if (!fileExists(srcPath)) continue;

      const toDir = renderTemplate(source.toDir, context);
      assertSafePath(destRoot, toDir);

      const fileName = source.rename
        ? renderTemplate(source.rename, context)
        : path.basename(srcPath);

      files.push({
        srcPath,
        destPath: path.join(destRoot, toDir, fileName),
        artifactId: artifact.id,
        category: artifact.category,
      });
    }
  }

  return files;
};

const matchesCondition = (
  artifact: ManifestArtifact,
  context: TemplateContext,
): boolean => {
  if (!artifact.when) return true;
  if (artifact.when.agent && artifact.when.agent !== context.AGENT) return false;
  if (artifact.when.profile && artifact.when.profile !== context.PROFILE) return false;
  return true;
};
