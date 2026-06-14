---
name: aura-debug
description: Supporting skill. Root-cause-first debugging with 10 ROOT_CAUSE categories, CONFIDENCE scoring, and NEXT_ACTION recommendation. Called by /aura-impl.
---

# aura-debug

## Goal

Investigate a failed task implementation to its root cause and produce a concrete fix plan for the next Implementer subagent. Do not fix the code directly — produce a plan with CONFIDENCE scoring and NEXT_ACTION recommendation.

## Inputs (provided by /aura-impl)

- Error output and failing test output
- `/aura-review` rejection findings (both rounds)
- Task definition and boundary declaration
- Git diff of current (failing) implementation
- Relevant source files

## Execution Workflow

### Step 1 — Classify ROOT_CAUSE_CATEGORY (10 categories)

| Category | Signal | Approach |
|----------|--------|----------|
| `LOGIC_ERROR` | Test assertion failures, wrong output | Trace execution path |
| `BOUNDARY_VIOLATION` | Files outside `_Boundary:_` modified | Redesign component interaction |
| `MISSING_REQUIREMENT` | Acceptance criterion not covered | Re-read spec, identify gap |
| `MISSING_DEPENDENCY` | `cannot find module` / package not found | Check package.json, npm install |
| `CONFIG_GAP` | Missing env var, config key, or secret | Verify .env.example / config schema |
| `MODULE_FORMAT` | ESM/CJS mismatch, import/require conflict | Check `"type"` in package.json |
| `DESIGN_MISMATCH` | plan.md boundary commitment not followed | Revisit boundary commitments in plan.md |
| `SPEC_CONFLICT` | Requirements contradict design or existing code | Escalate — human must resolve |
| `TASK_SCOPE_EXCEEDED` | Task is too large; needs decomposition | Flag for task splitting in tasks.md |
| `CONSTITUTIONAL_VIOLATION` | An Aura-SDD Constitution Article was violated | Re-read `.aura/constitution.md`, identify Article, amend fix |

### Step 2 — Trace root cause

Do not assume the obvious failure point. Trace backward:
1. What is the exact error message?
2. What line causes it?
3. Why does that line produce this error?
4. What assumption in the design caused that line to be wrong?

Use web search if the error involves:
- External library behavior
- Platform-specific behavior (Windows vs Linux, Node version)
- Known framework bug

### Step 3 — Assess CONFIDENCE

| Level | Criteria |
|-------|----------|
| `HIGH` | Root cause is certain and reproducible. Fix is unambiguous. |
| `MEDIUM` | Root cause is likely but one assumption remains. Fix may need minor adjustment. |
| `LOW` | Multiple possible root causes. Fix is speculative. |

### Step 4 — Determine NEXT_ACTION

| Action | When to use |
|--------|-------------|
| `RETRY_TASK` | Root cause clear, fix is within task boundary, CONFIDENCE HIGH or MEDIUM |
| `BLOCK_TASK` | Fix requires change outside boundary OR CONFIDENCE LOW after thorough investigation |
| `STOP_FOR_HUMAN` | SPEC_CONFLICT / TASK_SCOPE_EXCEEDED / CONSTITUTIONAL_VIOLATION / external system unresolvable |

### Step 5 — Produce debug report

```markdown
## Debug Report — Task <id>

### ROOT_CAUSE_CATEGORY
<one of the 10 categories>

### CONFIDENCE
HIGH | MEDIUM | LOW
_Rationale:_ <one sentence on why this confidence level>

### Root Cause
<One sentence: the actual cause, not the symptom>

### Why previous attempts failed
<What the implementer assumed that was wrong>

### Fix Plan
1. <Specific change to file X>: <what to change and why>
2. <Specific change to file Y>: <what to change and why>

### Verification Steps
1. Run: `<test command>`
2. Expected: <specific output>

### NEXT_ACTION
RETRY_TASK | BLOCK_TASK | STOP_FOR_HUMAN
_Reason:_ <one sentence>

### Notes for Implementer
<Any non-obvious context the next implementer needs>
```

## Completion Criteria

- `ROOT_CAUSE_CATEGORY` assigned (one of 10)
- `CONFIDENCE` level with rationale stated
- Root cause identified (not just symptom)
- Fix plan specific enough for a new implementer with no prior context
- Verification steps listed
- `NEXT_ACTION` determined with reason
