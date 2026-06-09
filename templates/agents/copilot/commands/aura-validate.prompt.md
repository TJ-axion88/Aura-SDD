---
name: aura-validate
description: "Aura-SDD: Feature-level integration validation returning GO / NO-GO / MANUAL_VERIFY_REQUIRED."
mode: agent
---

After all tasks are complete, perform a holistic validation of the feature against its spec, plan, and Constitutional principles. Return a clear verdict.

Usage: `/aura-validate <feature-name>`

1. **Completeness check**:
   - All tasks in `tasks.md` are `[x]`?
   - All requirements in `spec.md` have been addressed?
   - All Boundary Commitments in `plan.md` respected?

2. **Cross-artifact consistency** — check alignment between:
   - spec.md requirements ↔ plan.md architecture
   - plan.md boundary commitments ↔ tasks.md boundary annotations
   - tasks.md file list ↔ actual files created (git status / find)
   Flag any mismatches as **DRIFT**.

3. **Constitutional compliance** — re-evaluate each Constitutional Gate from `.aura/constitution.md` against the completed implementation. Confirm no implementation decision violates the Constitution.

4. **Quality checklist**:
   ```
   - [ ] All EARS acceptance criteria have corresponding passing tests
   - [ ] Integration tests cross at least one boundary
   - [ ] No feature-flagged code remains enabled by default (unless intentional)
   - [ ] Error paths tested (not just happy path)
   - [ ] No TODO or [NEEDS CLARIFICATION] markers in implementation
   - [ ] No files modified outside declared boundary scopes
   ```

5. **Run tests** — run full test suite. Report: pass count, fail count, coverage (if available).

6. **Verdict**:
   - **GO**: All checks pass. Feature ready for merge/release.
   - **NO-GO**: Blocking issues found — list each with actionable fix.
   - **MANUAL_VERIFY_REQUIRED**: Ambiguous state — list non-blocking findings requiring human judgment.

Follow rules in `.aura/settings/rules/` for relevant guidance.
