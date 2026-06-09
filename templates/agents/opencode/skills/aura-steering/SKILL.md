---
name: aura-steering
description: Build or refresh project-wide steering documents — persistent project memory that all skills read.
---

# aura-steering

## Goal

Create or update `.aura/steering/` documents: `product.md`, `tech.md`, `structure.md`. Optionally add custom steering documents. Steering documents are read by every skill and shape AI behavior across all specs.

## Inputs

`/aura-steering` — refresh standard documents  
`/aura-steering <custom-topic>` — create a domain-specific steering document

## Execution Workflow

### Step 1 — Scan codebase

Read (skip if absent):
- `README.md`, `package.json`, `pyproject.toml`, `Cargo.toml` (detect stack)
- Existing `.aura/steering/*.md`
- `.aura/constitution.md`
- Key source directories

### Step 2 — Update product.md

Focus: WHAT the system does, WHO uses it, WHAT value it provides.

```markdown
# Product Steering

## Core Purpose
<One sentence: what the system does>

## Primary Users
<Who uses this and their key goals>

## Key Capabilities
- <capability 1>
- <capability 2>

## Non-goals
<What this system is NOT meant to do>
```

### Step 3 — Update tech.md

Focus: HOW the system is built, technical constraints and standards.

```markdown
# Tech Steering

## Stack
- Runtime: <language + version>
- Framework: <name + version>
- Database: <name + type>
- Testing: <framework>

## Key Standards
- <standard 1: e.g., "All API responses use JSON:API format">
- <standard 2: e.g., "Database access only through repository layer">

## Development Environment
<How to run, test, build>

## Key Decisions
| Decision | Rationale |
|----------|-----------|
| <choice> | <why> |
```

### Step 4 — Update structure.md

Focus: WHERE things live, naming conventions, organizational patterns.

```markdown
# Structure Steering

## Directory Philosophy
<One paragraph: how the project is organized and why>

## Key Directories
- `<dir>/` — <what goes here>

## Naming Conventions
- Files: <pattern>
- Functions: <pattern>
- Types: <pattern>

## Code Principles
- <principle 1>
```

### Step 5 — Custom steering (if topic provided)

Create `.aura/steering/<topic>.md` for domain-specific knowledge:
- Security policies
- API integration patterns
- Domain model glossary
- Deployment procedures

### Step 6 — Confirm

List all updated files and offer to review before saving.

## Completion Criteria

- `product.md`, `tech.md`, `structure.md` updated or created
- Custom steering file created if topic provided
- No factual errors about the actual codebase
