import type { AgentType } from '../agents/registry.js';
import type { SupportedLanguage } from '../utils/languages.js';
import type { ParsedArgs, OverwritePolicy, Profile } from './args.js';

export type ResolvedConfig = {
  agent: AgentType;
  lang: SupportedLanguage;
  overwrite: OverwritePolicy;
  yes: boolean;
  dryRun: boolean;
  backup: boolean | string;
  auraDir: string;
  manifestPath?: string;
  profile: Profile;
};

const DEFAULT_AGENT: AgentType = 'claude-code';
const DEFAULT_LANG: SupportedLanguage = 'en';
const DEFAULT_AURA_DIR = '.aura';

export const resolveConfig = (args: ParsedArgs): ResolvedConfig => ({
  agent: args.agent ?? DEFAULT_AGENT,
  lang: args.lang ?? DEFAULT_LANG,
  overwrite: args.overwrite ?? 'prompt',
  yes: args.yes ?? false,
  dryRun: args.dryRun ?? false,
  backup: args.backup ?? false,
  auraDir: args.auraDir ?? DEFAULT_AURA_DIR,
  manifestPath: args.manifest,
  profile: args.profile ?? 'full',
});
