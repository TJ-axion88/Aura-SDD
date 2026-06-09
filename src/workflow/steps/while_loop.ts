import type { StepState, WorkflowRunState } from '../state.js';

export type WhileLoopStep = {
  id: string;
  type: 'while_loop';
  condition: string;
  // ID of the step to jump to when condition is true (the loop body's first step)
  body: string;
  // ID of the step after the loop (when condition is false)
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

export const executeWhileLoopStep = async (
  step: WhileLoopStep,
  state: WorkflowRunState,
  iteration: number,
): Promise<StepState & { nextStepId: string }> => {
  const maxIter = step.maxIterations ?? 100;
  if (iteration >= maxIter) {
    console.log(`[aura-workflow] ⟳ While loop "${step.id}": max iterations (${maxIter}) reached`);
    return {
      status: 'completed',
      output: { iteration, maxReached: true, nextStepId: step.next ?? '__end__' },
      nextStepId: step.next ?? '__end__',
      completedAt: new Date().toISOString(),
    };
  }

  const cond = evaluateCondition(step.condition, state);
  const nextStepId = cond ? step.body : (step.next ?? '__end__');
  console.log(`[aura-workflow] ⟳ While loop "${step.id}": condition=${cond} (iter=${iteration}) → ${nextStepId}`);

  return {
    status: 'completed',
    output: { condition: cond, iteration, nextStepId },
    nextStepId,
    completedAt: new Date().toISOString(),
  };
};
