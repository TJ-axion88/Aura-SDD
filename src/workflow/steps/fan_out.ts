import type { StepState, WorkflowRunState } from '../state.js';

export type FanOutStepTemplate = {
  type: string;
  id?: string;
  [key: string]: unknown;
};

export type FanOutStep = {
  id: string;
  type: 'fan_out';
  items: string;
  step: FanOutStepTemplate;
  parallel?: boolean;
};

// Base shape shared by all workflow step types
export type BaseStep = { id: string; type: string; [key: string]: unknown };

export type StepDispatcher = (
  step: BaseStep,
  state: WorkflowRunState,
) => Promise<StepState>;

export const resolveFanOutItems = (
  itemsExpr: string,
  state: WorkflowRunState,
): unknown[] => {
  // Resolve {{ steps.<id>.output.<field> }} expressions
  const match = itemsExpr.match(/\{\{\s*steps\.(\w+)\.output\.(\w+)\s*\}\}/);
  if (match) {
    const [, stepId, field] = match;
    const stepOutput = state.steps[stepId]?.output;
    if (stepOutput && field in stepOutput) {
      const val = stepOutput[field];
      return Array.isArray(val) ? val : [val];
    }
  }
  // Resolve {{ inputs.<field> }}
  const inputMatch = itemsExpr.match(/\{\{\s*inputs\.(\w+)\s*\}\}/);
  if (inputMatch) {
    const [, field] = inputMatch;
    const val = state.inputs[field];
    return Array.isArray(val) ? val : [val];
  }
  return [];
};

export const executeFanOutStep = async (
  step: FanOutStep,
  items: unknown[],
  state: WorkflowRunState,
  dispatch: StepDispatcher,
): Promise<StepState> => {
  console.log(`[aura-workflow] ⇶ Fan-out: ${items.length} item(s) (${step.parallel ? 'parallel' : 'serial'})`);

  const runItem = async (item: unknown, idx: number): Promise<{ item: unknown; result: StepState }> => {
    // Inject item into the step template as {{ item }}
    const itemStr = typeof item === 'string' ? item : JSON.stringify(item);
    const interpolated = JSON.parse(
      JSON.stringify(step.step).replace(/\{\{\s*item\s*\}\}/g, itemStr)
    ) as FanOutStepTemplate;
    const syntheticId = `${step.id}_item_${idx}`;
    const stepWithId = { ...interpolated, id: syntheticId, type: interpolated.type ?? 'skill' };

    console.log(`[aura-workflow]   → [${idx + 1}/${items.length}] ${itemStr}`);
    const result = await dispatch(stepWithId, state);
    return { item, result };
  };

  let outcomes: Array<{ item: unknown; result: StepState }>;
  if (step.parallel) {
    outcomes = await Promise.all(items.map((item, idx) => runItem(item, idx)));
  } else {
    outcomes = [];
    for (let idx = 0; idx < items.length; idx++) {
      outcomes.push(await runItem(items[idx], idx));
    }
  }

  const failed = outcomes.filter((o) => o.result.status === 'failed');
  return {
    status: failed.length > 0 ? 'failed' : 'completed',
    output: {
      results: outcomes.map((o) => ({ item: o.item, status: o.result.status, output: o.result.output })),
      count: items.length,
      failedCount: failed.length,
    },
    completedAt: new Date().toISOString(),
  };
};
