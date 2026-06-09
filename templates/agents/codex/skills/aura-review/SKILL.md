---
name: aura-review
description: Supporting skill. Independent adversarial review of a completed task. Called by aura-impl.
---

# aura-review

## Goal

Perform an objective, adversarial review of a task's implementation. Approve or reject with specific, actionable findings. Never review your own work — this is always invoked as an independent subagent.

## Inputs (provided by aura-impl)

- Git diff of the task's changes
- Test output (pass/fail)
- Task definition (title, boundary, requirements mapping, files)
- `spec.md` acceptance criteria

## Review Protocol (12 checks)

### Mechanical verification
1. **Tests pass**: All tests green with no skips or `.only` markers
2. **No regressions**: Existing test suite still passes
3. **Test coverage**: New code has corresponding tests; RED phase was demonstrated

### Spec compliance
4. **Requirements coverage**: Each acceptance criterion mapped in the task is addressed
5. **EARS fidelity**: Implementation matches the WHEN/IF/WHILE/WHERE triggers in the spec
6. **Scenario completeness**: Edge cases from acceptance criteria handled (not just happy path)

### Boundary discipline
7. **Boundary scope**: Only files within `_Boundary:_` are modified
8. **No cross-boundary leakage**: No logic from another boundary's domain introduced
9. **Interface contracts**: Consumed and exposed interfaces match `plan.md` Boundary Commitments

### Code quality
10. **No secret complexity**: No abstractions introduced beyond what the task requires
11. **Error handling**: Errors propagate as defined in `plan.md` Error Handling section
12. **Constitutional compliance**: No violations of `.aura/constitution.md` articles

## Output

### APPROVED

```markdown
## Review: APPROVED — Task <id>

All 12 checks passed.
```

### REJECTED

```markdown
## Review: REJECTED — Task <id>

### Blocking Issues
- Check 7 FAIL: File `src/auth/session.ts` was modified but task boundary is `api`. Move session logic to `api/session-adapter.ts`.
- Check 4 FAIL: AC 2.3 (WHEN token expires, THE SYSTEM SHALL return 401) not tested.

### Suggestions (non-blocking)
- Consider extracting the retry logic into a shared utility for future reuse.

Fix required before merge.
```

## Completion Criteria

- All 12 checks evaluated with explicit PASS/FAIL
- Verdict: APPROVED or REJECTED
- Blocking issues listed with specific file/line references
