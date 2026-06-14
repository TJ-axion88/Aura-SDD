import fs from 'fs';
import path from 'path';
import {
  createRunState,
  saveRunState,
  loadRunState,
  updateRunState,
  generateRunId,
  type WorkflowRunState,
  type StepState,
} from './state.js';
import { executeSkillStep, type SkillStep } from './steps/skill.js';
import { executeShellStep, type ShellStep } from './steps/shell.js';
import { executeGateStep, type GateStep } from './steps/gate.js';
import { executeFanOutStep, resolveFanOutItems, type FanOutStep } from './steps/fan_out.js';
import { executeIfThenStep, type IfThenStep } from './steps/if_then.js';
import { executeSwitchStep, type SwitchStep } from './steps/switch.js';
import { executeFanInStep, type FanInStep } from './steps/fan_in.js';
import { executeWhileLoopStep, type WhileLoopStep } from './steps/while_loop.js';
import { executeDoWhileStep, type DoWhileStep } from './steps/do_while.js';
import type { BaseStep } from './steps/fan_out.js';

export type WorkflowStep =
  | SkillStep
  | ShellStep
  | GateStep
  | FanOutStep
  | FanInStep
  | IfThenStep
  | SwitchStep
  | WhileLoopStep
  | DoWhileStep;

export type WorkflowDefinition = {
  name: string;
  description?: string;
  inputs?: Record<string, { type: string; required?: boolean; default?: unknown }>;
  steps: WorkflowStep[];
};

const AURA_DIR_DEFAULT = '.aura';

export const loadWorkflowDefinition = (
  nameOrPath: string,
  auraDir = AURA_DIR_DEFAULT,
): WorkflowDefinition => {
  // Direct path: absolute or contains separators
  if (nameOrPath.includes('/') || nameOrPath.includes('\\') ||
      nameOrPath.endsWith('.json') || nameOrPath.endsWith('.yml') || nameOrPath.endsWith('.yaml')) {
    const wfPath = path.resolve(nameOrPath);
    return parseWorkflowFile(wfPath);
  }

  // Named workflow: try .json first, then .yml for user-created YAML definitions
  const defsDir = path.join(auraDir, 'workflows', 'definitions');
  const jsonPath = path.join(defsDir, `${nameOrPath}.json`);
  if (fs.existsSync(jsonPath)) {
    return parseWorkflowFile(jsonPath);
  }
  const ymlPath = path.join(defsDir, `${nameOrPath}.yml`);
  if (fs.existsSync(ymlPath)) {
    return parseWorkflowFile(ymlPath);
  }
  throw new Error(`Workflow definition not found: "${nameOrPath}" (looked in ${defsDir})`);
};

const parseWorkflowFile = (filePath: string): WorkflowDefinition => {
  const raw = fs.readFileSync(filePath, 'utf8');
  // JSON format (official Aura-SDD workflow format)
  try {
    return JSON.parse(raw) as WorkflowDefinition;
  } catch {
    // Minimal YAML parser for simple workflow definitions
    return parseMinimalYaml(raw, filePath);
  }
};

