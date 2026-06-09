import { execSync } from 'child_process';
import type { StepState } from '../state.js';

export type ShellStep = {
  id: string;
  type: 'shell';
  command: string;
  continueOnError?: boolean;
};

export const executeShellStep = async (
  step: ShellStep,
): Promise<StepState> => {
  console.log(`[aura-workflow] $ ${step.command}`);
  try {
    const output = execSync(step.command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(output.trim());
    return {
      status: 'completed',
      output: { stdout: output.trim() },
      completedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[aura-workflow] Shell error: ${message}`);
    if (step.continueOnError) {
      return {
        status: 'failed',
        error: message,
        output: {},
        completedAt: new Date().toISOString(),
      };
    }
    throw err;
  }
};
