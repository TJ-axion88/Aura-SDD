# GitHub Copilot — Aura-SDD v{{VERSION}}

This project uses Aura-SDD for Spec-Driven Development. Prompts are in `.github/prompts/aura/`.

## Aura-SDD Workflow

1. `/aura-constitution` — Project principles
2. `/aura-steering` — Project memory
3. `/aura-discovery <idea>` — Route new work (start here)
4. `/aura-spec <feature>` — EARS-format requirements
5. `/aura-clarify <feature>` — Resolve ambiguity
6. `/aura-plan <feature>` — Architecture + Boundary Commitments
7. `/aura-tasks <feature>` — Task decomposition
8. `/aura-impl <feature>` — Autonomous implementation
9. `/aura-validate <feature>` — GO/NO-GO validation

## Disciplines

- Boundary-First: Identify boundaries before implementation
- Constitutional Gates: Check `.aura/constitution.md` during planning
- EARS format: All acceptance criteria use WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL
- 1-task-per-iteration: Context hygiene during autonomous implementation
