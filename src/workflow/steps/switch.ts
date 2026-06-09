import type { StepState, WorkflowRunState } from '../state.js';

export type SwitchCase = {
  when: string;
  goto: string;
};

export type SwitchStep = {
  id: string;
  type: 'switch';
  on: string;
  cases: SwitchCase[];
  default?: string;
};

const resolveValue = (expr: string, state: WorkflowRunState): string => {
  const stepField = expr.match(/\{\{\s*steps\.(\w+)\.output\.(\w+)\s*\}\}/);
  if (stepField) {
    const [, stepId, field] = stepField;
    return String(state.steps[stepId]?.output?.[field] ?? '');
  }
  const inputField = expr.match(/\{\{\s*inputs\.(\w+)\s*\}\}/);
  if (inputField) {
    return String(state.inputs[inputField[1]] ?? '');
  }
  return expr;
};

export const executeSwitchStep = async (
  step: SwitchStep,
  state: WorkflowRunState,
): Promise<StepState & { nextStepId: string }> => {
  const value = resolveValue(step.on, state);
  const matched = step.cases.find((c) => c.when === value);
  const nextStepId = matched?.goto ?? step.default ?? '__end__';
  console.log(`[aura-workflow] ⊹ Switch: "${value}" → ${nextStepId}`);
  return {
    status: 'completed',
    output: { value, nextStepId },
    nextStepId,
    completedAt: new Date().toISOString(),
  };
};
