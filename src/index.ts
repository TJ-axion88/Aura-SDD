import path from 'path';
import fs from 'fs';
import { parseArgs } from './cli/args.js';
import { resolveConfig } from './cli/config.js';
import { loadManifest, getTemplatesRoot } from './manifest/loader.js';
import { processManifest } from './manifest/processor.js';
import { planInstall, summarizePlan, type PlannedFile } from './manifest/planner.js';
import { buildContext } from './template/context.js';
import { renderFileContent } from './template/renderer.js';
import { writeFileSafe, backupFile, fileExists, readFileOr } from './utils/fs.js';
import { formatHeading, formatSuccess, formatWarn, formatDim, formatError } from './cli/ui/colors.js';
import { askYesNo } from './cli/ui/prompt.js';
import { loadWorkflowDefinition, runWorkflow } from './workflow/engine.js';
import { ExtensionManager } from './extension/manager.js';
import { listExtensions } from './extension/registry.js';
import { getAgentDefinition } from './agents/registry.js';

const VERSION = '1.0.0';
const PROJECT_ROOT = process.cwd();

export const run = async (argv: string[]): Promise<void> => {
  const args = parseArgs(argv);

  if (args.version) {
    console.log(VERSION);
    return;
  }

  if (args.help) {
    printHelp();
    return;
  }

  // Handle subcommands
  if (args.subcommand) {
    await handleSubcommand(args.subcommand, args.subcommandArgs ?? []);
    return;
  }

  const config = resolveConfig(args);

  if (!config.agent) {
    console.error(formatError('No agent specified. Use --claude-code, --cursor, --copilot, etc.'));
    process.exit(1);
  }

  const context = buildContext(config.agent, config.lang, config.auraDir, config.profile, VERSION);

  // Load manifest
  const manifestPath = config.manifestPath ?? config.agent;
  const manifest = loadManifest(manifestPath);
  const templatesRoot = getTemplatesRoot();

  // Process manifest → file list
  const processedFiles = processManifest(manifest, context, templatesRoot, PROJECT_ROOT);

  // Plan installation
  const planned = planInstall(processedFiles, config.overwrite);

  // Print summary
  const agentDef = getAgentDefinition(config.agent);
  console.log('');
  console.log(formatHeading(`Aura-SDD v${VERSION} — ${agentDef.label} install`));
  console.log('');
  console.log(`  Agent:    ${agentDef.label}`);
  console.log(`  Language: ${config.lang}`);
  console.log(`  Aura dir: ${config.auraDir}`);
  console.log(`  Profile:  ${config.profile}`);
  console.log(`  Files:    ${summarizePlan(planned)}`);
  console.log('');

  if (config.dryRun) {
    console.log(formatWarn('Dry-run mode — no files written.'));
    planned.forEach((f) => {
      const action = f.action === 'write' ? '+ new' : f.action === 'skip' ? '  skip' : '~ overwrite';
      console.log(`  ${action}  ${path.relative(PROJECT_ROOT, f.destPath)}`);
    });
    return;
  }

  // Execute file writes
  let written = 0;
  let skipped = 0;

  for (const planned_file of planned) {
    let action = planned_file.action;

    if (action === 'prompt') {
      if (config.yes) {
        action = 'overwrite';
      } else {
        const rel = path.relative(PROJECT_ROOT, planned_file.destPath);
        const confirmed = await askYesNo(`Overwrite existing file: ${rel}?`);
        action = confirmed ? 'overwrite' : 'skip';
      }
    }

    if (action === 'skip') {
      skipped++;
      continue;
    }

    // Backup if requested
    if (config.backup && planned_file.exists) {
      const backupDir = typeof config.backup === 'string' ? config.backup : undefined;
      backupFile(planned_file.destPath, backupDir);
    }

    // Render and write
    const raw = readFileOr(planned_file.srcPath, '');
    const rendered = renderFileContent(raw, context);
    writeFileSafe(planned_file.destPath, rendered);
    written++;
  }

  console.log(formatSuccess(`✓ Done: ${written} file(s) written, ${skipped} skipped.`));
  console.log('');
  printNextSteps(config.agent);
};

