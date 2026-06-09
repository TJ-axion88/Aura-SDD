import type { StepState } from '../state.js';
import { askChoice } from '../../cli/ui/prompt.js';

export type GateStep = {
  id: string;
  type: 'gate';
  message: string;
  options?: string[];
};

export const executeGateStep = async (
  step: GateStep,
): Promise<StepState> => {
  const opts = step.options ?? ['approve', 'reject'];
  console.log(`\n[aura-workflow] ⏸  Gate: ${step.message}`);
  const choice = await askChoice('Select an option', opts);

  if (choice === 'reject' || choice === 'abort') {
    return {
      status: 'failed',
      error: `Gate rejected by user (choice: ${choice})`,
      output: { choice },
      completedAt: new Date().toISOString(),
    };
  }

  if (choice === 'pause' || choice === 'edit') {
    return {
      status: 'paused',
      output: { choice },
    };
  }

  return {
    status: 'completed',
    output: { choice },
    completedAt: new Date().toISOString(),
  };
};
