---
trigger: manual
description: "Aura-SDD: Autonomous implementation — one task per iteration with Implementer→Reviewer→Debugger subagent trio and Implementation Notes propagation."
---

# aura-impl

Execute approved tasks from `tasks.md` one at a time. Each task uses a fresh subagent trio: Implementer (TDD: RED→GREEN→REFACTOR), Reviewer (`/aura-review`), and Debugger (`/aura-debug` if review fails twice). Propagate learnings via Implementation Notes in `tasks.md`.

**Usage:** `/aura-impl <feature-name> [task-ids]` or `/aura-impl <feature-name> --workflow` (fan_out mode for parallel tasks)

**Pre-flight:** Read `spec.json`. If `approvals.tasks` is null, block: "tasks.md not approved. Run `/aura-tasks <feature>` first."

**Per-task execution:**

1. **Select next task** — scan `tasks.md` for the next unchecked `- [ ]` task. If `task-ids` specified, process only those.

2. **Implementer subagent** — dispatch a fresh implementer with context: `.aura/constitution.md`, `.aura/steering/*.md`, `spec.md`, `plan.md`, the specific task definition, Implementation Notes from tasks.md, and the files listed in the task's `_Files:_`.

   Implementer protocol:
   - **RED phase**: Write the test first. Verify it fails with the right reason.
   - **GREEN phase**: Write minimal code to pass the test.
   - **REFACTOR phase**: Clean up without breaking tests.
   - Check `_Boundary:_` — do not modify files outside declared scope.
   - Run all relevant tests. Confirm passing.
   - If the task introduces user-visible behavior, wrap in a feature flag (`AURA_FF_<FEATURE>=true`) for RED→GREEN isolation.

3. **Invoke /aura-review** — pass: git diff of changes, test output, task definition, and `spec.md`. Review passes → proceed to Step 5. Review fails → go to Step 4.

4. **Invoke /aura-debug (max 2 rounds)** — if review fails:
   - Dispatch debug subagent with: error output, test results, boundary check results, rejection findings
   - Debug subagent produces a fix plan
   - New implementer subagent applies the fix plan
   - Return to Step 3
   - If debug round 2 also fails: "Task `<id>` failed after 2 debug rounds. Pausing. Human intervention required." Log the blocker in Implementation Notes and stop.

5. **Mark task complete** — check the task in tasks.md (`- [ ]` → `- [x]`). Append to Implementation Notes:
   ```markdown
   ### Task <id> — <title>
   - Key decision: <what and why>
   - Gotcha: <anything surprising>
   - Next tasks should know: <propagation note>
   ```

6. **Next iteration** — repeat from Step 1 for the next unchecked task. Context is reset between tasks (1-task-per-iteration discipline).

**--workflow mode:** When `--workflow` is used, parallel tasks in the same wave are dispatched as fan_out steps via the workflow engine. Fan_out results are aggregated before proceeding to the next wave.

**Completion criteria:** All tasks in tasks.md are `[x]`. Suggest `/aura-validate <feature-name>`.

Follow rules in `.aura/settings/rules/`.
