---
name: aura-clarify
description: Structured ambiguity reduction. Resolve [NEEDS CLARIFICATION] markers in spec.md through targeted Q&A.
---

# aura-clarify

## Goal

Identify all `[NEEDS CLARIFICATION]` markers in `.aura/specs/<feature>/spec.md`, ask targeted questions to resolve each one, and update the spec. Gate: do not proceed to `/aura-plan` while any clarification remains open.

## Inputs

Feature name: `/aura-clarify <feature-name>`

## Execution Workflow

### Step 1 — Load spec

Read `.aura/specs/<NNN-feature-name>/spec.md`. If it doesn't exist, suggest `/aura-spec` first.

### Step 2 — Extract markers

Find all `[NEEDS CLARIFICATION]` occurrences. For each one, formulate a single focused question.

Good question form:
- "For Scenario 2: when the user has no active session, should the system redirect to login or show an error modal?"

Bad question form:
- "Can you clarify Scenario 2?" (too vague)
- "What about edge cases?" (too broad)

### Step 3 — Ask and record answers

Ask each question one at a time. Record the answer immediately by updating the spec.

### Step 4 — Validate resolution

After all markers are resolved:
- Re-read spec.md
- Confirm no `[NEEDS CLARIFICATION]` remains
- Verify each scenario still has EARS-format acceptance criteria
- Verify independent testability is stated

### Step 5 — Update spec

Replace each `[NEEDS CLARIFICATION]` with the resolved content. Update `spec.json` `updatedAt`.

### Step 6 — Offer next step

> All clarifications resolved. Ready to proceed to `/aura-plan <feature-name>`.

## Completion Criteria

- Zero `[NEEDS CLARIFICATION]` markers remain in spec.md
- All acceptance criteria use EARS format
- spec.json updatedAt refreshed
