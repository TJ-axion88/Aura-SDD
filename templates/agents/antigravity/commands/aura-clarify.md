---
description: "Aura-SDD: Structured ambiguity reduction — resolve [NEEDS CLARIFICATION] markers in spec.md through targeted Q&A."
---

# aura-clarify

Identify all `[NEEDS CLARIFICATION]` markers in `.aura/specs/<feature>/spec.md`, ask targeted questions to resolve each one, and update the spec. Gate: do not proceed to `/aura-plan` while any clarification remains open.

**Usage:** `/aura-clarify <feature-name>`

1. **Load spec** — read `.aura/specs/<NNN-feature-name>/spec.md`. If it doesn't exist, suggest `/aura-spec` first.
2. **Extract markers** — find all `[NEEDS CLARIFICATION]` occurrences. For each one, formulate a single focused question.

   Good question form: "For Scenario 2: when the user has no active session, should the system redirect to login or show an error modal?"

   Bad question form: "Can you clarify Scenario 2?" (too vague) or "What about edge cases?" (too broad)

3. **Ask and record answers** — ask each question one at a time. Record the answer immediately by updating the spec.
4. **Validate resolution** — after all markers are resolved:
   - Re-read spec.md
   - Confirm no `[NEEDS CLARIFICATION]` remains
   - Verify each scenario still has EARS-format acceptance criteria
   - Verify independent testability is stated
5. **Update spec** — replace each `[NEEDS CLARIFICATION]` with the resolved content. Update `spec.json` `updatedAt`.
6. **Offer next step** — "All clarifications resolved. Ready to proceed to `/aura-plan <feature-name>`."

**Completion criteria:** Zero `[NEEDS CLARIFICATION]` markers remain in spec.md, all acceptance criteria use EARS format, `spec.json` `updatedAt` refreshed.

Read `.aura/settings/rules/` for relevant rules.
