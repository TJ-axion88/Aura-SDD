# Aura-SDD v{{VERSION}} — Amazon Kiro

Spec-Driven Development framework. Hooks are in `.kiro/hooks/aura/`.
Existing `.kiro/specs/` remain compatible — Aura adds Constitutional Enforcement,
Workflow automation, and Extension ecosystem on top.

## Workflow

| Step | Hook |
|------|------|
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

## Compatibility

- `.kiro/specs/` — existing Kiro specs are preserved and portable
- `.aura/` — Aura-SDD adds settings, rules, templates, and workflows

## Recommended models

- Planning/review: Claude Sonnet 4.5+ (Kiro built-in)
- Implementation: Claude Sonnet 4.5+
