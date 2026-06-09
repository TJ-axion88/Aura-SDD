---
trigger: manual
description: "Aura-SDD: Establish or update the project Constitution — immutable principles with versioning and amendment process."
---

# aura-constitution

Create or update `.aura/constitution.md`, which defines the project's architectural principles. Articles act as Constitutional Gates during `/aura-plan` and `/aura-tasks`. Unlike steering documents, Constitution articles require an explicit amendment process to change.

1. **Scan codebase** — identify primary language(s), frameworks, test approach, architectural patterns, and deployment patterns.
2. **Check existing Constitution** — if `.aura/constitution.md` exists, display current version and articles, then ask: "Add articles, amend existing, or replace? [add/amend/replace]". For amendments, require explicit rationale (logged in amendment history).
3. **Draft Constitution articles** — aim for 5–9 articles. Each must be specific enough to be checkable, stable enough to remain valid for months, and enforceable as a planning gate.

   Use this template:
   ```markdown
   # Constitution: <Project Name>
   Version: 1.0
   Date: <YYYY-MM-DD>

   ## Preamble
   <One paragraph: project type, scale, primary users>

   ## Articles

   ### Article 1 — <Principle Name>
   <One clear, specific, checkable statement.>
   _Rationale:_ <Why this matters for this project>

   ### Article 2 — <Principle Name>
   ...

   ## Amendment Process
   To amend a Constitution article:
   1. Open a spec with `/aura-spec` naming the amendment
   2. Include rationale in `spec.md`
   3. Run `/aura-plan` which will flag the Constitutional change
   4. Human approval required before implementation

   ## Amendment History
   | Version | Date | Article | Change | Rationale |
   |---------|------|---------|--------|-----------|
   | 1.0 | <date> | All | Initial | Project inception |
   ```

4. **Define Constitutional Gates** — after articles are written, enumerate the gates that `/aura-plan` will check:
   ```
   Gate 1: Does this plan violate Article N?
   Gate 2: ...
   ```
   Embed these gates in the Constitution file.

5. **Save** — write to `.aura/constitution.md`. Confirm with the user before writing if articles were amended.

**Completion criteria:** `.aura/constitution.md` written with version, date, 5–9 articles, Constitutional Gates section, and amendment process. User shown a summary and asked to confirm.

Follow rules in `.aura/settings/rules/`.
