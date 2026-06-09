---
name: aura-spec-status
description: Track progress across all specs. Shows pipeline phase, task completion, and blocked items at a glance.
---

# aura-spec-status

## Goal

Give a complete progress snapshot of all specs in `.aura/specs/`. Shows where each spec is in the pipeline, how many tasks are done, and what is blocked.

## Inputs

Optional: `/aura-spec-status <feature>` for a single spec.
No argument: scan all specs.

## Execution Workflow

### Step 1 — Scan specs

Read all `.aura/specs/*/spec.json` files. Extract:
- Feature name
- Status field
- Creation date

### Step 2 — Determine phase

For each spec, check which files exist:

| Files present | Phase |
|---------------|-------|
| spec.json only | discovery |
| + spec.md | requirements |
| + plan.md | planning |
| + tasks.md | ready to implement |
| tasks.md with all `[x]` | implemented |
| + validation passed | complete |

### Step 3 — Task progress (if tasks.md exists)

Count:
- Total tasks
- Completed tasks (`[x]`)
- In-progress (marked `[~]` or `status: in_progress`)
- Blocked (marked `[!]`)

### Step 4 — Render status table

```
Feature              Phase           Tasks      Status
------------------------------------------------------------
photo-albums         implementing    3/8 done   ● in progress
user-auth            complete        8/8 done   ✓ done
notifications        planning        —          ⏳ awaiting approval
search               requirements    —          ⏳ awaiting approval
```

### Step 5 — Highlight actions needed

List any specs that need human action:
- Specs awaiting approval to proceed to next phase
- Specs with blocked tasks
- Specs where `/aura-impl` stopped and needs resume

## Completion Criteria

- Status table rendered for all (or specified) specs
- Blocked items and required actions highlighted
- Next commands suggested per spec
