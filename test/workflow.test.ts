import { describe, it, expect } from 'vitest';
import { generateRunId, createRunState } from '../src/workflow/state.js';
import { resolveFanOutItems } from '../src/workflow/steps/fan_out.js';
import { evaluateCondition } from '../src/workflow/steps/if_then.js';
import { executeSwitchStep } from '../src/workflow/steps/switch.js';
import { executeFanInStep } from '../src/workflow/steps/fan_in.js';
import { executeWhileLoopStep } from '../src/workflow/steps/while_loop.js';
import { loadWorkflowDefinition } from '../src/workflow/engine.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

describe('generateRunId', () => {
  it('generates unique run IDs', () => {
    const id1 = generateRunId();
    const id2 = generateRunId();
    expect(id1).not.toBe(id2);
    expect(id1.startsWith('run-')).toBe(true);
  });
});

describe('createRunState', () => {
  it('creates initial state with created status', () => {
    const state = createRunState('run-test', 'my-workflow', { feature: 'test' });
    expect(state.status).toBe('created');
    expect(state.workflowName).toBe('my-workflow');
    expect(state.inputs).toEqual({ feature: 'test' });
    expect(state.steps).toEqual({});
  });
});

describe('resolveFanOutItems', () => {
  it('resolves items from step output', () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['tasks'] = {
      status: 'completed',
      output: { task_ids: ['0.1', '1.1', '1.2'] },
    };
    const items = resolveFanOutItems('{{ steps.tasks.output.task_ids }}', state);
    expect(items).toEqual(['0.1', '1.1', '1.2']);
  });

  it('resolves items from inputs', () => {
    const state = createRunState('run-1', 'wf', { features: ['auth', 'api'] });
    const items = resolveFanOutItems('{{ inputs.features }}', state);
    expect(items).toEqual(['auth', 'api']);
  });

  it('returns empty array for missing step', () => {
    const state = createRunState('run-1', 'wf', {});
    const items = resolveFanOutItems('{{ steps.missing.output.items }}', state);
    expect(items).toEqual([]);
  });
});

describe('evaluateCondition (if_then)', () => {
  it('evaluates step output equality', () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['gate'] = {
      status: 'completed',
      output: { choice: 'approve' },
    };
    expect(evaluateCondition("{{ steps.gate.output.choice }} == 'approve'", state)).toBe(true);
    expect(evaluateCondition("{{ steps.gate.output.choice }} == 'reject'", state)).toBe(false);
  });

  it('evaluates step status', () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['impl'] = { status: 'completed' };
    expect(evaluateCondition("{{ steps.impl.status }} == 'completed'", state)).toBe(true);
    expect(evaluateCondition("{{ steps.impl.status }} == 'failed'", state)).toBe(false);
  });
});

describe('switch step', () => {
  it('routes to matched case', async () => {
    const state = createRunState('run-1', 'wf', { env: 'production' });
    const result = await executeSwitchStep(
      {
        id: 'sw',
        type: 'switch',
        on: '{{ inputs.env }}',
        cases: [
          { when: 'production', goto: 'deploy_prod' },
          { when: 'staging', goto: 'deploy_staging' },
        ],
        default: 'deploy_dev',
      },
      state,
    );
    expect(result.nextStepId).toBe('deploy_prod');
    expect(result.status).toBe('completed');
  });

  it('uses default when no case matches', async () => {
    const state = createRunState('run-1', 'wf', { env: 'local' });
    const result = await executeSwitchStep(
      {
        id: 'sw',
        type: 'switch',
        on: '{{ inputs.env }}',
        cases: [{ when: 'production', goto: 'deploy_prod' }],
        default: 'skip',
      },
      state,
    );
    expect(result.nextStepId).toBe('skip');
  });
});

describe('fan_in step', () => {
  it('aggregates fan_out results', async () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['my_fan_out'] = {
      status: 'completed',
      output: {
        results: [
          { item: 'a', status: 'completed', output: { x: 1 } },
          { item: 'b', status: 'completed', output: { x: 2 } },
          { item: 'c', status: 'failed', output: {} },
        ],
        count: 3,
        failedCount: 1,
      },
    };
    const result = await executeFanInStep({ id: 'fi', type: 'fan_in', from: 'my_fan_out' }, state);
    expect(result.status).toBe('failed');
    expect(result.output?.['total']).toBe(3);
    expect(result.output?.['completedCount']).toBe(2);
    expect(result.output?.['failedCount']).toBe(1);
  });

  it('succeeds when all items completed', async () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['fo'] = {
      status: 'completed',
      output: { results: [{ item: 'x', status: 'completed', output: {} }], count: 1, failedCount: 0 },
    };
    const result = await executeFanInStep({ id: 'fi', type: 'fan_in', from: 'fo' }, state);
    expect(result.status).toBe('completed');
  });
});

describe('while_loop step', () => {
  it('returns body step when condition is true', async () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['check'] = { status: 'completed', output: { ready: 'yes' } };
    const result = await executeWhileLoopStep(
      { id: 'loop', type: 'while_loop', condition: "{{ steps.check.output.ready }} == 'yes'", body: 'do_work', next: 'finish' },
      state,
      0,
    );
    expect(result.nextStepId).toBe('do_work');
  });

  it('returns next step when condition is false', async () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['check'] = { status: 'completed', output: { ready: 'no' } };
    const result = await executeWhileLoopStep(
      { id: 'loop', type: 'while_loop', condition: "{{ steps.check.output.ready }} == 'yes'", body: 'do_work', next: 'finish' },
      state,
      0,
    );
    expect(result.nextStepId).toBe('finish');
  });

  it('stops at maxIterations', async () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['check'] = { status: 'completed', output: { ready: 'yes' } };
    const result = await executeWhileLoopStep(
      { id: 'loop', type: 'while_loop', condition: "{{ steps.check.output.ready }} == 'yes'", body: 'do_work', maxIterations: 3 },
      state,
      3,
    );
    expect(result.output?.['maxReached']).toBe(true);
  });
});

describe('loadWorkflowDefinition', () => {
  it('loads built-in full-sdd workflow from JSON', () => {
    const def = loadWorkflowDefinition(
      path.join(TEMPLATES_DIR, 'shared', 'workflows', 'full-sdd.json'),
    );
    expect(def.name).toBe('full-sdd');
    expect(Array.isArray(def.steps)).toBe(true);
    expect(def.steps.length).toBeGreaterThan(0);
  });

  it('throws for unknown workflow name', () => {
    expect(() => loadWorkflowDefinition('nonexistent-workflow', '/tmp')).toThrow(
      /not found/,
    );
  });
});
