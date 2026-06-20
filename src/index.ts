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
import { formatHeading, formatSuccess, formatWarn, formatDim, formatError, formatInfo } from './cli/ui/colors.js';
import { askYesNo, askChoice, isInteractive } from './cli/ui/prompt.js';
import { loadWorkflowDefinition, runWorkflow } from './workflow/engine.js';
import { loadRunState } from './workflow/state.js';
import { ExtensionManager } from './extension/manager.js';
import { listExtensions } from './extension/registry.js';
import { getAgentDefinition, agentList } from './agents/registry.js';
import { detectCategory, defaultPolicy, CategoryPolicyStore } from './cli/policies.js';

const VERSION = '3.0.0';
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

  if (args.subcommand) {
    await handleSubcommand(args.subcommand, args.subcommandArgs ?? []);
    return;
  }

  const config = resolveConfig(args);

  // Interactive agent selection if not specified
  let agent = config.agent;
  if (!agent) {
    if (isInteractive() && !config.yes) {
      const agentLabels = agentList.map((a) => `${a} — ${getAgentDefinition(a).label}`);
      const chosen = await askChoice('Select your AI coding agent:', agentLabels);
      agent = agentList[agentLabels.indexOf(chosen)];
    } else {
      agent = 'claude-code';
    }
  }

  const context = buildContext(agent, config.lang, config.auraDir, config.profile, VERSION, config.os);

  const manifestPath = config.manifestPath ?? agent;
  const manifest = loadManifest(manifestPath);
  const templatesRoot = getTemplatesRoot();

  const processedFiles = processManifest(manifest, context, templatesRoot, PROJECT_ROOT);
  const planned = planInstall(processedFiles, config.overwrite);

  const agentDef = getAgentDefinition(agent);
  console.log('');
  console.log(formatHeading(`Aura-SDD v${VERSION} — ${agentDef.label} install`));
  console.log('');
  console.log(`  Agent:    ${agentDef.label}`);
  console.log(`  Language: ${config.lang}`);
  console.log(`  OS:       ${config.os}`);
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

  let written = 0;
  let skipped = 0;
  const policyStore = new CategoryPolicyStore();

  for (const planned_file of planned) {
    let action = planned_file.action;

    if (action === 'prompt') {
      if (config.yes) {
        action = 'overwrite';
      } else {
        const rel = path.relative(PROJECT_ROOT, planned_file.destPath);
        const category = detectCategory(rel);
        const effective = policyStore.getEffective(category, defaultPolicy[category]);

        if (effective === 'force') {
          action = 'overwrite';
        } else if (effective === 'skip') {
          action = 'skip';
        } else {
          // prompt with apply-to-all option
          const choice = await askChoice(
            `File exists: ${rel}\n  Category: ${category}`,
            ['overwrite this file', 'skip this file', `overwrite all ${category} files`, `skip all ${category} files`],
          );
          if (choice.startsWith('overwrite all')) {
            policyStore.setSticky(category, 'force');
            action = 'overwrite';
          } else if (choice.startsWith('skip all')) {
            policyStore.setSticky(category, 'skip');
            action = 'skip';
          } else if (choice.startsWith('overwrite')) {
            action = 'overwrite';
          } else {
            action = 'skip';
          }
        }
      }
    }

    if (action === 'skip') {
      skipped++;
      continue;
    }

    if (config.backup && planned_file.exists) {
      const backupDir = typeof config.backup === 'string' ? config.backup : undefined;
      backupFile(planned_file.destPath, backupDir);
    }

    const raw = readFileOr(planned_file.srcPath, '');
    const rendered = renderFileContent(raw, context);
    writeFileSafe(planned_file.destPath, rendered);
    written++;
  }

  console.log(formatSuccess(`✓ Done: ${written} file(s) written, ${skipped} skipped.`));
  console.log('');
  printNextSteps(agent);
};

const printNextSteps = (agent: string): void => {
  const def = getAgentDefinition(agent as Parameters<typeof getAgentDefinition>[0]);
  console.log(formatHeading('Next steps:'));
  console.log('');
  console.log(`  1. Establish project principles:  /aura-constitution`);
  console.log(`  2. Build project memory:          ${def.commands.steering}`);
  console.log(`  3. Discover & route new work:     ${def.commands.discovery}`);
  console.log(`  4. Create a spec:                 ${def.commands.spec}`);
  console.log(`  5. Implement autonomously:        ${def.commands.impl}`);
  console.log('');
  console.log(formatDim('  Tip: aura-sdd workflow run full-sdd --input feature="<idea>"'));
  console.log(formatDim('  Tip: /aura-spec-quick <feature>  for fast-track (no design phase)'));
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
      await handlePresetSubcommand(subArgs);
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
      if (!nameOrPath) {
        console.error(formatError('Usage: aura-sdd workflow run <name> [--input key=value ...]'));
        process.exit(1);
      }
      const inputs = parseInputArgs(inputArgs);
      const def = loadWorkflowDefinition(nameOrPath);
      await runWorkflow(def, inputs);
      break;
    }
    case 'resume': {
      const [runId] = rest;
      if (!runId) {
        console.error(formatError('Usage: aura-sdd workflow resume <run-id>'));
        process.exit(1);
      }
      const runsDir = path.join('.aura', 'workflows', 'runs');
      const savedState = loadRunState(runId, runsDir);
      const def = loadWorkflowDefinition(savedState.workflowName, '.aura');
      await runWorkflow(def, savedState.inputs, '.aura', runId);
      break;
    }
    case 'list':
      await listWorkflows();
      break;
    default:
      console.error(formatError('workflow subcommand: run | resume | list'));
      process.exit(1);
  }
};

