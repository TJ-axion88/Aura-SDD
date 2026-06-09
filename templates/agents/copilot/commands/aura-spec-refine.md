# aura-spec-refine

# aura-spec-refine

## Goal

Elevate an existing spec from its current fidelity level to the next. Preserves all human-approved content and only adds what is missing.

```
quick → standard → full
```

| Level | Contents |
|-------|---------|
| `quick` | Problem + 3–5 user stories, no design |
| `standard` | All EARS requirements, boundary candidates, open questions resolved |
| `full` | Requirements + Architecture + Mermaid diagram + Boundary Commitments |

## Inputs

`/aura-spec-refine <feature-name> [--to <level>]`

## Execution Workflow

### Step 1 — Detect current level

Read `.aura/specs/<feature>/spec.json`. Check `fidelity` field. If missing, infer from content depth.

### Step 2 — Block if already at target

Report current and target fidelity. If same, confirm no action needed.

### Step 3 — Gap analysis

Compare current spec against target. List missing sections, incomplete EARS items, unresolved open questions.

### Step 4 — Load context

Read `.aura/constitution.md`, `.aura/steering/*.md`, current `spec.md`, related specs.

### Step 5 — Refine

**Preservation rule**: Do NOT remove or rewrite existing content. Only ADD what is missing.

- `quick → standard`: Expand to full EARS requirements, add boundary candidates, resolve open questions
- `standard → full`: Write `plan.md` with Mermaid diagram, promote boundary candidates to commitments

### Step 6 — Boundary conflict check

Before writing: check if new boundary commitments overlap with other specs. Warn if conflicts detected.

### Step 7 — Write and update fidelity

Update `spec.md` (additive only). Set `spec.json` `fidelity` to new level.

## Completion Criteria

- `spec.md` updated (content only added, never removed)
- `spec.json` `fidelity` field updated
- Boundary conflicts reported if any
- Next command suggested
