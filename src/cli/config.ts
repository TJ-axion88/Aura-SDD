import type { AgentType } from '../agents/registry.js';
import type { SupportedLanguage } from '../utils/languages.js';
import type { ParsedArgs, OverwritePolicy, Profile, OsTarget } from './args.js';

export type ResolvedConfig = {
  agent?: AgentType;
  lang: SupportedLanguage;
  overwrite: OverwritePolicy;
  yes: boolean;
  dryRun: boolean;
  backup: boolean | string;
  auraDir: string;
  manifestPath?: string;
  profile: Profile;
  os: Exclude<OsTarget, 'auto'>;
};

const DEFAULT_LANG: SupportedLanguage = 'en';
const DEFAULT_AURA_DIR = '.aura';

export const detectOs = (): Exclude<OsTarget, 'auto'> => {
  const p = process.platform;
  if (p === 'darwin') return 'mac';
  if (p === 'win32') return 'windows';
  return 'linux';
};

export const resolveOs = (os: OsTarget | undefined): Exclude<OsTarget, 'auto'> => {
  if (!os || os === 'auto') return detectOs();
  return os;
};

export const resolveConfig = (args: ParsedArgs): ResolvedConfig => ({
  agent: args.agent,
  lang: args.lang ?? DEFAULT_LANG,
  overwrite: args.overwrite ?? 'prompt',
  yes: args.yes ?? false,
  dryRun: args.dryRun ?? false,
  backup: args.backup ?? false,
  auraDir: args.auraDir ?? DEFAULT_AURA_DIR,
  manifestPath: args.manifest,
  profile: args.profile ?? 'full',
  os: resolveOs(args.os),
});
