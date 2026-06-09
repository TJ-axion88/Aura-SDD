---
name: aura-discovery
description: Route new work into one of five outcomes. Entry point for all Aura-SDD workflows.
---

# aura-discovery

## Goal

Analyze the user's idea and route it into the most appropriate next action. Detect whether a Constitution exists. Generate `brief.md` and optionally `roadmap.md`.

## Inputs

`/aura-discovery <idea>` — route an idea into the correct workflow  
`/aura-discovery --from-git` — auto-generate a brief from uncommitted git changes  
`/aura-discovery --from-git [base-branch]` — diff against a specific base (default: main/master)

## Execution Workflow

### Step 0 — --from-git mode (Aura-SDD unique)

If invoked with `--from-git`:

1. Run `git diff --name-only HEAD` (or `git diff --name-only <base>..HEAD` if base provided)
2. Run `git diff --stat HEAD` for a summary of changed lines per file
3. Group changed files by top-level directory/module:
   ```
   src/workflow/     5 files (+320, -45 lines)
   src/cli/          2 files (+50, -12 lines)
   templates/        8 files (+180, -0 lines)
   test/             3 files (+120, -15 lines)
   ```
4. Read any changed `spec.md` or `plan.md` files to understand intent
5. Synthesize a `brief.md` automatically:
   - **Problem**: infer from file distribution (e.g., "workflow engine modified extensively")
   - **Scope**: derived from changed directories
   - **Boundary Candidates**: each changed module is a candidate
6. Ask the user: "This brief was auto-generated from your git diff. Does it accurately describe your intent? [y/edit/n]"
7. If approved, proceed to Step 4 (route). If edit, allow manual correction then proceed.

### Step 1 — Load project context

Read in order (skip if absent):
- `.aura/constitution.md` — project principles
- `.aura/steering/*.md` — project memory
- `.aura/specs/*/spec.json` — existing specs (scan status field)

### Step 2 — Constitution check

If `.aura/constitution.md` does NOT exist:
> ⚠️ No Constitution found. Strongly recommend running `/aura-constitution` first to establish project principles. Continue anyway? [y/N]

### Step 3 — Analyze scope

Identify **Boundary Candidates** — the likely seams between components, services, or modules the idea touches.

### Step 4 — Route into one of five outcomes

| Route | Trigger | Action |
|-------|---------|--------|
| **A. Extend existing spec** | Idea fits cleanly inside an active spec's boundary | Suggest `open .aura/specs/<feature>/spec.md` and amend |
| **B. No spec needed** | Tiny isolated change (< 1 hour, 1 file) | Implement directly; optionally log in nearest steering doc |
| **C. Single spec** | Clear single feature boundary | Generate `brief.md` → suggest `/aura-spec` |
| **D. Multi-spec** | Initiative spans 2+ distinct boundaries | Generate `brief.md` + `roadmap.md` → suggest `/aura-spec-batch` equivalent or sequential `/aura-spec` per feature |
| **E. Mixed** | Core feature + orthogonal concerns (e.g., auth refactor + logging) | Decompose, create one spec per concern |

### Step 5 — Write artifacts

**`brief.md`** (always for routes C, D, E):
```markdown
# Brief: <feature title>

## Problem
<what is broken or missing>

## Proposed approach
<one paragraph summary>

## Scope
<what is IN scope>

## Out of scope
<what is explicitly excluded>

## Boundary Candidates
- <component or service A>
- <component or service B>

## Constraints
<technical, legal, timeline constraints if known>

## Open questions
- [ ] <question 1>
```

**`roadmap.md`** (for route D only):
```markdown
# Roadmap: <initiative title>

## Specs (dependency order)
1. `<feature-1>` — <one line description> [_Depends:_ none]
2. `<feature-2>` — <one line description> [_Depends:_ feature-1]
3. `<feature-3>` — <one line description> [_Depends:_ feature-1]
```

Save to `.aura/discovery/brief.md` (and `roadmap.md`).

### Step 6 — Present and recommend

Show the routing decision and the generated artifacts. Suggest the next command clearly.

## Completion Criteria

- Route decision stated with rationale
- `brief.md` written (if applicable)
- `roadmap.md` written (if multi-spec)
- Next command explicitly recommended
