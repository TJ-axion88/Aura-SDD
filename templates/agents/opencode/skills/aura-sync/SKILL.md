---
name: aura-sync
description: Spec↔Implementation drift detector. Scans spec.md acceptance criteria against implementation files and tasks.md, producing a coverage matrix and SYNC_STATUS verdict. Unique to Aura-SDD.
---

# aura-sync

## Goal

Detect drift between a feature's spec.md acceptance criteria and the actual implementation. Produce a coverage matrix and a clear SYNC_STATUS verdict so the team knows whether code and spec are in sync.

## Inputs

`/aura-sync <feature-name>` — scan one feature  
`/aura-sync --all` — scan all specs in `.aura/specs/`

## Execution Workflow

### Step 1 — Load spec artifacts

Read `.aura/specs/<feature>/spec.md`:
- Extract every acceptance criterion (lines matching WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL)
- Assign each an ID: AC-1, AC-2, … AC-N
- Note the boundary modules declared in the spec (used as search scope)

Read `.aura/specs/<feature>/tasks.md` (if exists):
- Extract task list with `[x]` / `[ ]` markers
- Build a map: `task-ID → AC-refs` (tasks often mention "covers AC-N")

Read `.aura/specs/<feature>/plan.md` (if exists):
- Extract declared implementation files / modules

### Step 2 — Build implementation search scope

Determine which files to search:
1. Files listed in `plan.md` boundary commitments
2. Files changed since the spec was created (`git log --since=<spec-created-date> --name-only`)
3. If neither available, search `src/` recursively

Exclude: `test/`, `*.md`, `*.json`, `*.toml`, `node_modules/`, `.aura/`

### Step 3 — Scan each AC for coverage evidence

For each acceptance criterion AC-N:
1. Extract key nouns/verbs from the EARS statement (e.g., "user", "login", "token", "expires")
2. Search implementation files for these terms using `grep -rn`
3. Check tasks.md for a completed task `[x]` that references this AC
4. Assign coverage status:

| Status | Criteria |
|--------|----------|
| **COVERED** | ≥1 completed task references AC-N AND keyword found in impl files |
| **PARTIAL** | Task completed OR keyword found, but not both |
| **MISSING** | No completed task AND no keyword match in impl files |
| **UNTESTABLE** | AC is a non-functional requirement (performance, security SLA) — flag for manual review |

### Step 4 — Build coverage matrix

Output a table:

```
## AC Coverage Matrix — <feature-name>

| AC  | Acceptance Criterion (summary)          | Task Status | Impl Signal | Status   |
|-----|----------------------------------------|-------------|-------------|----------|
| AC-1 | WHEN user logs in → token issued      | ✅ T-1.2    | found       | COVERED  |
| AC-2 | IF token expires → system rejects req | ✅ T-1.3    | found       | COVERED  |
| AC-3 | WHERE rate > 100 req/s → system queues | ❌ none     | not found   | MISSING  |
| AC-4 | WHILE session active → heartbeat sent  | ⚠️ T-2.1    | not found   | PARTIAL  |
```

### Step 5 — Determine SYNC_STATUS

```
IN_SYNC          → All ACs are COVERED or UNTESTABLE
PARTIAL_COVERAGE → Some ACs are PARTIAL (impl exists but task incomplete or vice versa)
DRIFT_DETECTED   → One or more ACs are MISSING (spec ahead of impl)
SPEC_BEHIND      → Implementation has features not in any AC (reverse drift)
```

For SPEC_BEHIND: search for TODOs, function names, or module additions that have no corresponding AC. Flag these as "orphaned implementation".

### Step 6 — Drift report

Output a structured report:

```
╔══════════════════════════════════════════════╗
║  aura-sync REPORT: <feature-name>            ║
╠══════════════════════════════════════════════╣
║  SYNC_STATUS: DRIFT_DETECTED                 ║
╠══════════════════════════════════════════════╣
║  Coverage Summary                            ║
║    COVERED   : 8  (80%)                      ║
║    PARTIAL   : 1  (10%)                      ║
║    MISSING   : 1  (10%)                      ║
║    UNTESTABLE: 0                             ║
╠══════════════════════════════════════════════╣
║  Blocking Issues                             ║
║    AC-3: WHERE rate > 100 req/s → no impl    ║
║    Recommended action: open task for AC-3    ║
╠══════════════════════════════════════════════╣
║  Warnings                                    ║
║    AC-4: task complete but no impl signal    ║
║    Orphaned impl: src/auth/refresh.ts        ║
║      (no AC covers token refresh logic)      ║
╚══════════════════════════════════════════════╝
```

### Step 7 — Recommended actions

Based on SYNC_STATUS:

**IN_SYNC** → No action needed. Proceed to `/aura-validate`.

**PARTIAL_COVERAGE** → For each PARTIAL AC:
- If task done but no impl signal: verify keyword — may be a false negative. Add `[sync-verified]` annotation.
- If impl found but task undone: mark task complete or open a clarification.

**DRIFT_DETECTED** → For each MISSING AC:
- Option A: Open a new task via `/aura-tasks --amend <feature>` to cover the AC
- Option B: If AC is no longer valid, run `/aura-spec-refine <feature>` to remove it

**SPEC_BEHIND** → For each orphaned implementation:
- Option A: Add a new AC to spec.md to formally cover the behavior
- Option B: Remove the orphaned code if it was added by mistake

## --all mode

When invoked as `/aura-sync --all`:
1. Scan every spec in `.aura/specs/*/spec.md`
2. Run Steps 1–6 for each
3. Output a rollup table:

```
## Aura-Sync: All Features

| Feature          | ACs | Covered | Missing | Status           |
|-----------------|-----|---------|---------|-----------------|
| auth-flow        |  10 |   10    |    0    | ✅ IN_SYNC       |
| payment-gateway  |   8 |    6    |    2    | ❌ DRIFT_DETECTED |
| user-profile     |   5 |    4    |    1    | ⚠️ PARTIAL       |
```

## Completion Criteria

- Coverage matrix produced for every requested spec
- SYNC_STATUS verdict stated with evidence
- Recommended actions provided for non-IN_SYNC statuses
- No false confidence: PARTIAL and UNTESTABLE are flagged, not silently passed
