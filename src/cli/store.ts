import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

export interface WorkflowRunState {
  runId: string;
  workflowName: string;
  status: 'running' | 'paused' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  inputs: Record<string, unknown>;
  stepResults: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export class RunStore {
  private runsDir: string;

  constructor(auraDir: string) {
    this.runsDir = path.resolve(auraDir, 'workflows', 'runs');
  }

  create(workflowName: string, inputs: Record<string, unknown>, totalSteps: number): WorkflowRunState {
    const runId = `run-${randomBytes(4).toString('hex')}`;
    const now = new Date().toISOString();
    const state: WorkflowRunState = {
      runId,
      workflowName,
      status: 'running',
      currentStep: 0,
      totalSteps,
      inputs,
      stepResults: {},
      createdAt: now,
      updatedAt: now,
    };
    this.write(state);
    return state;
  }

  read(runId: string): WorkflowRunState | null {
    const statePath = path.join(this.runsDir, runId, 'state.json');
    if (!fs.existsSync(statePath)) return null;
    try {
      return JSON.parse(fs.readFileSync(statePath, 'utf8')) as WorkflowRunState;
    } catch {
      return null;
    }
  }

  update(runId: string, patch: Partial<WorkflowRunState>): WorkflowRunState {
    const current = this.read(runId);
    if (!current) throw new Error(`Run not found: ${runId}`);
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
    this.write(updated);
    return updated;
  }

  list(limit = 20): WorkflowRunState[] {
    if (!fs.existsSync(this.runsDir)) return [];
    return fs
      .readdirSync(this.runsDir)
      .filter((d) => fs.existsSync(path.join(this.runsDir, d, 'state.json')))
      .slice(-limit)
      .map((d) => this.read(d))
      .filter((s): s is WorkflowRunState => s !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  private write(state: WorkflowRunState): void {
    const dir = path.join(this.runsDir, state.runId);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify(state, null, 2), 'utf8');
  }
}
