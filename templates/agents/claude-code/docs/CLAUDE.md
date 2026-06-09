# CLAUDE.md — Aura-SDD Project

This project uses **Aura-SDD v{{VERSION}}** — a Spec-Driven Development framework with Boundary-First discipline, Constitutional Enforcement, and autonomous implementation.

## Aura-SDD Skills

Skills are in `.claude/skills/aura-*/`. Invoke with `/aura-*`.

### Workflow overview

```
/aura-constitution       → Establish project principles
/aura-steering           → Build project memory
/aura-discovery <idea>   → Route new work (start here)
/aura-spec <feature>     → Requirements (EARS format)
/aura-clarify <feature>  → Resolve ambiguity
/aura-plan <feature>     → Architecture + Boundary Commitments
/aura-tasks <feature>    → Task decomposition
/aura-impl <feature>     → Autonomous implementation
/aura-validate <feature> → Integration validation (GO/NO-GO)
/aura-issues <feature>   → Convert tasks to GitHub Issues
/aura-workflow run full-sdd --input feature="..." → Automated pipeline
```

## Project structure

```
.aura/
├── constitution.md     # Project principles (Constitutional Gates)
├── steering/           # Product, tech, structure memory
├── settings/
│   ├── rules/          # AI generation rules (10 files)
│   └── templates/      # Document templates
├── specs/
│   └── NNN-feature/    # spec.json, spec.md, plan.md, tasks.md, notes.md
├── extensions/         # Installed extensions
├── presets/            # Installed presets
└── workflows/          # Workflow definitions and run state
```

## Core disciplines

- **Boundary-First**: Every spec identifies boundary contracts before implementation
- **Constitutional Gates**: `/aura-plan` checks all Constitution articles before proceeding
- **1-task-per-iteration**: `/aura-impl` processes one task at a time for context hygiene
- **Adversarial review**: Each task reviewed by an independent subagent (`/aura-review`)
- **EARS format**: All acceptance criteria use WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL

## Phase gates (human approval required)

1. `spec.md` → approved → `/aura-plan`
2. `plan.md` → approved → `/aura-tasks`
3. `tasks.md` → approved → `/aura-impl`

## If there is a 10% chance a skill applies, invoke it

When uncertain whether to invoke an Aura skill, invoke it. The cost of skipping a spec is higher than the cost of a lightweight discovery.

## Recommended models

- Planning/review: Claude Opus 4.8 or newer
- Implementation: Claude Sonnet 4.6 or newer
