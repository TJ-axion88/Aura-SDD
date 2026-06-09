---
name: aura-discovery
description: Route new work into one of five outcomes. Entry point for all Aura-SDD workflows.
---

# aura-discovery

## Goal

Analyze the user's idea and route it into the most appropriate next action. Detect whether a Constitution exists. Generate `brief.md` and optionally `roadmap.md`.

## Inputs

Accept the idea as inline text: `/aura-discovery <idea>` or gather it interactively.

## Execution Workflow

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
