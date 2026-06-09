# Implementation Notes — Knowledge Propagation Rules

Rules for writing and reading Implementation Notes in `tasks.md`. These notes are the primary mechanism for propagating knowledge between task iterations.

## Purpose

Each task runs in a fresh context (1-task-per-iteration). Without Implementation Notes, the next task's implementer has no knowledge of:
- Decisions made in previous tasks
- Gotchas discovered during implementation
- Interfaces that deviated from plan.md
- Patterns established that subsequent tasks should follow

## Writing rules (after each task)

Write notes immediately after task completion. Include:

### What to include

1. **Key decisions**: Any choice made that wasn't specified in plan.md
   - "Used lazy initialization instead of eager because X"
   - "Changed the return type from X to Y because Z"

2. **Gotchas**: Anything surprising that cost time
   - "The `createSession` function returns null on timeout, not throwing"
   - "Type `UserID` is defined in auth/types.ts, not in shared/"

3. **Propagation notes**: Information subsequent tasks MUST know
   - "All subsequent tasks should use `userRepo.findByEmail()` not `userRepo.findById()` for email-based lookups"
   - "Task 1.2 must import from `./auth-context`, not from `../auth`"

4. **Interface deviations**: If the implementation deviated from plan.md Boundary Commitments
   - "Plan said `CreateItemResult` would be a union type, but we used an exceptions pattern for compatibility with framework middleware"

### What NOT to include

- How to use well-known libraries (the next implementer can read docs)
- Code snippets that duplicate what's already in the implementation files
- Tentative decisions (only record final decisions)

## Reading rules (before each task)

Before starting implementation, the implementer MUST:
1. Read ALL previous Implementation Notes in full
2. Check if any note creates a constraint on the current task
3. Verify the current task's interface assumptions match notes about deviations

## Format

```markdown
## Implementation Notes

### Task 0.1 — Types and interfaces
- Key decision: Added `sessionToken` to `UserSession` type (not in original plan) — required for SSO compatibility
- Gotcha: `bcrypt.hash()` is async even though the docs show sync signature in older versions
- Next tasks should know: Use `sessionRepo.createWithToken()` not `sessionRepo.create()`

### Task 1.1 — Login endpoint
- Key decision: Rate limiting applied at middleware layer, not inside the handler
- Interface deviation: Returns `{ redirect: string }` instead of `{ token: string }` — browser needs redirect URL
```
