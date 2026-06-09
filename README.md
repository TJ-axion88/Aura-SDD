# Aura-SDD v2.0

**Spec-Driven Development framework for AI coding agents.**

Aura-SDD installs a complete SDD methodology into your project — **20 skills**, **9 agents**, AI generation rules, document templates, and workflow automation — for Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, Gemini, OpenCode, Antigravity, and Amazon Kiro.

## Quick start

```bash
# Claude Code (default, Japanese)
npx aura-sdd@latest --lang ja

# Interactive agent selection (no flag needed)
npx aura-sdd@latest --lang ja

# Cursor IDE
npx aura-sdd@latest --cursor

# Amazon Kiro (compatible with existing .kiro/specs/)
npx aura-sdd@latest --kiro

# Preview without writing
npx aura-sdd@latest --dry-run

# Minimal profile (docs + rules only, no workflows)
npx aura-sdd@latest --profile minimal
```

## What gets installed

```
.claude/skills/          ← 20 AI skills (Claude Code)
CLAUDE.md                ← Project quickstart
.aura/
  settings/rules/        ← 10 AI generation rules
  settings/templates/    ← Document templates
  workflows/definitions/ ← 3 built-in workflows
```

## Skills (20 total)

### Discovery & Steering
| Skill | Purpose |
|-------|---------|
| `/aura-discovery` | Route new work — start here |
| `/aura-constitution` | Establish immutable project principles |
| `/aura-steering` | Build project memory (product/tech/structure) |
| `/aura-steering-custom` | Create purpose-built steering docs (API contracts, security, etc.) **[NEW]** |

### Specification
| Skill | Purpose |
|-------|---------|
| `/aura-spec` | Write EARS-format requirements |
| `/aura-spec-quick` | Fast-track: spec + tasks in one shot **[NEW]** |
| `/aura-spec-batch` | Create multiple specs from roadmap in parallel **[NEW]** |
| `/aura-spec-status` | Track progress across all specs **[NEW]** |
| `/aura-clarify` | Resolve ambiguous requirements |

### Architecture & Planning
| Skill | Purpose |
|-------|---------|
| `/aura-plan` | Architecture + Boundary Commitments |
| `/aura-tasks` | Task decomposition with wave structure |

### Implementation
| Skill | Purpose |
|-------|---------|
| `/aura-impl` | Autonomous TDD implementation (1 task/iteration) |
| `/aura-review` | Adversarial 12-check code review |
| `/aura-debug` | Root-cause-first debugging |
| `/aura-verify-completion` | Fresh-evidence gate before marking done **[NEW]** |

### Validation
| Skill | Purpose |
|-------|---------|
| `/aura-validate` | GO/NO-GO integration check |
| `/aura-validate-gap` | Gap analysis for existing codebases **[NEW]** |
| `/aura-validate-design` | 10-point design review before implementation **[NEW]** |

### Operations
| Skill | Purpose |
|-------|---------|
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
- **Fresh-evidence Gate**: `/aura-verify-completion` reads actual files, never trusts prior claims
- **EARS Format**: `WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL` for all acceptance criteria

## Workflow phases (human approval required)

```
spec.md approved → /aura-plan (optional: /aura-validate-design)
plan.md approved → /aura-tasks
tasks.md approved → /aura-impl
```

## Agents (9 total)

| Agent | Flag | Status |
|-------|------|--------|
| Claude Code | `--claude-code` (default) | ✅ Stable |
| Cursor | `--cursor` | ✅ Stable |
| GitHub Copilot | `--copilot` | ✅ Stable |
| OpenAI Codex | `--codex` | ✅ Stable |
| Windsurf | `--windsurf` | ✅ Stable |
| Google Gemini | `--gemini` | ✅ Stable |
| OpenCode | `--opencode` | ✅ Stable |
| Antigravity | `--antigravity` | 🟡 Beta |
| Amazon Kiro | `--kiro` | 🟡 Beta |

## Options

```
--lang <code>        Language: en, ja, zh, zh-TW, es, pt, de, fr, ru, it, ko, ar, el
--profile <name>     full (default) | lean | minimal
--os <target>        auto (default) | mac | windows | linux
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
├── constitution.md          # Project principles (Constitutional Gates)
├── steering/
│   ├── product.md           # Product goals, constraints, personas
│   ├── tech.md              # Tech stack, architecture decisions
│   ├── structure.md         # Directory layout, naming conventions
│   └── <custom>.md          # Custom steering docs (/aura-steering-custom)
├── settings/
│   ├── rules/               # 10 AI generation rules
│   └── templates/           # Document templates
├── specs/
│   └── NNN-feature-name/
│       ├── spec.json        # Status, metadata
│       ├── spec.md          # EARS requirements
│       ├── plan.md          # Architecture + Boundary Commitments
│       ├── tasks.md         # Annotated task list
│       ├── notes.md         # Implementation Notes (propagated forward)
│       ├── gap-report.md    # Gap analysis (/aura-validate-gap)
│       └── design-review.md # Design review (/aura-validate-design)
├── discovery/
│   ├── brief.md             # Feature brief
│   └── roadmap.md           # Multi-spec roadmap
├── extensions/              # Installed extensions
├── presets/                 # Installed presets
└── workflows/
    ├── definitions/         # Workflow JSON definitions
    └── runs/                # Run state (for resume)
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

## Preset system

```bash
# List installed presets
aura-sdd preset list

# Apply a preset to your project
aura-sdd preset apply <id>

# Remove a preset
aura-sdd preset remove <id>
```

## Recommended models

- Planning/review: Claude Opus 4.8+
- Implementation: Claude Sonnet 4.6+

## License

MIT
