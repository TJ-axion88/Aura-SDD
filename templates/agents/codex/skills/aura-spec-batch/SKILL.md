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

### Step 4 — Cross-spec review

After all waves complete, run a single cross-spec review pass:

Check for:
- **Contradictions**: conflicting requirements between specs
- **Duplicated responsibilities**: same behavior owned by two specs
- **Interface mismatches**: spec A expects an API that spec B doesn't provide
- **Missing dependencies**: spec references a boundary not owned by any spec

Output a `cross-spec-review.md` in `.aura/discovery/`.

### Step 5 — Present results

List all created specs with status and any cross-spec issues found.
Prompt human to review `cross-spec-review.md` before approving specs for planning.

## Completion Criteria

- One `spec.md` per roadmap entry written
- `cross-spec-review.md` written
- Any blocking issues clearly flagged
- Next command: `/aura-plan <feature>` for each approved spec