const printNextSteps = (agent: string): void => {
  const def = getAgentDefinition(agent as Parameters<typeof getAgentDefinition>[0]);
  console.log(formatHeading('Next steps:'));
  console.log('');
  console.log(`  1. Set up project constitution: /aura-constitution`);
  console.log(`  2. Start with discovery: ${def.commands.discovery}`);
  console.log(`  3. Create a spec: ${def.commands.spec}`);
  console.log(`  4. Implement: ${def.commands.impl}`);
  console.log(`  5. Build project memory: ${def.commands.steering}`);
  console.log('');
  console.log(formatDim('  Tip: Run /aura-workflow to automate the full SDD pipeline.'));
  console.log('');
};

const handleSubcommand = async (sub: string, subArgs: string[]): Promise<void> => {
  switch (sub) {
    case 'workflow':
      await handleWorkflowSubcommand(subArgs);
      break;
    case 'extension':
      await handleExtensionSubcommand(subArgs);
      break;
    case 'preset':
      handlePresetSubcommand(subArgs);
      break;
    default:
      console.error(formatError(`Unknown subcommand: ${sub}`));
      process.exit(1);
  }
};

const handleWorkflowSubcommand = async (args: string[]): Promise<void> => {
  const [action, ...rest] = args;
  switch (action) {
    case 'run': {
      const [nameOrPath, ...inputArgs] = rest;
      if (!nameOrPath) { console.error(formatError('Usage: aura-sdd workflow run <name> [--input key=value ...]')); process.exit(1); }
      const inputs = parseInputArgs(inputArgs);
      const def = loadWorkflowDefinition(nameOrPath);
      await runWorkflow(def, inputs);
      break;
    }
    case 'resume': {
      const [runId] = rest;
      if (!runId) { console.error(formatError('Usage: aura-sdd workflow resume <run-id>')); process.exit(1); }
      const def = loadWorkflowDefinition('__resume__');
      await runWorkflow(def, {}, '.aura', runId);
      break;
    }
    case 'list': {
      await listWorkflows();
      break;
    }
    default:
      console.error(formatError('workflow subcommand: run | resume | list'));
      process.exit(1);
  }
};

const handleExtensionSubcommand = async (args: string[]): Promise<void> => {
  const [action, extId] = args;
  const manager = new ExtensionManager('.aura', PROJECT_ROOT, 'claude-code');
  switch (action) {
    case 'list':
      listExtensions('.aura').forEach((e) => console.log(`  ${e.enabled ? '●' : '○'} ${e.id} — ${e.name} v${e.version}`));
      break;
    case 'remove':
      if (!extId) { console.error(formatError('Usage: aura-sdd extension remove <id>')); process.exit(1); }
      manager.remove(extId);
      break;
    default:
      console.error(formatError('extension subcommand: list | remove'));
      process.exit(1);
  }
};

const handlePresetSubcommand = (args: string[]): void => {
  const [action] = args;
  console.log(formatWarn(`preset ${action ?? 'list'}: managed via .aura/presets/ directory`));
};

