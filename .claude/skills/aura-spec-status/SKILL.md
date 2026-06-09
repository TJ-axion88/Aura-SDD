---
name: aura-spec-status
description: Track progress across all specs. Shows pipeline phase, task completion, health scores, and blocked items at a glance. Unique health scoring is exclusive to Aura-SDD.
---

# aura-spec-status

## Goal

Give a complete progress snapshot of all specs in `.aura/specs/`. Shows where each spec is in the pipeline, how many tasks are done, and what is blocked. Includes **Aura-SDD health scoring** that rates spec quality before implementation begins.

## Inputs

Optional: `/aura-spec-status <feature>` for a single spec.
No argument: scan all specs.

## Execution Workflow

### Step 1 — Scan specs

Read all `.aura/specs/*/spec.json` files. Extract:
- Feature name
- Status field
- Creation date

### Step 2 — Determine phase

For each spec, check which files exist:

| Files present | Phase |
|---------------|-------|
| spec.json only | discovery |
| + spec.md | requirements |
| + plan.md | planning |
| + tasks.md | ready to implement |
| tasks.md with all `[x]` | implemented |
| + validation passed | complete |

### Step 3 — Task progress (if tasks.md exists)

Count:
- Total tasks
- Completed tasks (`[x]`)
- In-progress (marked `[~]` or `status: in_progress`)
- Blocked (marked `[!]`)

### Step 4 — Health scoring (Aura-SDD unique)

For each spec that has a `spec.md`, compute three health scores (0–100):

**Completeness Score** — how much of the spec template is filled in
- Each required section present: +10 pts
- Each EARS requirement with all 4 fields (trigger, condition, response, acceptance): +5 pts
- Boundary candidates defined: +10 pts
- Non-functional requirements present: +10 pts
- No `[TODO]` or `[TBD]` markers remaining: +10 pts

**Ambiguity Score** (lower is better: 0 = most ambiguous, 100 = unambiguous)
- Each `[NEEDS CLARIFICATION]` marker: -10 pts from 100
- Vague words ("fast", "secure", "good", "simple") without measurable criteria: -5 pts each
- Open questions still unresolved: -8 pts each

**Testability Score** — how testable the requirements are
- Each EARS requirement with a binary pass/fail acceptance criterion: +8 pts
- Each requirement with an explicit metric (e.g., "< 200ms", "≥ 99.9%"): +5 pts
- Ratio of testable requirements to total requirements × 50 pts

Display scores as colored bar (if terminal supports it) or numeric:
```
photo-albums  completeness: ████░░ 68%  ambiguity: ███░░░ 55  testability: ████░ 71%
```

Thresholds:
- **Green** (ready to plan): completeness ≥ 80%, ambiguity ≥ 60, testability ≥ 70%
- **Yellow** (proceed with caution): any score in range [50, threshold)
- **Red** (needs refinement): any score < 50%

For red specs, suggest: `/aura-spec-refine <feature>` to improve the spec.

### Step 5 — Render status table

```
Feature              Phase           Tasks      Health          Status
-------------------------------------------------------------------------
photo-albums         implementing    3/8 done   C:68 A:55 T:71  ● in progress
user-auth            complete        8/8 done   C:95 A:88 T:90  ✓ done
notifications        planning        —          C:45 A:30 T:40  ⚠ refine spec
search               requirements    —          C:72 A:65 T:68  ⏳ awaiting approval
```

### Step 6 — Highlight actions needed

List any specs that need human action:
- Specs with red health scores → suggest `/aura-spec-refine`
- Specs awaiting approval to proceed to next phase
- Specs with blocked tasks
- Specs where `/aura-impl` stopped and needs resume

## Completion Criteria

- Status table rendered for all (or specified) specs
- Health scores computed for specs with `spec.md`
- Blocked items and required actions highlighted
- Next commands suggested per spec (including `/aura-spec-refine` for low-health specs)
