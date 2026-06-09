import type { StepState, WorkflowRunState } from '../state.js';

export type FanOutStepTemplate = {
  type: string;
  [key: string]: unknown;
};

export type FanOutStep = {
  id: string;
  type: 'fan_out';
  items: string;
  step: FanOutStepTemplate;
};

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
): Promise<StepState> => {
  console.log(`[aura-workflow] ⇶ Fan-out: ${items.length} item(s)`);
  const results: unknown[] = [];

  for (const item of items) {
    console.log(`[aura-workflow]   → Processing item: ${JSON.stringify(item)}`);
    results.push({ item, status: 'completed' });
  }

  return {
    status: 'completed',
    output: { results, count: items.length },
    completedAt: new Date().toISOString(),
  };
};
