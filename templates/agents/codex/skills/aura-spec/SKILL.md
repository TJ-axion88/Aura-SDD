---
name: aura-spec
description: Create a feature specification — EARS-format requirements merged with user scenarios. Phase 1 of the Aura-SDD pipeline.
---

# aura-spec

## Goal

Generate `.aura/specs/<NNN-feature-name>/spec.md` with EARS-format requirements, user scenarios, and explicit `[NEEDS CLARIFICATION]` markers. Pause for human approval before proceeding.

## Inputs

Accept feature name inline: `aura-spec <feature-name>` or read from `.aura/discovery/brief.md` if it exists.

## Execution Workflow

### Step 1 — Load context

Read (skip if absent):
- `.aura/constitution.md`
- `.aura/steering/*.md`
- `.aura/discovery/brief.md`
- Relevant existing code files

### Step 2 — Assign spec number

Scan `.aura/specs/` for existing specs. Assign next sequential NNN (e.g., `001`, `002`). Create directory `.aura/specs/<NNN-feature-name>/`.

### Step 3 — Write spec.json

```json
{
  "feature": "<name>",
  "number": "001",
  "lang": "{{LANG}}",
  "phase": "spec",
  "approvals": {
    "spec": null,
    "plan": null,
    "tasks": null
  },
  "createdAt": "<ISO date>",
  "updatedAt": "<ISO date>"
}
```

### Step 4 — Gather information

If `brief.md` is missing, ask:
1. What problem does this solve?
2. Who are the primary users?
3. What is the success condition?
4. What is explicitly out of scope?

Mark anything unanswered as `[NEEDS CLARIFICATION]`.

### Step 5 — Generate spec.md

Use the template at `.aura/settings/templates/spec.md` (or built-in default below).

**Built-in spec.md structure:**

```markdown
# Spec: <Feature Name>

## Introduction
<One paragraph: what this feature does, for whom, and why it matters.>

## Boundary Candidates
- <component or interface A>
- <component or interface B>

## User Scenarios

### Scenario 1 — <Name> (Priority: P1)
**As a** <role>,
**I want to** <action>,
**so that** <outcome>.

**Acceptance Criteria** (EARS format):
- WHEN <trigger>, THE SYSTEM SHALL <response>.
- IF <condition>, THE SYSTEM SHALL <response>.
- WHILE <state>, THE SYSTEM SHALL <response>.

**Independent testability:** <How this can be tested in isolation>

### Scenario 2 — <Name> (Priority: P2)
...

## Out of Scope
- <explicit exclusion 1>

## Open Questions
- [ ] [NEEDS CLARIFICATION] <question>

## Review Checklist
- [ ] Every scenario is independently testable
- [ ] No scenario contains [NEEDS CLARIFICATION]
- [ ] Acceptance criteria use EARS format throughout
- [ ] Boundary Candidates listed
```

### Step 6 — Human approval gate

Present spec.md and ask:
> Review `.aura/specs/<NNN-feature-name>/spec.md`. Approve to proceed to `aura-plan`? [y/N/edit]

On approval, update `spec.json` `approvals.spec` to current ISO timestamp.

## Completion Criteria

- `spec.json` created with phase = "spec"
- `spec.md` written with EARS-format acceptance criteria
- No unresolved `[NEEDS CLARIFICATION]` markers (or human acknowledged them)
- Human approval recorded in `spec.json`
