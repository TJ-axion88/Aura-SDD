# Aura-SDD

**Spec-Driven Development framework for AI coding agents.**

Aura-SDD installs a complete SDD methodology into your project — 13 skills, AI generation rules, document templates, and workflow automation — for Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, and Gemini.

## Quick start

```bash
# Claude Code (default, Japanese)
npx aura-sdd@latest --lang ja

# Cursor IDE
npx aura-sdd@latest --cursor

# Preview without writing
npx aura-sdd@latest --dry-run

# Lean profile (solo developer)
npx aura-sdd@latest --profile lean
```

## What gets installed

```
.claude/skills/          ← 13 AI skills (Claude Code)
CLAUDE.md                ← Project quickstart
.aura/
  settings/rules/        ← 10 AI generation rules
  settings/templates/    ← Document templates
  workflows/definitions/ ← 3 built-in workflows
```

## Skills

| Skill | Purpose |
|-------|---------|
| `/aura-discovery` | Route new work — start here |
| `/aura-constitution` | Establish immutable project principles |
| `/aura-spec` | Write EARS-format requirements |
| `/aura-clarify` | Resolve ambiguous requirements |
| `/aura-plan` | Architecture + boundary design |
| `/aura-tasks` | Task decomposition with wave structure |
| `/aura-impl` | Autonomous TDD implementation |
| `/aura-validate` | GO/NO-GO integration check |
| `/aura-review` | Adversarial 12-check code review |
| `/aura-debug` | Root-cause-first debugging |
| `/aura-steering` | Project memory management |
| `/aura-workflow` | Run/resume automated pipelines |
| `/aura-issues` | Export tasks to GitHub Issues |

## Workflows

```bash
# Full SDD pipeline (discovery → spec → plan → tasks → impl → validate)
aura-sdd workflow run full-sdd --input feature="写真アルバム機能"

# TDD pipeline (spec-first → RED→GREEN→REFACTOR → validate)
aura-sdd workflow run tdd --input feature="ユーザー認証"

# Lean pipeline (spec → tasks → impl → validate, no planning phase)
aura-sdd workflow run lean-sdd --input feature="通知設定"

# Resume a paused workflow
aura-sdd workflow resume run-abc123
```

## Core disciplines

- **Boundary-First**: Identify and commit to architectural boundaries before implementation
- **Constitutional Enforcement**: Immutable project principles, checked as gates during planning
- **1-task-per-iteration**: Each task runs in a fresh agent context for hygiene
- **Adversarial Review**: Independent reviewer checks every implementation
- **EARS Format**: `WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL` for all acceptance criteria

## Workflow phases (human approval required)

```
spec.md approved → /aura-plan
plan.md approved → /aura-tasks
tasks.md approved → /aura-impl
```

## Agents

| Agent | Flag | Status |
|-------|------|--------|
| Claude Code | `--claude-code` (default) | ✅ Stable |
| Cursor | `--cursor` | ✅ Stable |
| GitHub Copilot | `--copilot` | ✅ Stable |
| OpenAI Codex | `--codex` | ✅ Stable |
| Windsurf | `--windsurf` | ✅ Stable |
| Google Gemini | `--gemini` | ✅ Stable |

## Options

```
--lang <code>        Language: en, ja, zh, zh-TW, es, pt, de, fr, ru, it, ko, ar, el
--profile <name>     full (default) | lean
--dry-run            Preview without writing
--overwrite <policy> prompt (default) | skip | force
--backup [dir]       Backup existing files
--aura-dir <path>    Config directory (default: .aura)
-y, --yes            Auto-confirm all prompts
-v, --version        Print version
-h, --help           Print help
```

## Project structure (created in your project)

```
.aura/
├── constitution.md          # Project principles
├── steering/
│   ├── product.md
│   ├── tech.md
│   └── structure.md
├── settings/
│   ├── rules/               # 10 AI generation rules
│   └── templates/           # Document templates
├── specs/
│   └── 001-feature-name/
│       ├── spec.json
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── notes.md
├── extensions/
├── presets/
└── workflows/
    ├── definitions/          # Workflow YAML/JSON
    └── runs/                 # Run state (for resume)
```

## Extension system

```bash
# Install a community extension
aura-sdd extension add <id>

# List installed extensions
aura-sdd extension list

# Remove an extension
aura-sdd extension remove <id>
```

Extensions auto-register their skills into your agent's command directory on install, and deregister on removal.

## Recommended models

- Planning/review: Claude Opus 4.8+
- Implementation: Claude Sonnet 4.6+

## License

MIT
