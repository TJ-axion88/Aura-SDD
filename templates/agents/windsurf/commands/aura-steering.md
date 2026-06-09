---
trigger: manual
description: "Aura-SDD: Build or refresh project-wide steering documents — persistent project memory that all skills read."
---

# aura-steering

Create or update `.aura/steering/` documents: `product.md`, `tech.md`, `structure.md`. Optionally add custom steering documents. Steering documents are read by every skill and shape AI behavior across all specs.

**Usage:** `/aura-steering` (refresh standard documents) or `/aura-steering <custom-topic>` (create a domain-specific steering document)

1. **Scan codebase** — read `README.md`, `package.json`, `pyproject.toml`, `Cargo.toml` (detect stack), existing `.aura/steering/*.md`, `.aura/constitution.md`, and key source directories (skip if absent).

2. **Update product.md** — focus: WHAT the system does, WHO uses it, WHAT value it provides:
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

3. **Update tech.md** — focus: HOW the system is built, technical constraints and standards:
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

4. **Update structure.md** — focus: WHERE things live, naming conventions, organizational patterns:
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

5. **Custom steering (if topic provided)** — create `.aura/steering/<topic>.md` for domain-specific knowledge: security policies, API integration patterns, domain model glossary, deployment procedures, etc.

6. **Confirm** — list all updated files and offer to review before saving.

**Completion criteria:** `product.md`, `tech.md`, `structure.md` updated or created; custom steering file created if topic provided; no factual errors about the actual codebase.

Follow rules in `.aura/settings/rules/`.
