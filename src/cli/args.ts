import { agentList, getAgentDefinition, type AgentType } from '../agents/registry.js';
import { supportedLanguages, type SupportedLanguage } from '../utils/languages.js';

export type OverwritePolicy = 'prompt' | 'skip' | 'force';
export type Profile = 'full' | 'lean';

export type ParsedArgs = {
  agent?: AgentType;
  lang?: SupportedLanguage;
  overwrite?: OverwritePolicy;
  yes?: boolean;
  dryRun?: boolean;
  backup?: boolean | string;
  auraDir?: string;
  manifest?: string;
  profile?: Profile;
  help?: boolean;
  version?: boolean;
  // subcommands
  subcommand?: string;
  subcommandArgs?: string[];
};

const agentAliasMap = new Map<string, AgentType>();
const agentValueMap = new Map<string, AgentType>();

for (const agent of agentList) {
  const def = getAgentDefinition(agent);
  agentAliasMap.set(agent, agent);
  agentValueMap.set(agent, agent);
  def.aliasFlags.forEach((flag) => {
    const name = flag.startsWith('--') ? flag.slice(2) : flag;
    agentAliasMap.set(name, agent);
    agentValueMap.set(name, agent);
  });
}

const BOOLEAN_FLAGS = new Set([
  'yes', 'y', 'dry-run', 'backup', 'help', 'h', 'version', 'v', ...agentAliasMap.keys(),
]);
const VALUE_FLAGS = new Set([
  'agent', 'lang', 'overwrite', 'aura-dir', 'backup', 'manifest', 'profile',
]);
const SUBCOMMANDS = new Set(['workflow', 'extension', 'preset']);

const isKnownFlag = (name: string): boolean =>
  BOOLEAN_FLAGS.has(name) || VALUE_FLAGS.has(name);

const isEnum = <T extends string>(val: string, allowed: readonly T[]): val is T =>
  (allowed as readonly string[]).includes(val);

export const parseArgs = (argv: string[]): ParsedArgs => {
  const out: ParsedArgs = {};
  let i = 0;

  // detect subcommand first
  if (argv.length > 0 && SUBCOMMANDS.has(argv[0])) {
    out.subcommand = argv[0];
    out.subcommandArgs = argv.slice(1);
    return out;
  }

  let seenAgent: AgentType | undefined;
  const setAgent = (value: AgentType) => {
    if (seenAgent && seenAgent !== value) {
      throw new Error('Conflicting agent flags');
    }
    seenAgent = value;
    out.agent = value;
  };

  while (i < argv.length) {
    const token = argv[i++];

    if (!token.startsWith('-')) {
      throw new Error(`Unknown positional argument: "${token}"`);
    }
    if (token === '-y') { out.yes = true; continue; }
    if (token === '-h') { out.help = true; continue; }
    if (token === '-v') { out.version = true; continue; }

    if (token.startsWith('--')) {
      const eqIdx = token.indexOf('=');
      const name = token.slice(2, eqIdx > -1 ? eqIdx : undefined);

      if (!isKnownFlag(name)) throw new Error(`Unknown flag: --${name}`);

      const aliasAgent = agentAliasMap.get(name);
      if (aliasAgent && !VALUE_FLAGS.has(name)) { setAgent(aliasAgent); continue; }

      let value: string | true | undefined;
      if (eqIdx > -1) {
        value = token.slice(eqIdx + 1);
      } else if (VALUE_FLAGS.has(name)) {
        const peek = argv[i];
        if (peek && !peek.startsWith('-')) { value = peek; i += 1; }
        else if (name === 'backup') { value = true; }
        else throw new Error(`Flag --${name} requires a value`);
      } else {
        value = true;
      }

      switch (name) {
        case 'help': case 'h': out.help = true; break;
        case 'version': case 'v': out.version = true; break;
        case 'dry-run': out.dryRun = true; break;
        case 'yes': out.yes = true; break;
        case 'y': out.yes = true; break;
        case 'backup':
          out.backup = value === true ? true : String(value); break;
        case 'aura-dir': out.auraDir = String(value); break;
        case 'lang': {
          const v = String(value);
          if (!isEnum(v, supportedLanguages)) throw new Error(`Invalid --lang: "${v}"`);
          out.lang = v; break;
        }
        case 'overwrite': {
          const v = String(value);
          if (!isEnum(v, ['prompt', 'skip', 'force'] as const))
            throw new Error(`Invalid --overwrite: "${v}"`);
          out.overwrite = v; break;
        }
        case 'manifest': out.manifest = String(value); break;
        case 'profile': {
          const v = String(value);
          if (!isEnum(v, ['full', 'lean'] as const))
            throw new Error(`Invalid --profile: "${v}"`);
          out.profile = v; break;
        }
        case 'agent': {
          const v = String(value);
          const mapped = agentValueMap.get(v as AgentType);
          if (!mapped) throw new Error(`Invalid --agent: "${v}"`);
          setAgent(mapped); break;
        }
        default: {
          const mapped = agentAliasMap.get(name);
          if (mapped) { setAgent(mapped); break; }
          if (!BOOLEAN_FLAGS.has(name)) throw new Error(`Unknown flag: --${name}`);
          break;
        }
      }
    }
  }

  return out;
};
