import type { StepState, WorkflowRunState } from '../state.js';

export type IfThenStep = {
  id: string;
  type: 'if_then';
  condition: string;
  then: string;
  else?: string;
};

export const evaluateCondition = (
  expr: string,
  state: WorkflowRunState,
): boolean => {
  // Resolve {{ steps.<id>.output.<field> }} == value patterns
  const eqMatch = expr.match(/\{\{\s*steps\.(\w+)\.output\.(\w+)\s*\}\}\s*==\s*['"]([^'"]+)['"]/);
  if (eqMatch) {
    const [, stepId, field, expected] = eqMatch;
    const actual = state.steps[stepId]?.output?.[field];
    return String(actual) === expected;
  }

  // Resolve {{ steps.<id>.status }} == value
  const statusMatch = expr.match(/\{\{\s*steps\.(\w+)\.status\s*\}\}\s*==\s*['"]([^'"]+)['"]/);
  if (statusMatch) {
    const [, stepId, expected] = statusMatch;
    return state.steps[stepId]?.status === expected;
  }

  return false;
};

export const executeIfThenStep = async (
  step: IfThenStep,
  state: WorkflowRunState,
): Promise<StepState & { nextStepId: string }> => {
  const result = evaluateCondition(step.condition, state);
  const nextStepId = result ? step.then : (step.else ?? '__end__');
  console.log(`[aura-workflow] ⊹ If-then: condition=${result} → goto ${nextStepId}`);

  return {
    status: 'completed',
    output: { conditionResult: result, nextStepId },
    nextStepId,
    completedAt: new Date().toISOString(),
  };
};
