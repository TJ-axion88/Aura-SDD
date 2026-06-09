---
name: aura-steering-custom
description: Create a custom steering document for a specific concern (API contracts, security policy, data model, etc.) beyond the default product/tech/structure trinity.
---

# aura-steering-custom

## Goal

Create a purpose-built steering document that guides AI behavior for a specific cross-cutting concern. Goes beyond the default `product.md / tech.md / structure.md` trinity.

## Inputs

`/aura-steering-custom <topic>` — the topic for the custom steering document.

Examples:
- `api-contracts` — REST/GraphQL API conventions
- `security-policy` — auth, authorization, input validation rules
- `data-model` — entity relationships, naming, constraints
- `testing-standards` — what to test, how to name tests, coverage expectations
- `error-handling` — error types, logging format, user-facing messages
- `i18n-policy` — internationalization rules, locale handling

## Execution Workflow

### Step 1 — Clarify scope

If the topic is ambiguous, ask 2-3 targeted questions to understand:
- What AI behavior this document should govern
- What the key invariants or rules are
- What examples of good vs. bad behavior look like

### Step 2 — Load existing steering

Read `.aura/steering/*.md` to avoid duplicating content that already exists.

### Step 3 — Draft the steering document

Structure:

```markdown
# <Topic> Steering

## Purpose
<One paragraph: what AI behavior this governs>

## Rules
<Numbered list of specific, enforceable rules>
1. ...
2. ...

## Examples

### Good
<concrete example>

### Avoid
<concrete example of what to NOT do, with explanation>

## Invariants
<things that must NEVER change, even under pressure>

## When this applies
<specific contexts where these rules activate>
```

### Step 4 — Write to steering directory

Save to `.aura/steering/<topic>.md`.

### Step 5 — Register in project memory

Append a one-line summary to `.aura/steering/product.md` or `tech.md` under a `## Custom Steering` section, so all skills know this document exists.

## Completion Criteria

- Document written to `.aura/steering/<topic>.md`
- Document has at least: Purpose, Rules, and one Good/Avoid example pair
- Reference added to existing steering index
