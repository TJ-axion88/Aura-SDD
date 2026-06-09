import fs from 'fs';
import path from 'path';
import { fileExists, writeFileSafe, listFilesRecursive, backupFile } from '../utils/fs.js';
import { loadExtensionManifest, listExtensions } from './registry.js';
import { getAgentDefinition, type AgentType } from '../agents/registry.js';

export class ExtensionManager {
  private auraDir: string;
  private projectRoot: string;
  private agent: AgentType;

  constructor(auraDir: string, projectRoot: string, agent: AgentType) {
    this.auraDir = auraDir;
    this.projectRoot = projectRoot;
    this.agent = agent;
  }

  list() {
    return listExtensions(this.auraDir);
  }

  install(extId: string, sourcePath: string): void {
    const destDir = path.join(this.auraDir, 'extensions', extId);
    if (fileExists(destDir)) {
      throw new Error(`Extension "${extId}" is already installed. Use update to upgrade.`);
    }
    this.copyDirectory(sourcePath, destDir);
    const manifest = loadExtensionManifest(destDir);
    this.registerSkills(extId, destDir, manifest.skills ?? []);
    console.log(`Extension "${manifest.name}" installed.`);
  }

  remove(extId: string, keepConfig = false): void {
    const extDir = path.join(this.auraDir, 'extensions', extId);
    if (!fileExists(extDir)) {
      throw new Error(`Extension "${extId}" is not installed.`);
    }
    const manifest = loadExtensionManifest(extDir);
    this.deregisterSkills(extId, manifest.skills ?? []);
    if (!keepConfig) {
      fs.rmSync(extDir, { recursive: true, force: true });
    }
    console.log(`Extension "${manifest.name}" removed.`);
  }

  enable(extId: string): void {
    const marker = path.join(this.auraDir, 'extensions', extId, '.disabled');
    if (fileExists(marker)) fs.unlinkSync(marker);
  }

  disable(extId: string): void {
    const marker = path.join(this.auraDir, 'extensions', extId, '.disabled');
    writeFileSafe(marker, '');
  }

  private registerSkills(extId: string, extDir: string, skills: Array<{ name: string; file: string }>): void {
    const agentDef = getAgentDefinition(this.agent);
    const commandsDir = path.join(this.projectRoot, agentDef.layout.commandsDir);

    for (const skill of skills) {
      const srcSkillDir = path.join(extDir, path.dirname(skill.file));
      const skillName = skill.name;
      const destSkillDir = path.join(commandsDir, skillName);
      if (fileExists(srcSkillDir)) {
        this.copyDirectory(srcSkillDir, destSkillDir);
        console.log(`  Registered skill: /${skillName}`);
      }
    }
  }

  private deregisterSkills(extId: string, skills: Array<{ name: string; file: string }>): void {
    const agentDef = getAgentDefinition(this.agent);
    const commandsDir = path.join(this.projectRoot, agentDef.layout.commandsDir);

    for (const skill of skills) {
      const destSkillDir = path.join(commandsDir, skill.name);
      if (fileExists(destSkillDir)) {
        fs.rmSync(destSkillDir, { recursive: true, force: true });
        console.log(`  Deregistered skill: /${skill.name}`);
      }
    }
  }

  private copyDirectory(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    const files = listFilesRecursive(src);
    for (const rel of files) {
      const srcFile = path.join(src, rel);
      const destFile = path.join(dest, rel);
      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      fs.copyFileSync(srcFile, destFile);
    }
  }
}
