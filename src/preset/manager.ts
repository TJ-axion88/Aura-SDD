import fs from 'fs';
import path from 'path';

export interface PresetEntry {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  files?: Record<string, string>;
}

export class PresetManager {
  private presetsDir: string;

  constructor(auraDir: string) {
    this.presetsDir = path.resolve(auraDir, 'presets');
  }

  list(): PresetEntry[] {
    if (!fs.existsSync(this.presetsDir)) return [];
    return fs
      .readdirSync(this.presetsDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(this.presetsDir, f), 'utf8'));
          return { id: f.replace('.json', ''), enabled: true, ...raw } as PresetEntry;
        } catch {
          return null;
        }
      })
      .filter((e): e is PresetEntry => e !== null);
  }

  apply(id: string, destRoot: string): void {
    const presetPath = path.join(this.presetsDir, `${id}.json`);
    if (!fs.existsSync(presetPath)) {
      throw new Error(`Preset not found: ${id}`);
    }
    const preset: PresetEntry = JSON.parse(fs.readFileSync(presetPath, 'utf8'));
    if (!preset.files) return;

    for (const [relPath, content] of Object.entries(preset.files)) {
      const dest = path.join(destRoot, relPath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, content, 'utf8');
    }
  }

  remove(id: string): void {
    const presetPath = path.join(this.presetsDir, `${id}.json`);
    if (!fs.existsSync(presetPath)) {
      throw new Error(`Preset not found: ${id}`);
    }
    fs.unlinkSync(presetPath);
  }

  save(entry: PresetEntry): void {
    fs.mkdirSync(this.presetsDir, { recursive: true });
    fs.writeFileSync(
      path.join(this.presetsDir, `${entry.id}.json`),
      JSON.stringify(entry, null, 2),
      'utf8',
    );
  }
}
