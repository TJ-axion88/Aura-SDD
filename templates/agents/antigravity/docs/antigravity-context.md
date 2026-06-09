# Aura-SDD v{{VERSION}} — Antigravity

Spec-Driven Development framework. Rules are in `.antigravity/rules/aura/`.

## Workflow

| Step | Command |
|------|---------|
| Principles | `aura-constitution` |
| Memory | `aura-steering` |
| Discover | `aura-discovery <idea>` |
| Spec | `aura-spec <feature>` |
| Fast-track | `aura-spec-quick <feature>` |
| Multi-spec | `aura-spec-batch` |
| Plan | `aura-plan <feature>` |
| Tasks | `aura-tasks <feature>` |
| Implement | `aura-impl <feature>` |
| Validate | `aura-validate <feature>` |
| Gap check | `aura-validate-gap <feature>` |
| Design review | `aura-validate-design <feature>` |
| Completion | `aura-verify-completion` |

## Phase gates (human approval required)

spec.md → aura-plan → plan.md → aura-tasks → tasks.md → aura-impl

## Recommended models

- Planning/review: Claude Opus 4.8+
- Implementation: Claude Sonnet 4.6+
