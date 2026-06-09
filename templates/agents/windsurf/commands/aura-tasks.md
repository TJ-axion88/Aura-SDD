---
trigger: manual
description: "Aura-SDD: Decompose an approved plan into implementation tasks with Boundary annotations, parallel markers, and dependency declarations."
---

# aura-tasks

Read the approved `plan.md` and produce `.aura/specs/<feature>/tasks.md` — an ordered list of implementation tasks. Each task maps to requirements, annotates its `_Boundary:_` scope, declares `_Depends:_` on prior tasks, is marked `[P]` if safely parallel-executable, and is ordered test-first. Pause for human approval.

**Usage:** `/aura-tasks <feature-name>`

1. **Load all context** — read `.aura/specs/<feature>/spec.md`, `.aura/specs/<feature>/plan.md`, and `spec.json` (check `approvals.plan` is not null). If plan is not approved, block: "plan.md has not been approved. Run `/aura-plan <feature>` first."

2. **Parallel analysis** — identify which tasks can run concurrently (no shared output files, no data dependency between them, bounded by independent boundaries). Mark concurrent tasks with `[P]` in the same wave.

3. **Write tasks.md** using this structure:
   ```markdown
   # Tasks: <Feature Name>

   ## Implementation Waves

   ### Wave 0 — Foundation (must complete before parallel work)
   - [ ] **Task 0.1** — <title>
     _Boundary:_ <boundary name>
     _Depends:_ none
     _Requires:_ Scenario 1 (AC 1.1, 1.2)
     _Files:_ `src/<file>.ts` (new), `test/<file>.test.ts` (new)
     <description of what to implement, test-first>

   ### Wave 1 — Parallel implementation [P]
   - [ ] **Task 1.1** [P] — <title>
     _Boundary:_ <boundary A>
     _Depends:_ Task 0.1
     _Requires:_ Scenario 2 (AC 2.1)
     _Files:_ `src/<fileA>.ts`
     <description>

   - [ ] **Task 1.2** [P] — <title>
     _Boundary:_ <boundary B>
     _Depends:_ Task 0.1
     _Requires:_ Scenario 3 (AC 3.1)
     _Files:_ `src/<fileB>.ts`
     <description>

   ### Wave 2 — Integration
   - [ ] **Task 2.1** — <title>
     _Boundary:_ integration
     _Depends:_ Task 1.1, Task 1.2
     _Requires:_ All scenarios
     _Files:_ `test/integration/<feature>.test.ts`
     Write integration tests crossing boundaries

   ## Implementation Notes
   <!-- /aura-impl will append learnings here after each task -->
   ```

   **Task decomposition rules:**
   - Each task: 1–3 hours of focused work
   - Test files listed before implementation files (test-first order)
   - Boundary scope: one task should NOT touch multiple boundaries unless it is the integration task
   - Wave 0 always exists: types, interfaces, shared utilities
   - Final wave always: integration tests + validation

4. **Boundary Violation check** — review the task list. Flag any task that modifies files outside its declared `_Boundary:_` or depends on output from a task in the same wave.

5. **Human approval gate** — present tasks.md and ask: "Review `.aura/specs/<feature>/tasks.md`. Approve to proceed to `/aura-impl`? [y/N/edit]". On approval, update `spec.json` `approvals.tasks` and `phase` to "impl".

**Completion criteria:** Every task has `_Boundary:_`, `_Depends:_`, `_Requires:_`, `_Files:_`; parallel tasks marked `[P]`; no boundary violations; Implementation Notes section present; human approval recorded.

Follow rules in `.aura/settings/rules/`.
