export interface AgentLayout {
  commandsDir: string;
  agentDir: string;
  docFile: string;
  commandsSubDir?: string;
}

export interface AgentCommandHints {
  discovery: string;
  spec: string;
  impl: string;
  steering: string;
}

export interface AgentDefinition {
  label: string;
  description: string;
  aliasFlags: string[];
  recommendedModels: string[];
  layout: AgentLayout;
  commands: AgentCommandHints;
  manifestId: string;
  commandFormat: 'skill' | 'markdown' | 'toml' | 'yaml';
}

export const agentDefinitions = {
  'claude-code': {
    label: 'Claude Code',
    description:
      'Installs Aura skills in `.claude/skills/aura-*/`, shared settings in `.aura/settings/`, and a CLAUDE.md quickstart.',
    aliasFlags: ['--claude-code', '--claude'],
    recommendedModels: [
      'Planning/review: Claude Opus 4.8 or newer',
      'Implementation: Claude Sonnet 4.6 or newer',
    ],
    layout: {
      commandsDir: '.claude/skills',
      agentDir: '.claude',
      docFile: 'CLAUDE.md',
    },
    commands: {
      discovery: '`/aura-discovery <idea>`',
      spec: '`/aura-spec <feature>`',
      impl: '`/aura-impl <feature>`',
      steering: '`/aura-steering`',
    },
    manifestId: 'claude-code',
    commandFormat: 'skill',
  },
  cursor: {
    label: 'Cursor',
    description:
      'Installs Aura commands in `.cursor/rules/aura/`, shared settings in `.aura/settings/`, and a cursor-context quickstart.',
    aliasFlags: ['--cursor'],
    recommendedModels: ['Claude Sonnet 4.6 or newer via Cursor'],
    layout: {
      commandsDir: '.cursor/rules/aura',
      agentDir: '.cursor',
      docFile: '.cursorrules',
    },
    commands: {
      discovery: '`@aura-discovery <idea>`',
      spec: '`@aura-spec <feature>`',
      impl: '`@aura-impl <feature>`',
      steering: '`@aura-steering`',
    },
    manifestId: 'cursor',
    commandFormat: 'markdown',
  },
  copilot: {
    label: 'GitHub Copilot',
    description:
      'Installs Aura prompts in `.github/copilot-instructions.md` and `.github/prompts/aura/`, shared settings in `.aura/settings/`.',
    aliasFlags: ['--copilot', '--github-copilot'],
    recommendedModels: ['Claude Sonnet via GitHub Copilot'],
    layout: {
      commandsDir: '.github/prompts/aura',
      agentDir: '.github',
      docFile: 'copilot-instructions.md',
    },
    commands: {
      discovery: 'Copilot Chat: `aura-discovery <idea>`',
      spec: 'Copilot Chat: `aura-spec <feature>`',
      impl: 'Copilot Chat: `aura-impl <feature>`',
      steering: 'Copilot Chat: `aura-steering`',
    },
    manifestId: 'copilot',
    commandFormat: 'markdown',
  },
  codex: {
    label: 'Codex CLI',
    description:
      'Installs Aura skills in `.codex/skills/aura-*/`, shared settings in `.aura/settings/`, and a AGENTS.md quickstart.',
    aliasFlags: ['--codex', '--codex-cli'],
    recommendedModels: ['o3 or o4-mini via Codex CLI'],
    layout: {
      commandsDir: '.codex/skills',
      agentDir: '.codex',
      docFile: 'AGENTS.md',
    },
    commands: {
      discovery: '`/aura-discovery <idea>`',
      spec: '`/aura-spec <feature>`',
      impl: '`/aura-impl <feature>`',
      steering: '`/aura-steering`',
    },
    manifestId: 'codex',
    commandFormat: 'skill',
  },
  windsurf: {
    label: 'Windsurf',
    description:
      'Installs Aura rules in `.windsurf/rules/aura/`, shared settings in `.aura/settings/`, and a windsurf-context quickstart.',
    aliasFlags: ['--windsurf'],
    recommendedModels: ['Claude Sonnet 4.6 or newer via Windsurf'],
    layout: {
      commandsDir: '.windsurf/rules/aura',
      agentDir: '.windsurf',
      docFile: 'windsurf-context.md',
    },
    commands: {
      discovery: 'Cascade: `aura-discovery <idea>`',
      spec: 'Cascade: `aura-spec <feature>`',
      impl: 'Cascade: `aura-impl <feature>`',
      steering: 'Cascade: `aura-steering`',
    },
    manifestId: 'windsurf',
    commandFormat: 'markdown',
  },
  gemini: {
    label: 'Gemini CLI',
    description:
      'Installs Aura commands in `.gemini/commands/aura/` as TOML files, shared settings in `.aura/settings/`, and a GEMINI.md quickstart.',
    aliasFlags: ['--gemini', '--gemini-cli'],
    recommendedModels: ['Gemini 2.5 Pro or newer'],
    layout: {
      commandsDir: '.gemini/commands/aura',
      agentDir: '.gemini',
      docFile: 'GEMINI.md',
    },
    commands: {
      discovery: '`/aura-discovery <idea>`',
      spec: '`/aura-spec <feature>`',
      impl: '`/aura-impl <feature>`',
      steering: '`/aura-steering`',
    },
    manifestId: 'gemini',
    commandFormat: 'toml',
  },
} as const satisfies Record<string, AgentDefinition>;

export type AgentType = keyof typeof agentDefinitions;

export const agentList = Object.keys(agentDefinitions) as AgentType[];

export const getAgentDefinition = (agent: AgentType): AgentDefinition =>
  agentDefinitions[agent];
