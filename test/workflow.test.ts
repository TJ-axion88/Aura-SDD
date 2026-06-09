import { describe, it, expect } from 'vitest';
import { generateRunId, createRunState } from '../src/workflow/state.js';
import { resolveFanOutItems } from '../src/workflow/steps/fan_out.js';
import { evaluateCondition } from '../src/workflow/steps/if_then.js';

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

  it('returns empty array for missing step', () => {
    const state = createRunState('run-1', 'wf', {});
    const items = resolveFanOutItems('{{ steps.missing.output.items }}', state);
    expect(items).toEqual([]);
  });
});

describe('evaluateCondition', () => {
  it('evaluates step output equality', () => {
    const state = createRunState('run-1', 'wf', {});
    state.steps['gate'] = {
      status: 'completed',
      output: { choice: 'approve' },
    };
    expect(evaluateCondition("{{ steps.gate.output.choice }} == 'approve'", state)).toBe(true);
    expect(evaluateCondition("{{ steps.gate.output.choice }} == 'reject'", state)).toBe(false);
  });
});
