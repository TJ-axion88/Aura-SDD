---
name: aura-plan
description: Generate a technical implementation plan with Boundary Commitments and Constitutional Gates. Phase 2 of the Aura-SDD pipeline.
---

# aura-plan

## Goal

Read the approved `spec.md` and produce `.aura/specs/<feature>/plan.md` containing:
- Mermaid architecture diagram
- **Boundary Commitments** (fixed interfaces between components)
- File Structure Plan (exact directory/file layout to be created)
- Constitutional Gate results
- Requirements traceability

Pause for human approval before proceeding to `/aura-tasks`.

## Inputs

Feature name: `/aura-plan <feature-name>`

## Execution Workflow

### Step 1 — Load all context

Read:
- `.aura/constitution.md` (Constitutional Gates)
- `.aura/steering/*.md`
- `.aura/specs/<feature>/spec.md` (must be approved — check `spec.json` approvals.spec)
- Existing codebase structure (relevant directories)

If `spec.json` approvals.spec is null, block:
> ⛔ spec.md has not been approved. Run `/aura-spec <feature>` and get approval first.

### Step 2 — Constitutional Gate check

For each gate defined in `.aura/constitution.md`:
- Evaluate whether the planned approach violates the article
- Record result: PASS / FAIL / N/A

If any gate FAILS:
> ⚠️ Constitutional violation detected: [Article N — description]. This plan cannot proceed without amendment. Options: (1) Revise the approach, (2) Initiate a Constitution amendment via `/aura-spec constitution-amendment`.

### Step 3 — Investigate existing code

Scan relevant directories. Note:
- Existing patterns to follow
- Potential conflicts with new code
- Reusable utilities, types, or modules

### Step 4 — Define Boundary Commitments

For each Boundary Candidate from spec.md, define the **Boundary Commitment** — the exact interface contract:

```markdown
### Boundary: <Name>
_Owner:_ <module or team>
_Consumers:_ <who depends on this>
_Contract:_
  - Input: <type/shape>
  - Output: <type/shape>
  - Side effects: <none | list>
  - Error conditions: <list>
_Stability:_ stable | experimental
```

### Step 5 — Write plan.md

Use template at `.aura/settings/templates/plan.md`. Minimum sections:

```markdown
# Plan: <Feature Name>

## Architecture Overview
<One paragraph summary of approach>

## Constitutional Gate Results
| Gate | Article | Result | Note |
|------|---------|--------|------|
| 1 | Article N — name | PASS | |

## Architecture Diagram
\`\`\`mermaid
graph TD
  ...
\`\`\`

## Boundary Commitments
### Boundary: <Name>
...

## File Structure Plan
\`\`\`
<project root>/
├── src/
│   ├── <new-file>.ts       ← NEW: <purpose>
│   └── <existing-file>.ts  ← MODIFY: <what changes>
└── test/
    └── <new-test>.ts       ← NEW: <what it tests>
\`\`\`

## Component Interfaces
<TypeScript types or API schemas for each boundary>

## Data Models
<Data structures introduced or modified>

## Requirements Traceability
| Requirement ID | Scenario | Addressed by |
|---------------|---------|-------------|
| 1.1 | Scenario 1 AC1 | <file or component> |

## Error Handling
<How errors propagate across boundaries>

## Testing Strategy
<Integration test plan that crosses boundaries>
```

### Step 6 — Human approval gate

Present plan.md summary and ask:
> Review `.aura/specs/<feature>/plan.md`. Approve to proceed to `/aura-tasks`? [y/N/edit]

On approval, update `spec.json` `approvals.plan` and `phase` to "tasks".

## Completion Criteria

- All Constitutional Gates evaluated (no FAIL left unresolved)
- Boundary Commitments defined for all Boundary Candidates
- File Structure Plan lists every file to be created or modified
- Requirements traceability table complete
- Human approval recorded in spec.json
