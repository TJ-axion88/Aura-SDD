---
trigger: manual
description: "Aura-SDD: Feature-level integration validation after all tasks complete. Returns GO / NO-GO / MANUAL_VERIFY_REQUIRED."
---

# aura-validate

After all tasks are complete, perform a holistic validation of the feature against its spec, plan, and Constitutional principles. Return a clear verdict.

**Usage:** `/aura-validate <feature-name>`

1. **Completeness check**:
   - All tasks in `tasks.md` are `[x]`?
   - All requirements in `spec.md` have been addressed?
   - All Boundary Commitments in `plan.md` respected?

2. **Cross-artifact consistency** — run analysis:
   - spec.md requirements ↔ plan.md architecture alignment
   - plan.md boundary commitments ↔ tasks.md boundary annotations
   - tasks.md file list ↔ actual files created (git status / find)

   Flag any mismatches as **DRIFT**.

3. **Constitutional compliance** — re-evaluate each Constitutional Gate from `.aura/constitution.md` against the completed implementation. Check that no implementation decision violates the Constitution.

4. **Quality checklist**:
   ```markdown
   ## Implementation Checklist
   - [ ] All EARS acceptance criteria have corresponding passing tests
   - [ ] Integration tests cross at least one boundary
   - [ ] No feature-flagged code remains enabled by default (unless intentional)
   - [ ] Error paths tested (not just happy path)
   - [ ] No TODO or [NEEDS CLARIFICATION] markers in implementation
   - [ ] No files modified outside declared boundary scopes
   ```

5. **Run tests** — run full test suite. Report: pass count, fail count, coverage (if available).

6. **Verdict**:

   **GO**: All checks pass. Feature ready for merge/release.
   ```
   VALIDATE: GO
   All review checks passed across all tasks.
   All spec requirements covered.
   No boundary violations.
   Constitutional compliance confirmed.
   ```

   **NO-GO**: Blocking issues found.
   ```
   VALIDATE: NO-GO
   Blocking issues:
   - AC 2.3 has no passing test
   - Boundary violation in Task 1.2 (modified auth/session.ts)
   Fix these before proceeding.
   ```

   **MANUAL_VERIFY_REQUIRED**: Ambiguous state requiring human judgment.
   ```
   VALIDATE: MANUAL_VERIFY_REQUIRED
   Non-blocking findings requiring human review:
   - AC 3.1 is covered by an integration test but not a unit test
   - performance-sensitive path not benchmarked
   Human approval needed to proceed.
   ```

**Completion criteria:** All 4 validation steps completed, verdict stated with explicit evidence, for NO-GO: blocking items listed with actionable fixes.

Follow rules in `.aura/settings/rules/`.
