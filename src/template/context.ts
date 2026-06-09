import { getAgentDefinition, type AgentType } from '../agents/registry.js';
import type { SupportedLanguage } from '../utils/languages.js';
import type { Profile, OsTarget } from '../cli/args.js';

export type TemplateContext = {
  AGENT: AgentType;
  AGENT_LABEL: string;
  AGENT_DIR: string;
  AGENT_DOC: string;
  AGENT_COMMANDS_DIR: string;
  LANG: SupportedLanguage;
  AURA_DIR: string;
  PROFILE: Profile;
  VERSION: string;
  OS: Exclude<OsTarget, 'auto'>;
};

export const buildContext = (
  agent: AgentType,
  lang: SupportedLanguage,
  auraDir: string,
  profile: Profile,
  version = '2.0.0',
  os: Exclude<OsTarget, 'auto'> = 'linux',
): TemplateContext => {
  const def = getAgentDefinition(agent);
  return {
    AGENT: agent,
    AGENT_LABEL: def.label,
    AGENT_DIR: def.layout.agentDir,
    AGENT_DOC: def.layout.docFile,
    AGENT_COMMANDS_DIR: def.layout.commandsDir,
    LANG: lang,
    AURA_DIR: auraDir,
    PROFILE: profile,
    VERSION: version,
    OS: os,
  };
};
