---
description: "Aura-SDD: Generate a technical implementation plan with Boundary Commitments and Constitutional Gates. Phase 2 of the SDD pipeline."
---

# aura-plan

Read the approved `spec.md` and produce `.aura/specs/<feature>/plan.md` containing a Mermaid architecture diagram, Boundary Commitments, File Structure Plan, Constitutional Gate results, and requirements traceability. Pause for human approval before proceeding to `/aura-tasks`.

**Usage:** `/aura-plan <feature-name>`

1. **Load all context** — read `.aura/constitution.md`, `.aura/steering/*.md`, `.aura/specs/<feature>/spec.md` (must be approved — check `spec.json` approvals.spec), and relevant codebase directories. If `spec.json` approvals.spec is null, block: "spec.md has not been approved. Run `/aura-spec <feature>` and get approval first."

2. **Constitutional Gate check** — for each gate defined in `.aura/constitution.md`, evaluate whether the planned approach violates the article and record result: PASS / FAIL / N/A. If any gate FAILS, block: "Constitutional violation detected: [Article N]. Options: (1) Revise the approach, (2) Initiate a Constitution amendment via `/aura-spec constitution-amendment`."

3. **Investigate existing code** — scan relevant directories. Note existing patterns to follow, potential conflicts, and reusable utilities or modules.

4. **Define Boundary Commitments** — for each Boundary Candidate from spec.md:
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

5. **Write plan.md** with these minimum sections:
   ```markdown
   # Plan: <Feature Name>

   ## Architecture Overview
   <One paragraph summary of approach>

   ## Constitutional Gate Results
   | Gate | Article | Result | Note |
   |------|---------|--------|------|

   ## Architecture Diagram
   ```mermaid
   graph TD
     ...
   ```

   ## Boundary Commitments
   ### Boundary: <Name>
   ...

   ## File Structure Plan
   ```
   <project root>/
   ├── src/
   │   ├── <new-file>.ts       ← NEW: <purpose>
   │   └── <existing-file>.ts  ← MODIFY: <what changes>
   └── test/
       └── <new-test>.ts       ← NEW: <what it tests>
   ```

   ## Component Interfaces
   <TypeScript types or API schemas for each boundary>

   ## Data Models
   <Data structures introduced or modified>

   ## Requirements Traceability
   | Requirement ID | Scenario | Addressed by |
   |---------------|---------|-------------|

   ## Error Handling
   <How errors propagate across boundaries>

   ## Testing Strategy
   <Integration test plan that crosses boundaries>
   ```

6. **Human approval gate** — present plan.md summary and ask: "Review `.aura/specs/<feature>/plan.md`. Approve to proceed to `/aura-tasks`? [y/N/edit]". On approval, update `spec.json` `approvals.plan` and `phase` to "tasks".

**Completion criteria:** All Constitutional Gates evaluated (no FAIL left unresolved), Boundary Commitments defined for all Boundary Candidates, File Structure Plan lists every file to be created or modified, requirements traceability table complete, human approval recorded.

Read `.aura/settings/rules/` for relevant rules.