const printHelp = (): void => {
  console.log(`
${formatHeading(`Aura-SDD v${VERSION}`)} — Spec-Driven Development framework

${formatHeading('Usage:')}
  aura-sdd [agent] [options]
  aura-sdd workflow <run|resume|list> [args]
  aura-sdd extension <list|remove> [id]

${formatHeading('Agent flags:')}
  --claude-code, --claude   Claude Code (default)
  --cursor                  Cursor IDE
  --copilot                 GitHub Copilot
  --codex                   OpenAI Codex
  --windsurf                Windsurf IDE
  --gemini                  Google Gemini

${formatHeading('Options:')}
  --lang <code>             Language (en, ja, zh, es, ...) [default: en]
  --profile <name>          Profile: full | lean [default: full]
  --dry-run                 Preview files without writing
  --overwrite <policy>      prompt | skip | force [default: prompt]
  --backup [dir]            Backup existing files before overwrite
  --aura-dir <path>         Aura config directory [default: .aura]
  --manifest <path>         Custom manifest JSON path
  -y, --yes                 Auto-confirm all prompts
  -v, --version             Print version and exit
  -h, --help                Print this help

${formatHeading('Examples:')}
  aura-sdd --lang ja
  aura-sdd --cursor --lang ja --dry-run
  aura-sdd --profile lean -y
  aura-sdd workflow run full-sdd --input feature="写真アルバム"
  aura-sdd workflow run tdd --input feature="ユーザー認証"
  aura-sdd workflow resume run-abc123

${formatHeading('Skills installed:')}
  /aura-discovery   Route new work (start here)
  /aura-constitution  Establish project principles
  /aura-spec        Write EARS-format requirements
  /aura-clarify     Resolve ambiguous requirements
  /aura-plan        Architecture + boundary design
  /aura-tasks       Task decomposition
  /aura-impl        Autonomous implementation (TDD)
  /aura-validate    GO/NO-GO integration check
  /aura-steering    Project memory management
  /aura-workflow    Run/resume automated workflows
  /aura-issues      Export tasks to GitHub Issues
`);
};

const listWorkflows = async (): Promise<void> => {
  const auraDir = path.join(PROJECT_ROOT, '.aura');
  const defsDir = path.join(auraDir, 'workflows', 'definitions');
  const runsDir = path.join(auraDir, 'workflows', 'runs');

  console.log('');
  console.log(formatHeading('Available workflow definitions:'));
  console.log('');

  if (fs.existsSync(defsDir)) {
    const defs = fs.readdirSync(defsDir).filter((f) => f.endsWith('.json'));
    if (defs.length === 0) {
      console.log(formatDim('  No workflow definitions found in .aura/workflows/definitions/'));
    } else {
      for (const def of defs) {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(defsDir, def), 'utf8'));
          const name = raw.name ?? def.replace('.json', '');
          const desc = raw.description ?? '';
          console.log(`  ${name.padEnd(20)} ${formatDim(desc)}`);
        } catch {
          console.log(`  ${def}`);
        }
      }
    }
  } else {
    console.log(formatDim('  Run aura-sdd first to install workflow definitions.'));
  }

  console.log('');
  console.log(formatHeading('Recent workflow runs:'));
  console.log('');

  if (fs.existsSync(runsDir)) {
    const runs = fs.readdirSync(runsDir)
      .filter((r) => fs.existsSync(path.join(runsDir, r, 'state.json')))
      .slice(-10);
    if (runs.length === 0) {
      console.log(formatDim('  No workflow runs yet.'));
    } else {
      for (const runId of runs.reverse()) {
        try {
          const state = JSON.parse(fs.readFileSync(path.join(runsDir, runId, 'state.json'), 'utf8'));
          const status = state.status ?? '?';
          const wf = state.workflowName ?? '?';
          const updated = state.updatedAt ? new Date(state.updatedAt).toLocaleString() : '?';
          const statusIcon = status === 'completed' ? '✓' : status === 'failed' ? '✗' : status === 'paused' ? '⏸' : '●';
          console.log(`  ${statusIcon} ${runId.padEnd(25)} ${wf.padEnd(20)} ${updated}`);
        } catch {
          console.log(`  ${runId}`);
        }
      }
    }
  } else {
    console.log(formatDim('  No runs yet.'));
  }
  console.log('');
};

const parseInputArgs = (args: string[]): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      const [key, ...val] = args[i + 1].split('=');
      if (key) out[key] = val.join('=');
      i++;
    }
  }
  return out;
};
