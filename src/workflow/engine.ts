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

export type WorkflowStep =
  | SkillStep
  | ShellStep
  | GateStep
  | FanOutStep
  | IfThenStep;

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
  let wfPath: string;
  if (nameOrPath.endsWith('.yml') || nameOrPath.endsWith('.yaml') ||
      nameOrPath.includes('/') || nameOrPath.includes('\\')) {
    wfPath = path.resolve(nameOrPath);
  } else {
    wfPath = path.join(auraDir, 'workflows', 'definitions', `${nameOrPath}.yml`);
  }
  const raw = fs.readFileSync(wfPath, 'utf8');
  return parseYamlWorkflow(raw);
};

// Minimal YAML parser for workflow definitions (avoids external deps)
const parseYamlWorkflow = (yaml: string): WorkflowDefinition => {
  // For production this would use a proper YAML parser; we accept structured YAML
  // with a predictable schema. Using JSON-embedded YAML via markers for now.
  try {
    // Attempt to parse as JSON first (for test scenarios)
    return JSON.parse(yaml) as WorkflowDefinition;
  } catch {
    // Minimal YAML line-by-line parse for the workflow schema
    throw new Error('YAML parsing requires structured workflow files. Use JSON format for v1.0.');
  }
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

  for (const step of definition.steps) {
    const existing = state.steps[step.id];
    if (existing?.status === 'completed') {
      console.log(`[aura-workflow] ✓ Skipping completed step: ${step.id}`);
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

    // Handle if_then jump
    if (step.type === 'if_then' && 'nextStepId' in stepResult.output!) {
      const nextId = (stepResult.output as { nextStepId: string }).nextStepId;
      if (nextId === '__end__') break;
    }
  }

  if (state.status === 'running') {
    state = updateRunState(state, { status: 'completed' });
    saveRunState(state, runsDir);
    console.log(`[aura-workflow] ✅ Workflow completed: ${definition.name}`);
  }

  return state;
};

const dispatchStep = async (
  step: WorkflowStep,
  state: WorkflowRunState,
): Promise<StepState> => {
  switch (step.type) {
    case 'skill':
      return executeSkillStep(step, state);
    case 'shell':
      return executeShellStep(step);
    case 'gate':
      return executeGateStep(step);
    case 'fan_out': {
      const items = resolveFanOutItems(step.items, state);
      return executeFanOutStep(step, items);
    }
    case 'if_then':
      return executeIfThenStep(step, state);
    default:
      throw new Error(`Unknown step type: ${(step as WorkflowStep).type}`);
  }
};
