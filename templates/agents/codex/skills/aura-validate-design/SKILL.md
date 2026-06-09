---
name: aura-validate-design
description: Adversarial design review of plan.md before task decomposition. Catches architectural flaws, boundary violations, and missing interfaces early.
---

# aura-validate-design

## Goal

Run an independent adversarial review of `plan.md` before it proceeds to task decomposition. Catch problems early when they're cheap to fix.

## Inputs

`/aura-validate-design <feature>` — reads `.aura/specs/<NNN>-<feature>/plan.md`

## Execution Workflow

### Step 1 — Load artifacts

Read in order:
- `.aura/constitution.md` — check Constitutional Gates
- `.aura/steering/*.md` — project constraints
- `spec.md` — original requirements
- `plan.md` — design under review

### Step 2 — 10-point design checklist

Run each check. Mark PASS / FAIL / WARN:

1. **Constitutional Gates** — does the design violate any Constitution article?
2. **Requirement coverage** — does every EARS requirement map to at least one design component?
3. **Boundary completeness** — are all boundary contracts fully specified (inputs, outputs, error states)?
4. **Interface consistency** — do interfaces between components match on both sides?
5. **Dependency cycles** — does the File Structure Plan have circular dependencies?
6. **Testability** — can each component be unit-tested in isolation?
7. **Scalability assumptions** — are load/data-size assumptions stated and realistic?
8. **Error propagation** — are error paths designed (not just happy paths)?
9. **Security surface** — are authentication, authorization, and input validation addressed?
10. **Spec drift** — does the design solve the spec's actual problem, or has scope crept?

### Step 3 — Write design review report

Write `.aura/specs/<NNN>-<feature>/design-review.md`:

```markdown
# Design Review: <feature>

## Verdict: APPROVE / REVISE / REJECT

## Checklist results
| # | Check | Result | Notes |
|---|-------|--------|-------|
...

## Required changes (blocking)
...

## Suggested improvements (non-blocking)
...
```

### Step 4 — Gate decision

- **APPROVE**: proceed to `/aura-tasks <feature>`
- **REVISE**: list specific changes needed, re-run after update
- **REJECT**: fundamental rethink needed, return to `/aura-plan`

## Completion Criteria

- All 10 checks evaluated
- `design-review.md` written with verdict
- Blocking issues listed with specific fix instructions
- Gate decision stated
