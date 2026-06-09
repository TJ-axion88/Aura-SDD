---
name: aura-constitution
description: "Aura-SDD: Establish or update the project Constitution — immutable principles with versioning and amendment process."
mode: agent
---

Create or update `.aura/constitution.md`, which defines the project's architectural principles. Principles act as Constitutional Gates during `/aura-plan` and `/aura-tasks`.

1. **Scan existing codebase** — identify: primary language(s)/runtime(s), frameworks, test approach, architectural patterns, infrastructure/deployment patterns.

2. **Check existing Constitution** — if `.aura/constitution.md` exists, display current version and articles. Ask: "Add articles, amend existing, or replace? [add/amend/replace]". For amendments, require explicit rationale (logged in amendment history).

3. **Draft Constitution articles** — aim for 5–9 articles. Each article must be:
   - Specific enough to be checkable ("prefer X over Y" not "write good code")
   - Stable enough to remain valid for months
   - Enforceable as a gate during planning

   Use this structure:
   ```
   # Constitution: <Project Name>
   Version: 1.0 | Date: <YYYY-MM-DD>

   ## Preamble
   <One paragraph: project type, scale, primary users>

   ## Articles
   ### Article 1 — <Principle Name>
   <One clear, specific, checkable statement.>
   _Rationale:_ <Why this matters for this project>

   ## Amendment Process
   1. Open a spec with /aura-spec naming the amendment
   2. Include rationale in spec.md
   3. Run /aura-plan which will flag the Constitutional change
   4. Human approval required before implementation

   ## Amendment History
   | Version | Date | Article | Change | Rationale |
   ```

4. **Define Constitutional Gates** — after articles are written, enumerate the gates that `/aura-plan` will check:
   ```
   Gate 1: Does this plan violate Article N?
   ```
   Embed these gates in the Constitution file.

5. **Save** — write to `.aura/constitution.md`. Confirm with the user before writing if articles were amended. Show a summary of all articles and ask for confirmation.

Follow rules in `.aura/settings/rules/` for relevant guidance.
