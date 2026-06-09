---
trigger: manual
description: "Aura-SDD: Create a feature specification with EARS-format requirements and user scenarios. Phase 1 of the SDD pipeline."
---

# aura-spec

Generate `.aura/specs/<NNN-feature-name>/spec.md` with EARS-format requirements, user scenarios, and explicit `[NEEDS CLARIFICATION]` markers. Pause for human approval before proceeding.

**Usage:** `/aura-spec <feature-name>` or read from `.aura/discovery/brief.md` if it exists.

1. **Load context** — read `.aura/constitution.md`, `.aura/steering/*.md`, `.aura/discovery/brief.md`, and relevant existing code files (skip if absent).
2. **Assign spec number** — scan `.aura/specs/` for existing specs, assign next sequential NNN (e.g., `001`, `002`), create directory `.aura/specs/<NNN-feature-name>/`.
3. **Write spec.json**:
   ```json
   {
     "feature": "<name>",
     "number": "001",
     "lang": "{{LANG}}",
     "phase": "spec",
     "approvals": { "spec": null, "plan": null, "tasks": null },
     "createdAt": "<ISO date>",
     "updatedAt": "<ISO date>"
   }
   ```
4. **Gather information** — if `brief.md` is missing, ask: (1) What problem does this solve? (2) Who are the primary users? (3) What is the success condition? (4) What is explicitly out of scope? Mark anything unanswered as `[NEEDS CLARIFICATION]`.
5. **Generate spec.md** using this structure:
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
6. **Human approval gate** — present spec.md and ask: "Review `.aura/specs/<NNN-feature-name>/spec.md`. Approve to proceed to `/aura-plan`? [y/N/edit]". On approval, update `spec.json` `approvals.spec` to current ISO timestamp.

**Completion criteria:** `spec.json` created, `spec.md` written with EARS-format acceptance criteria, no unresolved `[NEEDS CLARIFICATION]` markers (or human acknowledged them), human approval recorded.

Follow rules in `.aura/settings/rules/`.
