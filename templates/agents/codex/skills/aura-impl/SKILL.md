---
name: aura-impl
description: Long-running autonomous implementation. One task per iteration with Implementer→Reviewer→Debugger subagent trio and Implementation Notes propagation.
---

# aura-impl

## Goal

Execute approved tasks from `tasks.md` one at a time. Each task uses a fresh subagent trio:
1. **Implementer** — implements the task (TDD: RED → GREEN → REFACTOR)
2. **Reviewer** — independent adversarial review (`aura-review`)
3. **Debugger** — root-cause analysis if review fails twice (`aura-debug`)

Propagate learnings via Implementation Notes in `tasks.md`.

## Inputs

`aura-impl <feature-name> [task-ids]`  
`aura-impl <feature-name> --workflow` (fan_out mode for parallel tasks)

## Pre-flight checks

Read `spec.json`. If `approvals.tasks` is null, block:
> ⛔ tasks.md not approved. Run `aura-tasks <feature>` first.

## Execution Workflow (per task)

### Step 1 — Select next task

Scan `tasks.md` for the next unchecked `- [ ]` task. If `task-ids` specified, process only those.

### Step 2 — Implementer subagent

Dispatch a fresh implementer subagent with this context:
- `.aura/constitution.md`
- `.aura/steering/*.md`
- `.aura/specs/<feature>/spec.md`
- `.aura/specs/<feature>/plan.md`
- The specific task definition (from tasks.md)
- Implementation Notes from tasks.md (prior task learnings)
- Files listed in the task's `_Files:_`

Implementer protocol:
1. **RED phase**: Write the test first. Verify it fails with the right reason.
2. **GREEN phase**: Write minimal code to pass the test.
3. **REFACTOR phase**: Clean up without breaking tests.
4. Check `_Boundary:_` — do not modify files outside declared scope.
5. Run all relevant tests. Confirm passing.

Feature flag isolation: if the task introduces user-visible behavior, wrap in a feature flag (`AURA_FF_<FEATURE>=true`) for RED→GREEN isolation.

### Step 3 — Invoke aura-review

Pass to the review subagent:
- Git diff of changes
- Test output
- The task definition
- `spec.md` (requirements traceability)

Review passes → proceed to Step 5.  
Review fails → go to Step 4.

### Step 4 — Invoke aura-debug (max 2 rounds)

If review fails twice:
1. Dispatch debug subagent with: error output, test results, boundary check results
2. Debug subagent produces a fix plan
3. New implementer subagent applies the fix plan
4. Return to Step 3

If debug round 2 also fails:
> ⚠️ Task `<id>` failed after 2 debug rounds. Pausing. Human intervention required.
Log the blocker in Implementation Notes and stop.

### Step 5 — Mark task complete

Check the task in tasks.md: `- [ ]` → `- [x]`

Append to Implementation Notes:
```markdown
### Task <id> — <title>
- Key decision: <what and why>
- Gotcha: <anything surprising>
- Next tasks should know: <propagation note>
```

### Step 6 — Next iteration

Repeat from Step 1 for the next unchecked task. Context is reset between tasks (1-task-per-iteration discipline).

## --workflow mode (fan_out parallel)

When `--workflow` is used, parallel tasks in the same wave are dispatched as fan_out steps via the workflow engine. Fan_out results are aggregated before proceeding to the next wave.

## Completion Criteria (all tasks done)

All tasks in tasks.md are `[x]`. Suggest `aura-validate <feature-name>`.
