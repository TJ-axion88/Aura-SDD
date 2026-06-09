---
name: aura-review
description: "Aura-SDD: Independent adversarial review of a completed task. Supporting skill called by /aura-impl."
mode: agent
---

Perform an objective, adversarial review of a task's implementation. Approve or reject with specific, actionable findings. Never review your own work — always invoked as an independent subagent.

**Inputs (provided by /aura-impl):** git diff of the task's changes, test output (pass/fail), task definition (title, boundary, requirements mapping, files), `spec.md` acceptance criteria.

**Review Protocol — 12 checks:**

Mechanical verification:
1. **Tests pass**: All tests green with no skips or `.only` markers
2. **No regressions**: Existing test suite still passes
3. **Test coverage**: New code has corresponding tests; RED phase was demonstrated

Spec compliance:
4. **Requirements coverage**: Each acceptance criterion mapped in the task is addressed
5. **EARS fidelity**: Implementation matches the WHEN/IF/WHILE/WHERE triggers in the spec
6. **Scenario completeness**: Edge cases from acceptance criteria handled (not just happy path)

Boundary discipline:
7. **Boundary scope**: Only files within `_Boundary:_` are modified
8. **No cross-boundary leakage**: No logic from another boundary's domain introduced
9. **Interface contracts**: Consumed and exposed interfaces match `plan.md` Boundary Commitments

Code quality:
10. **No secret complexity**: No abstractions introduced beyond what the task requires
11. **Error handling**: Errors propagate as defined in `plan.md` Error Handling section
12. **Constitutional compliance**: No violations of `.aura/constitution.md` articles

**Output:**

APPROVED:
```
## Review: APPROVED — Task <id>
All 12 checks passed.
```

REJECTED:
```
## Review: REJECTED — Task <id>

### Blocking Issues
- Check 7 FAIL: File `src/auth/session.ts` modified but task boundary is `api`.
- Check 4 FAIL: AC 2.3 not tested.

### Suggestions (non-blocking)
- <optional improvement>

Fix required before merge.
```

All 12 checks must be evaluated with explicit PASS/FAIL. Blocking issues must include specific file/line references.

Follow rules in `.aura/settings/rules/` for relevant guidance.
