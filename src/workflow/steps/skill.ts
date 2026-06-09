import type { StepState, WorkflowRunState } from '../state.js';

export type SkillStep = {
  id: string;
  type: 'skill';
  skill: string;
  input?: string;
  args?: string[];
};

export const executeSkillStep = async (
  step: SkillStep,
  state: WorkflowRunState,
): Promise<StepState> => {
  // In a real deployment the workflow engine signals the AI agent to invoke
  // the named skill. Here we record the intent and mark as completed so the
  // engine can serialize state and the agent can resume.
  const argsStr = step.args ? step.args.join(' ') : '';
  const inputStr = step.input ? `\nInput: ${step.input}` : '';
  console.log(`[aura-workflow] ▶ Skill: /${step.skill}${argsStr ? ' ' + argsStr : ''}${inputStr}`);

  return {
    status: 'completed',
    output: { skill: step.skill, args: step.args ?? [], input: step.input },
    completedAt: new Date().toISOString(),
  };
};
