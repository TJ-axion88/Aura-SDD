---
name: aura-spec-batch
description: Create multiple specs in parallel from a roadmap.md. Cross-spec review catches contradictions and interface mismatches.
---

# aura-spec-batch

## Goal

Turn `.aura/discovery/roadmap.md` into multiple specs in parallel, then run a cross-spec review to catch contradictions, duplicated responsibilities, and interface mismatches.

## Inputs

Requires `.aura/discovery/roadmap.md` to exist. Run `/aura-discovery` first if not present.

## Execution Workflow

### Step 1 — Load roadmap

Read `.aura/discovery/roadmap.md`. Extract the ordered spec list and dependency graph.

### Step 2 — Dependency wave analysis

Group specs into parallel waves:
- Wave 1: specs with no dependencies
- Wave N: specs whose all dependencies are in waves < N

### Step 3 — Spawn spec agents per wave

For each wave, spawn parallel subagents — one per spec — each running the equivalent of `/aura-spec <feature>` with `--auto` (no human gate within the wave).

Each subagent:
1. Creates `.aura/specs/<NNN>-<feature>/` directory
2. Writes `spec.json` (status: draft)
3. Writes `spec.md` (EARS-format requirements, boundary candidates, acceptance criteria)

### Step 4 — Boundary conflict detection (Aura-SDD unique)

After all specs are drafted, run **boundary conflict detection** — unique to Aura-SDD:

For each spec, extract its `## Boundary Candidates` section into a set of path patterns.

Build a conflict matrix:
```
Spec A owns: src/auth/**
Spec B owns: src/auth/session.ts  ← CONFLICT: overlap with Spec A
Spec C owns: src/api/**           ← OK: no overlap
```

Conflict types:
- **Exact overlap**: both specs list the same file/directory
- **Subset overlap**: one spec's boundary is contained within another's
- **Pattern overlap**: glob patterns intersect (e.g., `src/auth/**` and `src/auth/session.ts`)

Output a `boundary-conflicts.md` in `.aura/discovery/` with:
```markdown
## Conflicts Found

### CONFLICT: auth-service ↔ user-management
- Both claim ownership of: src/auth/session.ts
- Resolution options:
  1. Assign `session.ts` exclusively to auth-service; user-management imports its interface
  2. Extract session management into a shared module owned by neither

### OK: api-gateway ↔ auth-service
- api-gateway: src/api/**
- auth-service: src/auth/**
- No overlap detected
```

### Step 5 — Cross-spec review

After conflict detection, run a full cross-spec review:

Check for:
- **Contradictions**: conflicting requirements between specs
- **Duplicated responsibilities**: same behavior owned by two specs
- **Interface mismatches**: spec A expects an API that spec B doesn't provide
- **Missing dependencies**: spec references a boundary not owned by any spec

Output a `cross-spec-review.md` in `.aura/discovery/`.

### Step 6 — Present results

List all created specs with status, boundary conflicts, and cross-spec issues.

```
Specs created: 4
  ✓ 001-auth-service (no conflicts)
  ⚠ 002-user-management (1 boundary conflict with 001-auth-service)
  ✓ 003-api-gateway (no conflicts)
  ✓ 004-notification-service (no conflicts)

Boundary conflicts: 1 (must resolve before /aura-plan)
Cross-spec issues: 2 (review cross-spec-review.md)
```

Prompt human to review `boundary-conflicts.md` and `cross-spec-review.md` before approving specs for planning.

## Completion Criteria

- One `spec.md` per roadmap entry written
- `boundary-conflicts.md` written with conflict matrix
- `cross-spec-review.md` written
- Any blocking conflicts clearly flagged
- Next command: `/aura-plan <feature>` for each approved spec (after resolving conflicts)
