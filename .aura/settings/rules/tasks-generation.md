# Task Generation Rules

Rules for `/aura-tasks` when decomposing an approved plan into implementation tasks.

## Task sizing

- Each task: **1–3 hours** of focused implementation work
- If a task would take longer, split it
- If a task would take less than 30 minutes, merge it with an adjacent task

## Ordering rules

1. **Wave 0 always first**: Types, interfaces, shared utilities, database schema
2. **Test file before implementation file** within each task
3. **Dependency order**: Task N.M cannot start until all its `_Depends:_` are complete
4. **Integration last**: Cross-boundary tests always in the final wave

## Parallel marker rules (`[P]`)

Mark tasks `[P]` (parallel) ONLY when ALL are true:
- No output file is shared with other `[P]` tasks in the same wave
- No data flow dependency between the tasks
- Each task is bounded within a distinct boundary scope
- Total parallel tasks in one wave ≤ 5 (beyond that, reconsider decomposition)

## Required annotations

Every task MUST include:
```
_Boundary:_ <exact name from plan.md Boundary Commitments>
_Depends:_ <task id(s) or "none">
_Requires:_ <Scenario N (AC N.M, N.K)> from spec.md
_Files:_ <file1.ts (new|modify)>, <test1.test.ts (new|modify)>
```

## Boundary scope discipline

- A task's `_Files:_` list MUST only contain files within its `_Boundary:_` scope
- Exception: integration tasks (Wave 2+) may touch multiple boundaries
- If a task naturally touches 2 boundaries, split it

## Implementation Notes section

Always include an empty `## Implementation Notes` section at the bottom of tasks.md:
```markdown
## Implementation Notes
<!-- /aura-impl appends task learnings here after each task completes -->
```

## Anti-patterns to avoid

- Tasks that start with "implement everything for X" — too broad
- Tasks without `_Files:_` — unmeasurable
- Tasks with `_Depends:_: all previous tasks` — hides real dependency structure
- Wave 1 tasks with no `[P]` when they could safely run in parallel
- First task modifying implementation without writing tests first