const handleExtensionSubcommand = async (args: string[]): Promise<void> => {
  const [action, extId, sourcePath] = args;
  const manager = new ExtensionManager('.aura', PROJECT_ROOT, 'claude-code');
  switch (action) {
    case 'list':
      listExtensions('.aura').forEach((e) =>
        console.log(`  ${e.enabled ? '●' : '○'} ${e.id} — ${e.name} v${e.version}`),
      );
      break;
    case 'add':
    case 'install': {
      if (!extId) {
        console.error(formatError('Usage: aura-sdd extension add <id> [source-path]'));
        process.exit(1);
      }
      // source-path is the local directory containing the extension manifest.
      // If omitted, we look in .aura/extensions/<id> (for pre-copied extensions).
      const src = sourcePath ?? path.join('.aura', 'extensions', extId);
      manager.install(extId, src);
      console.log(formatSuccess(`✓ Extension "${extId}" installed.`));
      break;
    }
    case 'remove':
      if (!extId) {
        console.error(formatError('Usage: aura-sdd extension remove <id>'));
        process.exit(1);
      }
      manager.remove(extId);
      break;
    case 'enable':
      if (!extId) {
        console.error(formatError('Usage: aura-sdd extension enable <id>'));
        process.exit(1);
      }
      manager.enable(extId);
      console.log(formatSuccess(`✓ Extension "${extId}" enabled.`));
      break;
    case 'disable':
      if (!extId) {
        console.error(formatError('Usage: aura-sdd extension disable <id>'));
        process.exit(1);
      }
      manager.disable(extId);
      console.log(formatSuccess(`✓ Extension "${extId}" disabled.`));
      break;
    default:
      console.error(formatError('extension subcommand: list | add | remove | enable | disable'));
      process.exit(1);
  }
};

const handlePresetSubcommand = async (args: string[]): Promise<void> => {
  const { PresetManager } = await import('./preset/manager.js');
  const [action, presetId] = args;
  const manager = new PresetManager('.aura');
  switch (action) {
    case 'list': {
      const presets = manager.list();
      if (presets.length === 0) {
        console.log(formatDim('  No presets installed. Add to .aura/presets/'));
      } else {
        presets.forEach((p) => console.log(`  ${p.enabled ? '●' : '○'} ${p.id} — ${p.name}`));
      }
      break;
    }
    case 'apply':
      if (!presetId) {
        console.error(formatError('Usage: aura-sdd preset apply <id>'));
        process.exit(1);
      }
      manager.apply(presetId, PROJECT_ROOT);
      console.log(formatSuccess(`✓ Preset "${presetId}" applied.`));
      break;
    case 'remove':
      if (!presetId) {
        console.error(formatError('Usage: aura-sdd preset remove <id>'));
        process.exit(1);
      }
      manager.remove(presetId);
      console.log(formatSuccess(`✓ Preset "${presetId}" removed.`));
      break;
    default:
      console.error(formatError('preset subcommand: list | apply | remove'));
      process.exit(1);
  }
};

const printHelp = (): void => {
  console.log(`
${formatHeading(`Aura-SDD v${VERSION}`)} — Spec-Driven Development framework

${formatHeading('Usage:')}
  aura-sdd [agent] [options]
  aura-sdd workflow <run|resume|list> [args]
  aura-sdd extension <list|add|remove|enable|disable> [id] [src]
  aura-sdd preset <list|apply|remove> [id]

${formatHeading('Agent flags:')}
  --claude-code, --claude   Claude Code (default)
  --cursor                  Cursor IDE
  --copilot                 GitHub Copilot
  --codex                   OpenAI Codex
  --windsurf                Windsurf IDE
  --gemini                  Google Gemini CLI
  --opencode                OpenCode
  --antigravity             Antigravity
  --kiro                    Amazon Kiro

${formatHeading('Options:')}
  --lang <code>             Language (en, ja, zh, es, ...) [default: en]
  --profile <name>          Profile: full | lean | minimal [default: full]
  --os <target>             OS: auto | mac | windows | linux [default: auto]
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
  aura-sdd --profile minimal -y
  aura-sdd --os windows --claude-code
  aura-sdd workflow run full-sdd --input feature="写真アルバム"
  aura-sdd workflow run tdd --input feature="ユーザー認証"
  aura-sdd workflow resume run-abc123

${formatHeading('Skills installed (20 skills):')}
  /aura-discovery        Route new work (start here)
  /aura-constitution     Establish project principles
  /aura-steering         Project memory management
  /aura-steering-custom  Create custom steering documents  [NEW]
  /aura-spec             Write EARS-format requirements
  /aura-spec-quick       Fast-track: spec + tasks in one shot  [NEW]
  /aura-spec-refine      Progressive spec refinement (quick→standard→full)  [NEW]
  /aura-spec-batch       Create multiple specs from roadmap  [NEW]
  /aura-spec-status      Track progress across all specs  [NEW]
  /aura-clarify          Resolve ambiguous requirements
  /aura-plan             Architecture + boundary design
  /aura-tasks            Task decomposition
  /aura-impl             Autonomous implementation (TDD)
  /aura-validate         GO/NO-GO integration check
  /aura-validate-gap     Gap analysis for existing codebases  [NEW]
  /aura-validate-design  Design review before implementation  [NEW]
  /aura-verify-completion  Fresh-evidence gate  [NEW]
  /aura-review           Adversarial 12-check code review
  /aura-debug            Root-cause-first debugging
  /aura-workflow         Run/resume automated workflows
  /aura-issues           Export tasks to GitHub Issues
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
    const runs = fs
      .readdirSync(runsDir)
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
          const statusIcon =
            status === 'completed' ? '✓' : status === 'failed' ? '✗' : status === 'paused' ? '⏸' : '●';
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
