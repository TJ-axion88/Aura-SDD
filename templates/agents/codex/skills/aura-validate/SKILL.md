---
name: aura-validate
description: Feature-level integration validation. Returns GO / NO-GO / MANUAL_VERIFY_REQUIRED. Combines cross-artifact analysis and implementation checklist.
---

# aura-validate

## Goal

After all tasks are complete, perform a holistic validation of the feature against its spec, plan, and Constitutional principles. Return a clear verdict.

## Inputs

`aura-validate <feature-name>`

## Execution Workflow

### Step 1 — Completeness check

- All tasks in `tasks.md` are `[x]`?
- All requirements in `spec.md` have been addressed?
- All Boundary Commitments in `plan.md` respected?

### Step 2 — Cross-artifact consistency

Run `aura-analyze` protocol:
- spec.md requirements ↔ plan.md architecture alignment
- plan.md boundary commitments ↔ tasks.md boundary annotations
- tasks.md file list ↔ actual files created (git status / find)

Flag any mismatches as **DRIFT**.

### Step 3 — Constitutional compliance

Re-evaluate each Constitutional Gate from `.aura/constitution.md` against the completed implementation. Check that no implementation decision violates the Constitution.

### Step 4 — Quality checklist

```markdown
## Implementation Checklist
- [ ] All EARS acceptance criteria have corresponding passing tests
- [ ] Integration tests cross at least one boundary
- [ ] No feature-flagged code remains enabled by default (unless intentional)
- [ ] Error paths tested (not just happy path)
- [ ] No TODO or [NEEDS CLARIFICATION] markers in implementation
- [ ] No files modified outside declared boundary scopes
```

### Step 5 — Run tests

```bash
# Run full test suite
# Report: pass count, fail count, coverage (if available)
```

### Step 6 — Verdict

**GO**: All checks pass. Feature ready for merge/release.
```
✅ VALIDATE: GO
All 12 review checks passed across all tasks.
All spec requirements covered.
No boundary violations.
Constitutional compliance confirmed.
```

**NO-GO**: Blocking issues found.
```
❌ VALIDATE: NO-GO
Blocking issues:
- AC 2.3 has no passing test
- Boundary violation in Task 1.2 (modified auth/session.ts)
Fix these before proceeding.
```

**MANUAL_VERIFY_REQUIRED**: Ambiguous state requiring human judgment.
```
⚠️ VALIDATE: MANUAL_VERIFY_REQUIRED
Non-blocking findings requiring human review:
- AC 3.1 is covered by an integration test but not a unit test
- performance-sensitive path not benchmarked
Human approval needed to proceed.
```

## Completion Criteria

- All 4 validation steps completed
- Verdict stated with explicit evidence
- For NO-GO: blocking items listed with actionable fixes
