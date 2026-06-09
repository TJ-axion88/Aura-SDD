# Constitution Enforcement Rules

The Constitution (`.aura/constitution.md`) defines immutable project principles. Every planning phase MUST check Constitutional Gates.

## When to enforce

| Skill | Enforcement action |
|-------|--------------------|
| `/aura-plan` | Run all Constitutional Gates; BLOCK on any FAIL |
| `/aura-tasks` | Verify task list doesn't introduce violations |
| `/aura-review` | Check 12: Constitutional compliance |
| `/aura-validate` | Re-verify full Constitutional compliance |

## Gate evaluation rules

For each gate defined in the Constitution:

1. **Read the gate question** from the Constitutional Gates section
2. **Evaluate against the current plan/implementation**
3. **Record the verdict**: PASS / FAIL / N/A
4. If **FAIL**:
   - STOP immediately
   - Explain which article is violated
   - Offer options: revise approach OR initiate amendment

## Amendment initiation

If a legitimate need to change a Constitution article is discovered:
1. Do NOT silently deviate from the article
2. Raise the conflict explicitly
3. Create an amendment spec using `/aura-spec constitution-amendment-<article-N>`
4. The amendment spec follows normal approval flow
5. Constitution is updated only after human approval of the amendment spec

## Common violations to detect

- New abstraction layers when Constitution mandates "library-first" or "anti-abstraction"
- Direct database access when Constitution mandates "repository layer only"
- Non-tested code when Constitution mandates "test-first"
- New external dependencies when Constitution mandates "zero new dependencies for this module"

## N/A criteria

Mark a gate N/A when:
- The gate is about a subsystem not touched by this spec
- The gate applies to a different language/runtime than what this spec uses
- The gate explicitly carves out exceptions for this type of change

Never use N/A as a workaround for a failing gate.
