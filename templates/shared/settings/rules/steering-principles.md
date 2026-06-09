# Steering Document Principles

Rules for creating and maintaining `.aura/steering/` documents.

## Purpose

Steering documents are **persistent project memory** that every skill reads at the start of each session. They prevent skills from re-discovering facts about the project that are already known.

## The three standard documents

| File | Focus | Update frequency |
|------|-------|-----------------|
| `product.md` | WHAT the system does, for WHOM | Quarterly or on major pivot |
| `tech.md` | HOW it's built, tech standards | When stack or standards change |
| `structure.md` | WHERE things live, naming patterns | When org or conventions change |

## Content rules

### product.md
- Describe what the system does in one sentence
- List primary users and their goals
- Enumerate key capabilities (not implementation details)
- List explicit non-goals

### tech.md
- Include the actual stack (language, framework, DB, test runner)
- Key architectural decisions with rationale
- Development workflow (how to run tests, build, deploy)
- Standards that apply globally (API format, auth pattern, error format)

### structure.md
- Directory layout philosophy (not every directory — just the organizing principle)
- Naming conventions for files, functions, types
- Code principles (e.g., "prefer functions over classes", "one export per file")

## Custom steering documents

Create `.aura/steering/<topic>.md` for:
- Security policies (when security is a major concern)
- Integration patterns (when many external APIs are used)
- Domain model glossary (for complex business domains)
- Performance constraints (when performance is a primary constraint)

## What NOT to put in steering

- Temporary decisions (put in spec.md or task notes instead)
- Implementation details that belong in code comments
- Information derivable from reading the code
- Outdated information — delete it, don't archive it

## Quality check for steering

Before saving a steering document, verify:
- [ ] No contradictions with `.aura/constitution.md`
- [ ] No stale information (tech stack is current)
- [ ] Focused on the right scope (product vs tech vs structure)
- [ ] Short enough to be read in 2 minutes
