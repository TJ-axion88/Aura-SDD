---
name: aura-constitution
description: Establish or update the project Constitution — immutable principles with versioning and amendment process.
---

# aura-constitution

## Goal

Create or update `.aura/constitution.md`, which defines the project's architectural principles. Principles act as Constitutional Gates during `aura-plan` and `aura-tasks`. Unlike steering documents (mutable guidelines), Constitution articles require an explicit amendment process to change.

## Inputs

- Existing codebase (scan for patterns, tech stack, architectural decisions)
- Existing steering docs if present (`.aura/steering/`)
- User's explicit principles if provided inline

## Execution Workflow

### Step 1 — Scan existing codebase

Identify:
- Primary language(s) and runtime(s)
- Framework(s) in use
- Test approach (unit / integration / e2e)
- Key architectural patterns (REST, event-driven, layered, etc.)
- Infrastructure and deployment patterns

### Step 2 — Check existing Constitution

If `.aura/constitution.md` exists:
- Display current version and articles
- Ask: "Add articles, amend existing, or replace? [add/amend/replace]"
- For amendments, require explicit rationale (logged in amendment history)

### Step 3 — Draft Constitution articles

Use the template below. Aim for 5–9 articles. Each article must be:
- Specific enough to be checkable ("prefer X over Y" not "write good code")
- Stable enough to remain valid for months
- Enforceable as a gate during planning

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
1. Open a spec with `aura-spec` naming the amendment
2. Include rationale in `spec.md`
3. Run `aura-plan` which will flag the Constitutional change
4. Human approval required before implementation

## Amendment History
| Version | Date | Article | Change | Rationale |
|---------|------|---------|--------|-----------|
| 1.0 | <date> | All | Initial | Project inception |
```

### Step 4 — Constitutional Gate definition

After articles are written, enumerate the **Constitutional Gates** — questions that `aura-plan` will check:

```
Gate 1: Does this plan violate Article N?
Gate 2: ...
```

These gates are embedded in the Constitution file for `aura-plan` to read.

### Step 5 — Save

Write to `.aura/constitution.md`. Confirm with the user before writing if articles were amended.

## Completion Criteria

- `.aura/constitution.md` written with version, date, 5–9 articles, and amendment process
- Constitutional Gates section present
- User shown a summary of articles and asked to confirm