// Minimal line-by-line YAML parser for the workflow definition schema.
// Supports only the subset used by Aura-SDD workflow files.
const parseMinimalYaml = (yaml: string, filePath: string): WorkflowDefinition => {
  const lines = yaml.split('\n');
  const result: Record<string, unknown> = {};
  let currentKey: string | null = null;
  let stepsRaw: string[] = [];
  let inSteps = false;
  let stepIndent = -1;
  let currentStep: Record<string, unknown> | null = null;
  const steps: Record<string, unknown>[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = line.search(/\S/);

    if (!inSteps) {
      // Top-level keys
      const topMatch = trimmed.match(/^(\w+):\s*(.*)/);
      if (topMatch) {
        const [, key, value] = topMatch;
        if (key === 'steps') {
          inSteps = true;
        } else if (value) {
          result[key] = value.replace(/^['"]|['"]$/g, '');
        } else {
          currentKey = key;
          result[key] = {};
        }
      }
      continue;
    }

    // Inside steps array
    if (trimmed.startsWith('- ') || trimmed === '-') {
      if (currentStep) steps.push(currentStep);
      currentStep = {};
      stepIndent = indent;
      const rest = trimmed.slice(2).trim();
      if (rest) {
        const kv = rest.match(/^(\w+):\s*(.*)/);
        if (kv) currentStep[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
      }
    } else if (currentStep && indent > stepIndent) {
      const kv = trimmed.match(/^(\w+):\s*(.*)/);
      if (kv) currentStep[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
    }
  }
  if (currentStep) steps.push(currentStep);

  if (steps.length === 0) {
    throw new Error(
      `Cannot parse workflow file: ${filePath}\n` +
      'Workflow definitions must be JSON format. See .aura/workflows/definitions/full-sdd.json for reference.'
    );
  }

  return { ...result, steps } as unknown as WorkflowDefinition;
};

export const runWorkflow = async (
  definition: WorkflowDefinition,
  inputs: Record<string, unknown>,
  auraDir = AURA_DIR_DEFAULT,
  resumeRunId?: string,
): Promise<WorkflowRunState> => {
  const runsDir = path.join(auraDir, 'workflows', 'runs');

  let state: WorkflowRunState;
  if (resumeRunId) {
    state = loadRunState(resumeRunId, runsDir);
    console.log(`[aura-workflow] Resuming run: ${resumeRunId}`);
  } else {
    const runId = generateRunId();
    state = createRunState(runId, definition.name, inputs);
    console.log(`[aura-workflow] Starting workflow: ${definition.name} (${runId})`);
  }

  state = updateRunState(state, { status: 'running' });
  saveRunState(state, runsDir);

  // Index-based loop to support if_then jumps to arbitrary step IDs
  const steps = definition.steps;
  const stepIndex = new Map(steps.map((s, i) => [s.id, i]));
  let i = 0;

  while (i < steps.length) {
    const step = steps[i];

    const existing = state.steps[step.id];
    if (existing?.status === 'completed') {
      console.log(`[aura-workflow] ✓ Skipping completed step: ${step.id}`);
      i++;
      continue;
    }

    state = updateRunState(state, {
      currentStepId: step.id,
      steps: { ...state.steps, [step.id]: { status: 'running', startedAt: new Date().toISOString() } },
    });
    saveRunState(state, runsDir);

    let stepResult: StepState;
    try {
      stepResult = await dispatchStep(step, state);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      stepResult = { status: 'failed', error: message, completedAt: new Date().toISOString() };
      state = updateRunState(state, {
        status: 'failed',
        steps: { ...state.steps, [step.id]: stepResult },
      });
      saveRunState(state, runsDir);
      throw new Error(`Workflow failed at step "${step.id}": ${message}`);
    }

    state = updateRunState(state, {
      steps: { ...state.steps, [step.id]: stepResult },
    });
    saveRunState(state, runsDir);

    if (stepResult.status === 'failed') {
      state = updateRunState(state, { status: 'failed' });
      saveRunState(state, runsDir);
      break;
    }

    // Handle gate pause
    if (step.type === 'gate' && stepResult.status === 'paused') {
      state = updateRunState(state, { status: 'paused' });
      saveRunState(state, runsDir);
      console.log(`[aura-workflow] ⏸ Paused at gate "${step.id}". Resume with: aura-sdd workflow resume ${state.runId}`);
      return state;
    }

    // Handle if_then / switch jump to a named step or __end__
    const nextStepId = stepResult.output?.['nextStepId'] as string | undefined;
    if (nextStepId) {
      if (nextStepId === '__end__') break;
      const jumpIdx = stepIndex.get(nextStepId);
      if (jumpIdx !== undefined) {
        i = jumpIdx;
        continue;
      }
      // Unknown step ID — treat as end
      break;
    }

    i++;
  }

  if (state.status === 'running') {
    state = updateRunState(state, { status: 'completed' });
    saveRunState(state, runsDir);
    console.log(`[aura-workflow] ✅ Workflow completed: ${definition.name}`);
  }

  return state;
};

export const dispatchStep = async (
  step: WorkflowStep | BaseStep,
  state: WorkflowRunState,
): Promise<StepState> => {
  // Cast to WorkflowStep for the switch — fan_out creates synthetic steps of the same shape
  const s = step as WorkflowStep;
  switch (s.type) {
    case 'skill':
      return executeSkillStep(s, state);
    case 'shell':
      return executeShellStep(s);
    case 'gate':
      return executeGateStep(s);
    case 'fan_out': {
      const items = resolveFanOutItems(s.items, state);
      return executeFanOutStep(s, items, state, dispatchStep);
    }
    case 'fan_in':
      return executeFanInStep(s, state);
    case 'if_then':
      return executeIfThenStep(s, state);
    case 'switch':
      return executeSwitchStep(s, state);
    case 'while_loop': {
      const prevOutput = state.steps[s.id]?.output;
      const iteration = typeof prevOutput?.['iteration'] === 'number' ? prevOutput['iteration'] + 1 : 0;
      return executeWhileLoopStep(s, state, iteration);
    }
    case 'do_while': {
      const prevOutput = state.steps[s.id]?.output;
      const iteration = typeof prevOutput?.['iteration'] === 'number' ? prevOutput['iteration'] + 1 : 0;
      return executeDoWhileStep(s, state, iteration);
    }
    default: {
      const unknownStep = step as BaseStep;
      throw new Error(`Unknown step type: ${unknownStep.type}`);
    }
  }
};
