# Boundary-First Principles

Boundaries are the primary mechanism for safe parallel development and autonomous implementation. Every spec must identify, commit to, and enforce boundaries throughout the lifecycle.

## What is a Boundary?

A boundary is the **interface contract** between two components, services, or modules. Boundaries define:
- What data crosses the seam (types, shapes)
- Who owns the data on each side
- What errors can propagate across
- What side effects are allowed

## Lifecycle

| Phase | Action |
|-------|--------|
| `/aura-discovery` | Identify **Boundary Candidates** — where does this feature touch other systems? |
| `/aura-spec` | List Boundary Candidates in the spec |
| `/aura-plan` | Fix **Boundary Commitments** — exact interface contracts |
| `/aura-tasks` | Annotate each task with `_Boundary:_` scope |
| `/aura-review` | Check 7, 8, 9: boundary scope, no leakage, interface contracts |
| `/aura-validate` | Cross-artifact boundary consistency check |

## Rules

### For discovery and spec
- List at least one Boundary Candidate for any non-trivial feature
- If you cannot identify a boundary, the feature scope is likely too large

### For plan
- Convert every Candidate to a Commitment with exact input/output types
- Mark stability: `stable` (won't change) or `experimental` (may change)
- Document error conditions across each boundary

### For tasks
- Each task MUST declare `_Boundary:_` — the boundary it operates within
- Tasks that cross a boundary are ONLY allowed for integration tests (Wave 2+)
- `_Boundary:_` must match a Commitment name from `plan.md`

### For review
- REJECT if any file modified is outside the task's `_Boundary:_`
- REJECT if the implementation doesn't match the Commitment's interface contract
- REJECT if errors don't propagate as specified in the Commitment

### For validation
- Check that Candidates (spec) ↔ Commitments (plan) ↔ Annotations (tasks) are consistent
- Drift = spec has candidates not in plan, or plan has commitments not referenced in tasks

## Anti-patterns to avoid

- **God boundary**: "Everything in this module" — too broad to be checkable
- **Missing error contract**: Boundary defined for happy path only
- **Stability mislabeling**: Marking as `stable` a boundary likely to change in next sprint
- **Cross-boundary tasks**: Single task touches 3 different boundaries
