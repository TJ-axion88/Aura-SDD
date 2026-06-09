---
name: aura-debug
description: Supporting skill. Root-cause-first debugging when /aura-review rejects twice. Called by /aura-impl.
---

# aura-debug

## Goal

Investigate a failed task implementation to its root cause and produce a concrete fix plan for the next Implementer subagent. Do not fix the code directly — produce a plan.

## Inputs (provided by /aura-impl)

- Error output and failing test output
- `/aura-review` rejection findings (both rounds)
- Task definition and boundary declaration
- Git diff of current (failing) implementation
- Relevant source files

## Execution Workflow

### Step 1 — Classify failure type

| Type | Signal | Approach |
|------|--------|----------|
| Logic error | Test assertion failures | Trace execution path |
| Boundary violation | Files outside boundary modified | Redesign component interaction |
| Missing requirement | AC not covered | Read spec again, identify gap |
| Environment issue | Dependency/config failures | Web search for platform issue |
| Design mismatch | plan.md contract not followed | Revisit boundary commitments |

### Step 2 — Trace root cause

Do not assume the obvious failure point. Trace backward:
1. What is the exact error message?
2. What line causes it?
3. Why does that line produce this error?
4. What assumption in the design caused that line to be wrong?

Use web search if the error involves:
- External library behavior
- Platform-specific behavior
- Known framework bug

### Step 3 — Produce fix plan

```markdown
## Debug Report — Task <id>

### Root Cause
<One sentence: the actual cause, not the symptom>

### Why previous attempts failed
<What the implementer assumed that was wrong>

### Fix Plan
1. <Specific change to file X>: <what to change and why>
2. <Specific change to file Y>: <what to change and why>

### Verification steps
1. Run: `<test command>`
2. Expected: <specific output>

### Notes for Implementer
<Any non-obvious context the next implementer needs>
```

## Completion Criteria

- Root cause identified (not just symptom)
- Fix plan is specific enough for a new implementer with no prior context
- Verification steps listed
