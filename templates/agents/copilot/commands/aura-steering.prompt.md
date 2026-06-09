---
name: aura-steering
description: "Aura-SDD: Build or refresh project-wide steering documents — persistent project memory read by all skills."
mode: agent
---

Create or update `.aura/steering/` documents: `product.md`, `tech.md`, `structure.md`. Optionally add custom steering documents. Steering documents are read by every skill and shape AI behavior across all specs.

Usage: `/aura-steering` (refresh standard documents) or `/aura-steering <custom-topic>` (create domain-specific steering document)

1. **Scan codebase** — read (skip if absent): `README.md`, `package.json`, `pyproject.toml`, `Cargo.toml` (detect stack), existing `.aura/steering/*.md`, `.aura/constitution.md`, key source directories.

2. **Update product.md** — focus: WHAT the system does, WHO uses it, WHAT value it provides:
   ```
   # Product Steering
   ## Core Purpose
   <One sentence: what the system does>
   ## Primary Users
   <Who uses this and their key goals>
   ## Key Capabilities
   - <capability 1>
   ## Non-goals
   <What this system is NOT meant to do>
   ```

3. **Update tech.md** — focus: HOW the system is built, technical constraints and standards:
   ```
   # Tech Steering
   ## Stack
   - Runtime: <language + version>
   - Framework: <name + version>
   - Database: <name + type>
   - Testing: <framework>
   ## Key Standards
   - <standard 1>
   ## Development Environment
   <How to run, test, build>
   ## Key Decisions
   | Decision | Rationale |
   ```

4. **Update structure.md** — focus: WHERE things live, naming conventions, organizational patterns:
   ```
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

5. **Custom steering** (if topic provided) — create `.aura/steering/<topic>.md` for domain-specific knowledge: security policies, API integration patterns, domain model glossary, deployment procedures, etc.

6. **Confirm** — list all updated files and offer to review before saving.

Follow rules in `.aura/settings/rules/` for relevant guidance.
