import type { StepState, WorkflowRunState } from '../state.js';

export type FanInStep = {
  id: string;
  type: 'fan_in';
  from: string;  // fan_out step ID whose results to aggregate
};

export const executeFanInStep = async (
  step: FanInStep,
  state: WorkflowRunState,
): Promise<StepState> => {
  const fanOutResult = state.steps[step.from]?.output;
  if (!fanOutResult) {
    throw new Error(`fan_in "${step.id}" references unknown step "${step.from}"`);
  }

  const results = (fanOutResult['results'] as Array<{ item: unknown; status: string; output?: unknown }>) ?? [];
  const completed = results.filter((r) => r.status === 'completed');
  const failed = results.filter((r) => r.status === 'failed');

  console.log(`[aura-workflow] ⇸ Fan-in: ${completed.length} completed, ${failed.length} failed`);

  return {
    status: failed.length > 0 ? 'failed' : 'completed',
    output: {
      total: results.length,
      completedCount: completed.length,
      failedCount: failed.length,
      items: completed.map((r) => r.output),
    },
    completedAt: new Date().toISOString(),
  };
};
