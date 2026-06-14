---
description: "Aura-SDD: Spec↔Implementation drift detector. Scans spec.md ACs against implementation files, produces coverage matrix and SYNC_STATUS verdict."
---

# aura-sync

Detect drift between a feature's spec.md acceptance criteria and the actual implementation.

**Usage:** `aura-sync <feature-name>` or `aura-sync --all`

## Step 1 — Load spec artifacts

Read `.aura/specs/<feature>/spec.md` — extract every AC (WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL lines), assign IDs AC-1…AC-N. Read `tasks.md` for task↔AC refs. Read `plan.md` for declared files.

## Step 2 — Build search scope

Search files from `plan.md` boundary commitments or `git log` since spec creation. Exclude `test/`, `*.md`, `*.json`, `node_modules/`, `.aura/`.

## Step 3 — Scan each AC

For each AC: extract key terms → `grep -rn` in impl files → check tasks.md for completed task referencing AC.

**Status rules:**
- **COVERED**: completed task references AC AND keyword found in impl
- **PARTIAL**: task done OR keyword found, but not both
- **MISSING**: no task, no keyword
- **UNTESTABLE**: non-functional requirement — flag for manual review

## Step 4 — Coverage matrix

```
| AC  | Criterion (summary)                    | Task Status | Impl Signal | Status  |
|-----|---------------------------------------|-------------|-------------|---------|
| AC-1 | WHEN user logs in → token issued     | ✅ T-1.2    | found       | COVERED |
| AC-2 | IF token expires → system rejects    | ✅ T-1.3    | found       | COVERED |
| AC-3 | WHERE rate > 100 req/s → queue       | ❌ none     | not found   | MISSING |
```

## Step 5 — SYNC_STATUS verdict

- `IN_SYNC` — All ACs COVERED or UNTESTABLE
- `PARTIAL_COVERAGE` — Some ACs PARTIAL
- `DRIFT_DETECTED` — One or more ACs MISSING
- `SPEC_BEHIND` — Impl has features not in any AC (orphaned code)

## Step 6 — Report

```
╔══════════════════════════════════════╗
║  aura-sync: <feature-name>           ║
║  SYNC_STATUS: DRIFT_DETECTED         ║
║  COVERED: 8  PARTIAL: 1  MISSING: 1 ║
╠══════════════════════════════════════╣
║  Blocking: AC-3 has no implementation║
║  Warning: AC-4 task done, no signal  ║
╚══════════════════════════════════════╝
```

## Step 7 — Recommended actions

- **IN_SYNC**: Proceed to `aura-validate`
- **DRIFT_DETECTED**: Run `aura-tasks --amend <feature>` for MISSING ACs, or `aura-spec-refine` to remove invalid ACs
- **SPEC_BEHIND**: Add new ACs for orphaned impl, or remove orphaned code
