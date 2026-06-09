---
name: aura-workflow
description: Run, resume, list, and manage Aura workflow automation pipelines.
---

# aura-workflow

## Goal

Manage workflow pipelines defined in `.aura/workflows/definitions/`. Workflows automate the full SDD pipeline using 5 step types: skill, shell, gate, fan_out, if_then.

## Usage

```
aura-workflow run <name> [--input key=value ...]
aura-workflow resume <run-id>
aura-workflow list
aura-workflow status <run-id>
```

Or use the CLI directly:
```bash
npx aura-sdd workflow run full-sdd --input feature="My Feature"
npx aura-sdd workflow resume run-abc123
```

## Built-in Workflow: full-sdd

The bundled `full-sdd` workflow runs the complete pipeline:

```
discovery → [gate] → spec → [gate] → plan → [gate] → tasks → [gate] → fan_out(impl) → validate
```

Inputs:
- `feature`: Feature description or name
- `skip_constitution`: true/false (default: false)

## Writing Custom Workflows

Workflow definitions live in `.aura/workflows/definitions/` as JSON files:

```json
{
  "name": "my-workflow",
  "description": "Custom automation pipeline",
  "inputs": {
    "feature": { "type": "string", "required": true }
  },
  "steps": [
    {
      "id": "discovery",
      "type": "skill",
      "skill": "aura-discovery",
      "input": "{{ inputs.feature }}"
    },
    {
      "id": "gate_discovery",
      "type": "gate",
      "message": "Review brief.md and approve to continue",
      "options": ["approve", "reject"]
    },
    {
      "id": "parallel_impl",
      "type": "fan_out",
      "items": "{{ steps.tasks.output.task_ids }}",
      "step": {
        "type": "skill",
        "skill": "aura-impl",
        "args": ["{{ item }}"]
      }
    }
  ]
}
```

## Step Types Reference

| Type | Purpose |
|------|---------|
| `skill` | Invoke an Aura skill (`aura-*`) |
| `shell` | Run a shell command |
| `gate` | Pause for human review (resume with `aura-workflow resume`) |
| `fan_out` | Dispatch step for each item in a list (parallel) |
| `if_then` | Branch based on expression result |

## State Persistence

Workflow runs are saved to `.aura/workflows/runs/<run-id>/state.json`. If a workflow is interrupted (gate, error, or Ctrl+C), resume from the last completed step:

```bash
npx aura-sdd workflow resume <run-id>
```

## Completion Criteria

- Workflow runs to completion or pauses at gate
- State saved after each step
- Resume works from last completed step
