**English** | [日本語](README.ja.md)

# Aura-SDD v3.0

**Spec-Driven Development Framework for AI Coding Agents**

Aura-SDD installs **22 skills, 12-agent support, Constitutional Enforcement, and workflow automation** into your project with a single `npx aura-sdd@latest`. Works with Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, Gemini, OpenCode, Cline, Roo Code, Devin, and more.

---

## Quick Start

```bash
# Claude Code (default)
npx aura-sdd@latest

# Cursor IDE
npx aura-sdd@latest --cursor

# Cline
npx aura-sdd@latest --cline

# Amazon Kiro (co-exists with existing .kiro/specs/)
npx aura-sdd@latest --kiro

# Preview only — no files written
npx aura-sdd@latest --dry-run

# Lean profile (no Discovery/Planning phase)
npx aura-sdd@latest --profile lean
```

---

## What Gets Installed

```
.claude/skills/          ← 22 AI skills (Claude Code)
CLAUDE.md                ← Quick-start guide
.aura/
  settings/rules/        ← 10 AI generation rules
  settings/templates/    ← Document templates
  workflows/definitions/ ← 3 built-in workflows
  presets/               ← lean preset (ready to apply)
```

---

## Skills (22 total)

### Discovery & Steering
| Skill | Purpose |
|-------|---------|
| `/aura-discovery` | Entry point for new work — routes an idea to the right next step |
| `/aura-constitution` | Establish immutable project principles (Constitutional Enforcement) |
| `/aura-steering` | Build and update project memory (product / tech / structure) |
| `/aura-steering-custom` | Create purpose-specific steering docs (API contracts, security, etc.) |

### Specification
| Skill | Purpose |
|-------|---------|
| `/aura-spec` | Write requirements in EARS format |
| `/aura-spec-quick` | Fast mode: spec + tasks in one pass |
| `/aura-spec-batch` | Create multiple specs in parallel from a roadmap |
| `/aura-spec-refine` | Incrementally refine a spec (quick → full) |
| `/aura-spec-status` | Dashboard: progress and health score across all specs |
| `/aura-clarify` | Resolve ambiguous requirements interactively |

### Architecture & Planning
| Skill | Purpose |
|-------|---------|
| `/aura-plan` | Architecture + Boundary Commitments (with Constitutional Gates check) |
| `/aura-tasks` | Decompose an approved plan into tasks (wave structure, dependency graph) |

### Implementation
| Skill | Purpose |
|-------|---------|
| `/aura-impl` | Autonomous TDD implementation (1 task per iteration, subagent trio) |
| `/aura-review` | Independent adversarial code review (12-point checklist) |
| `/aura-debug` | Root-cause-first automated debugging (10 categories, CONFIDENCE rating) |
| `/aura-verify-completion` | Evidence gate before marking complete (reads actual files) |

### Validation
| Skill | Purpose |
|-------|---------|
| `/aura-validate` | Integration validation — GO / NO-GO decision |
| `/aura-validate-gap` | Gap analysis against an existing codebase |
| `/aura-validate-design` | Design review before implementation (10-point check) |
| `/aura-sync` | Detect drift between spec ACs and implementation (DRIFT_DETECTED / IN_SYNC / SPEC_BEHIND) |

### Operations
| Skill | Purpose |
|-------|---------|
| `/aura-workflow` | Run, resume, and manage automated pipelines |
| `/aura-issues` | Export tasks to GitHub Issues |

---

## Workflow Automation

```bash
# Full SDD pipeline (Discovery → Spec → Plan → Tasks → Impl → Validate)
aura-sdd workflow run full-sdd --input feature="photo album"

# TDD pipeline (Spec → RED → GREEN → REFACTOR → Validate)
aura-sdd workflow run tdd --input feature="user authentication"

# Lean pipeline (Spec → Tasks → Impl → Validate, no Discovery)
aura-sdd workflow run lean-sdd --input feature="notification settings"

# Resume an interrupted workflow
aura-sdd workflow resume run-abc123

# List all workflows
aura-sdd workflow list
```

---

## Core Disciplines

