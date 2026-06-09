---
name: aura-spec-refine
description: Progressive spec refinement. Iterates a quick/draft spec up to full fidelity without losing existing work. Unique to Aura-SDD.
---

# aura-spec-refine

## Goal

Elevate an existing spec from its current fidelity level to the next. Preserves all human-approved content and only adds what is missing.

```
quick → standard → full
```

| Level | Contents |
|-------|---------|
| `quick` | Problem + 3–5 user stories, no design |
| `standard` | All EARS requirements, boundary candidates, open questions resolved |
| `full` | Requirements + Architecture + Mermaid diagram + Boundary Commitments |

## Inputs

`/aura-spec-refine <feature-name> [--to <level>]`

Default: advance one level. `--to full` jumps directly to full fidelity.

## Execution Workflow

### Step 1 — Detect current level

Read `.aura/specs/<feature>/spec.json`. Check `fidelity` field.

If `fidelity` is missing, infer from content:
- Has `plan.md`? → `full`
- Has `## Requirements` with ≥5 EARS items? → `standard`
- Otherwise → `quick`

### Step 2 — Block if already at target

If `spec.json` shows `fidelity == target`, report:
> ✓ Spec is already at `<level>` fidelity. No refinement needed.

### Step 3 — Identify gaps

Compare current spec against the target level template. List what is **missing or incomplete**:

```
Gap analysis for <feature> (quick → standard):
  [ ] Requirements section has only 2 EARS items (need ≥5)
  [ ] Boundary candidates not defined
  [ ] 3 open questions unresolved: ...
  [ ] No non-functional requirements
```

### Step 4 — Load context

Read in full:
- `.aura/constitution.md`
- `.aura/steering/*.md`
- Existing `spec.md` (to preserve all current content)
- Related specs from `.aura/specs/` (for boundary awareness)

### Step 5 — Refine spec content

**Preservation rule**: Do NOT remove or rewrite any line the human has written. Only ADD content that is missing.

For `quick → standard`:
1. Expand user stories into full EARS-format requirements (WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL)
2. Add boundary candidates (derived from requirements)
3. Resolve open questions (or flag if they require human input)
4. Add non-functional requirements if missing

For `standard → full`:
1. Write `plan.md` with Mermaid architecture diagram
2. Promote boundary candidates → boundary commitments (with interface contracts)
3. Mark `spec.json` `approvals.spec = null` to trigger re-approval flow

### Step 6 — Conflict check

Before writing, check if refined boundary commitments overlap with other specs:

```
⚠️ Boundary conflict detected:
  This spec claims ownership of: src/auth/session.ts
  But spec "002-api-gateway" also declares: src/auth/*
  Resolve before proceeding to /aura-plan.
```

### Step 7 — Write and update fidelity

Overwrite `spec.md` (adding only new content).
Update `spec.json`:
```json
{ "fidelity": "<new-level>", "refinedAt": "<ISO timestamp>" }
```

### Step 8 — Report

```
✓ Spec refined: quick → standard
  Added: 8 EARS requirements
  Added: 4 boundary candidates
  Resolved: 2 open questions
  Flagged for human: 1 open question (needs product decision)

Next: /aura-spec-refine <feature> --to full
  OR: /aura-plan <feature> (spec is at standard fidelity)
```

## Completion Criteria

- `spec.md` updated with new content (nothing removed)
- `spec.json` `fidelity` field updated
- Boundary conflicts reported if detected
- User shown gap summary and next command
