# Aura-SDD v{{VERSION}} — OpenCode

Spec-Driven Development framework. Skills are in `.opencode/skills/aura-*/`.

## Workflow

```
/aura-constitution       → Establish project principles
/aura-steering           → Build project memory
/aura-discovery <idea>   → Route new work (start here)
/aura-spec <feature>     → Requirements (EARS format)
/aura-spec-quick <f>     → Fast-track spec + tasks
/aura-spec-batch         → Multi-spec from roadmap
/aura-clarify <feature>  → Resolve ambiguity
/aura-plan <feature>     → Architecture + Boundary Commitments
/aura-tasks <feature>    → Task decomposition
/aura-impl <feature>     → Autonomous TDD implementation
/aura-validate <feature> → GO/NO-GO integration check
/aura-validate-gap <f>   → Gap analysis for existing code
/aura-validate-design <f>→ Design review
/aura-verify-completion  → Fresh-evidence gate
/aura-issues <feature>   → Export tasks to GitHub Issues
/aura-workflow run full-sdd --input feature="..." → Full pipeline
```

## Phase gates (human approval required)

spec.md → /aura-plan → plan.md → /aura-tasks → tasks.md → /aura-impl

## Recommended models

- Planning/review: Claude Opus 4.8+
- Implementation: Claude Sonnet 4.6+