| Discipline | Description |
|------------|-------------|
| **Boundary-First** | Declare and commit to file boundaries before any implementation |
| **Constitutional Enforcement** | Project principles codified as Articles; auto-checked as gates during `/aura-plan` |
| **1-task-per-iteration** | Each task runs in a fresh context window (prevents context contamination) |
| **Adversarial Review** | An independent reviewer subagent checks every implementation |
| **EARS format** | `WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL` — verifiable acceptance criteria |
| **aura-sync** | Real-time drift detection between spec ACs and implementation files |

---

## Phase Gates (human approval required)

```
/aura-spec  →  approve spec.md  →  /aura-plan
/aura-plan  →  approve plan.md  →  /aura-tasks
/aura-tasks →  approve tasks.md →  /aura-impl
```

---

## Supported Agents (12, all Stable)

| Agent | Flag | Install location |
|-------|------|-----------------|
| Claude Code | `--claude-code` (default) | `.claude/skills/` |
| Cursor | `--cursor` | `.cursor/rules/aura/` |
| GitHub Copilot | `--copilot` | `.github/prompts/aura/` |
| OpenAI Codex | `--codex` | `.codex/skills/` |
| Windsurf | `--windsurf` | `.windsurf/rules/aura/` |
| Google Gemini | `--gemini` | `.gemini/commands/aura/` |
| OpenCode | `--opencode` | `.opencode/skills/` |
| Antigravity | `--antigravity` | `.antigravity/rules/aura/` |
| Amazon Kiro | `--kiro` | `.kiro/hooks/aura/` |
| Cline | `--cline` | `.clinerules/aura/` |
| Roo Code | `--roo` | `.roo/rules/aura/` |
| Devin | `--devin` | `.devin/skills/` |

---

## Workflow Step Types (9)

`skill` / `shell` / `gate` / `if_then` / `fan_out` / `fan_in` / `switch` / `while_loop` / `do_while`

---

## Options

```
--lang <code>        Language: en, ja, zh, zh-TW, es, pt, de, fr, ru, it, ko, ar, el
--profile <name>     full (default) | lean | minimal
--os <target>        auto (default) | mac | windows | linux
--dry-run            Preview without writing any files
--overwrite <policy> prompt (default) | skip | force
--backup [dir]       Back up existing files before overwriting
--aura-dir <path>    Config directory (default: .aura)
-y, --yes            Skip prompts and auto-approve
-v, --version        Print version
-h, --help           Print help
```

---

## Project Structure (after install)

```
.aura/
├── constitution.md          # Immutable project principles (Constitutional Gates)
├── steering/
│   ├── product.md           # Product goals, constraints, personas
│   ├── tech.md              # Tech stack, architecture decisions
│   ├── structure.md         # Directory layout, naming conventions
│   └── <custom>.md          # Custom steering (/aura-steering-custom)
├── settings/
│   ├── rules/               # 10 AI generation rules
│   └── templates/           # Document templates
├── specs/
│   └── NNN-feature-name/
│       ├── spec.json        # Status and metadata
│       ├── spec.md          # EARS-format requirements
│       ├── plan.md          # Architecture + Boundary Commitments
│       ├── tasks.md         # Task list (wave structure, dependency graph)
│       └── notes.md         # Implementation notes (propagated to next tasks)
├── discovery/
│   ├── brief.md             # Feature brief
│   └── roadmap.md           # Multi-spec roadmap
├── extensions/              # Installed extensions
├── presets/                 # Installed presets (includes lean)
└── workflows/
    ├── definitions/         # Workflow definitions (JSON)
    └── runs/                # Run state (for resume)
```

---

## Presets & Extensions

```bash
# List installed presets
aura-sdd preset list

# Apply lean preset (constitution template + spec template + guide)
aura-sdd preset apply lean

# Install an extension
aura-sdd extension add <id>

# List extensions
aura-sdd extension list
```

---

## Recommended Models

| Use case | Model |
|----------|-------|
| Planning / Review | Claude Opus 4.8 or newer |
| Implementation | Claude Sonnet 4.6 or newer |

---

## License

MIT — see [LICENSE](LICENSE)
