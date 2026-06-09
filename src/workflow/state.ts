import fs from 'fs';
import path from 'path';
import { writeFileSafe } from '../utils/fs.js';

export type RunStatus = 'created' | 'running' | 'paused' | 'completed' | 'failed' | 'aborted';

export type StepState = {
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'paused';
  output?: Record<string, unknown>;
  error?: string;
  startedAt?: string;
  completedAt?: string;
};

export type WorkflowRunState = {
  runId: string;
  workflowName: string;
  status: RunStatus;
  inputs: Record<string, unknown>;
  steps: Record<string, StepState>;
  currentStepId?: string;
  createdAt: string;
  updatedAt: string;
};

export const createRunState = (
  runId: string,
  workflowName: string,
  inputs: Record<string, unknown>,
): WorkflowRunState => ({
  runId,
  workflowName,
  status: 'created',
  inputs,
  steps: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const saveRunState = (
  state: WorkflowRunState,
  runsDir: string,
): void => {
  const stateFile = path.join(runsDir, state.runId, 'state.json');
  writeFileSafe(stateFile, JSON.stringify(state, null, 2));
};

export const loadRunState = (runId: string, runsDir: string): WorkflowRunState => {
  const stateFile = path.join(runsDir, runId, 'state.json');
  const raw = fs.readFileSync(stateFile, 'utf8');
  return JSON.parse(raw) as WorkflowRunState;
};

export const updateRunState = (
  state: WorkflowRunState,
  updates: Partial<WorkflowRunState>,
): WorkflowRunState => ({
  ...state,
  ...updates,
  updatedAt: new Date().toISOString(),
});

export const generateRunId = (): string => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `run-${ts}-${rand}`;
};
