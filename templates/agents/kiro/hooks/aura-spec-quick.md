# aura-spec-quick


# aura-spec-quick

## Goal

Create a complete, implementation-ready spec (requirements + tasks) in a single pass. Skips the separate `/aura-plan` phase. Best for features that are well-understood or small enough that architectural exploration isn't needed.

## Inputs

Accept the feature as inline text: `/aura-spec-quick <feature>` or gather it interactively.

## When to use vs full pipeline

| Signal | Use |
|--------|-----|
| < 1 day of work, well-understood domain | `/aura-spec-quick` |
| Novel architecture, team coordination needed | Full pipeline (`/aura-spec` → `/aura-plan` → `/aura-tasks`) |
| Uncertain scope or cross-team boundaries | Full pipeline |

## Execution Workflow

### Step 1 — Load project context

Read `.aura/constitution.md`, `.aura/steering/*.md`, existing specs in `.aura/specs/`.

### Step 2 — Requirements (EARS format)

Write concise EARS-format requirements. Cover:
- Functional: WHEN/IF/WHILE/WHERE THE SYSTEM SHALL
- Edge cases and error paths
- Acceptance criteria (testable, binary)

### Step 3 — Boundary sketch (lightweight)

Identify the key file/module boundaries without a full `plan.md`. Document in a `## Boundaries` section inside `spec.md`.

### Step 4 — Task list (implementation-ready)

Generate tasks directly — no separate `plan.md`. Each task:
- Has `_Boundary:_` annotation (which files it touches)
- Has `_Depends:_` annotation
- Is sized for RED→GREEN TDD cycle (< 2 hours)
- Is marked `[parallel]` where safe

Write to `.aura/specs/<NNN>-<feature>/tasks.md`.

### Step 5 — Present for approval

Show `spec.md` + `tasks.md`. Ask for human approval before `/aura-impl`.

## Output files

```
.aura/specs/<NNN>-<feature>/
  spec.json     { status: "approved" after human OK }
  spec.md       Requirements + Boundaries section
  tasks.md      Implementation-ready task list
```

## Completion Criteria

- `spec.md` written with EARS requirements and Boundaries section
- `tasks.md` written with annotated tasks
- Human approval obtained (or `-y` flag used)
- Next command: `/aura-impl <feature>`
