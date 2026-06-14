import type { StepState, WorkflowRunState } from '../state.js';

export type DoWhileStep = {
  id: string;
  type: 'do_while';
  condition: string;
  // ID of the step to jump to when condition is still true (loop body)
  body: string;
  // ID of the step after the loop (when condition becomes false)
  next?: string;
  maxIterations?: number;
};

const evaluateCondition = (expr: string, state: WorkflowRunState): boolean => {
  const eqMatch = expr.match(/\{\{\s*steps\.(\w+)\.output\.(\w+)\s*\}\}\s*==\s*['"]([^'"]+)['"]/);
  if (eqMatch) {
    const [, stepId, field, expected] = eqMatch;
    return String(state.steps[stepId]?.output?.[field]) === expected;
  }
  const statusMatch = expr.match(/\{\{\s*steps\.(\w+)\.status\s*\}\}\s*==\s*['"]([^'"]+)['"]/);
  if (statusMatch) {
    const [, stepId, expected] = statusMatch;
    return state.steps[stepId]?.status === expected;
  }
  return false;
};

export const executeDoWhileStep = async (
  step: DoWhileStep,
  state: WorkflowRunState,
  iteration: number,
): Promise<StepState & { nextStepId: string }> => {
  const maxIter = step.maxIterations ?? 100;
  if (iteration >= maxIter) {
    console.log(`[aura-workflow] ↺ Do-while "${step.id}": max iterations (${maxIter}) reached`);
    return {
      status: 'completed',
      output: { iteration, maxReached: true, nextStepId: step.next ?? '__end__' },
      nextStepId: step.next ?? '__end__',
      completedAt: new Date().toISOString(),
    };
  }

  // First iteration: always run the body (do_while semantics)
  if (iteration === 0) {
    console.log(`[aura-workflow] ↺ Do-while "${step.id}": first iteration → body=${step.body}`);
    return {
      status: 'completed',
      output: { condition: true, iteration, nextStepId: step.body },
      nextStepId: step.body,
      completedAt: new Date().toISOString(),
    };
  }

  // Subsequent iterations: check condition
  const cond = evaluateCondition(step.condition, state);
  const nextStepId = cond ? step.body : (step.next ?? '__end__');
  console.log(`[aura-workflow] ↺ Do-while "${step.id}": condition=${cond} (iter=${iteration}) → ${nextStepId}`);

  return {
    status: 'completed',
    output: { condition: cond, iteration, nextStepId },
    nextStepId,
    completedAt: new Date().toISOString(),
  };
};
