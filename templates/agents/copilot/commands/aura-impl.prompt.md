---
name: aura-impl
description: "Aura-SDD: Autonomous implementation — one task per iteration with Implementer→Reviewer→Debugger subagent trio and Implementation Notes propagation."
mode: agent
---

Execute approved tasks from `tasks.md` one at a time. Each task uses a fresh subagent trio: Implementer (TDD) → Reviewer (`/aura-review`) → Debugger (`/aura-debug` if needed). Propagate learnings via Implementation Notes.

Usage: `/aura-impl <feature-name> [task-ids]` or `/aura-impl <feature-name> --workflow` (fan_out mode for parallel tasks)

**Pre-flight check** — read `spec.json`. If `approvals.tasks` is null, block:
> tasks.md not approved. Run `/aura-tasks <feature>` first.

**Execution (per task):**

1. **Select next task** — scan `tasks.md` for the next unchecked `- [ ]` task. If `task-ids` specified, process only those.

2. **Implementer subagent** — dispatch with this context: `.aura/constitution.md`, `.aura/steering/*.md`, `spec.md`, `plan.md`, the specific task definition, Implementation Notes from tasks.md, and files listed in the task's `_Files:_`.

   Implementer protocol:
   - **RED phase**: Write the test first. Verify it fails with the right reason.
   - **GREEN phase**: Write minimal code to pass the test.
   - **REFACTOR phase**: Clean up without breaking tests.
   - Check `_Boundary:_` — do not modify files outside declared scope.
   - Run all relevant tests. Confirm passing.
   - If task introduces user-visible behavior, wrap in a feature flag (`AURA_FF_<FEATURE>=true`).

3. **Invoke /aura-review** — pass: git diff, test output, task definition, spec.md.
   - Review passes → proceed to Step 5.
   - Review fails → go to Step 4.

4. **Invoke /aura-debug (max 2 rounds)** — if review fails twice:
   - Dispatch debug subagent with error output, test results, boundary check results.
   - Debug subagent produces a fix plan; new implementer subagent applies it.
   - Return to Step 3.
   - If debug round 2 also fails: pause and log the blocker in Implementation Notes. Human intervention required.

5. **Mark task complete** — change `- [ ]` to `- [x]` in tasks.md. Append to Implementation Notes:
   ```
   ### Task <id> — <title>
   - Key decision: <what and why>
   - Gotcha: <anything surprising>
   - Next tasks should know: <propagation note>
   ```

6. **Next iteration** — repeat from Step 1 for the next unchecked task. Context is reset between tasks (1-task-per-iteration discipline).

**--workflow mode**: parallel tasks in the same wave are dispatched as fan_out steps via the workflow engine. Fan_out results aggregated before proceeding to next wave.

When all tasks are `[x]`, suggest `/aura-validate <feature-name>`.

Follow rules in `.aura/settings/rules/` for relevant guidance.
