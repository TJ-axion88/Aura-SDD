---
name: aura-debug
description: "Aura-SDD: Root-cause-first debugging with 10 ROOT_CAUSE categories, CONFIDENCE scoring, and NEXT_ACTION. Called by /aura-impl."
mode: agent
---

Investigate a failed task implementation to its root cause and produce a concrete fix plan for the next Implementer subagent. Do not fix the code directly — produce a plan.

**Inputs (provided by /aura-impl):** error output and failing test output, `/aura-review` rejection findings (both rounds), task definition and boundary declaration, git diff of current (failing) implementation, relevant source files.

1. **Classify ROOT_CAUSE_CATEGORY** (10 categories):
   | Category | Signal | Approach |
   |----------|--------|----------|
   | `LOGIC_ERROR` | Test assertion failures | Trace execution path |
   | `BOUNDARY_VIOLATION` | Files outside boundary modified | Redesign interaction |
   | `MISSING_REQUIREMENT` | AC not covered | Re-read spec |
   | `MISSING_DEPENDENCY` | `cannot find module` | Check package.json |
   | `CONFIG_GAP` | Missing env var / config key | Verify .env.example |
   | `MODULE_FORMAT` | ESM/CJS mismatch | Check package.json `"type"` |
   | `DESIGN_MISMATCH` | plan.md contract not followed | Revisit boundary commitments |
   | `SPEC_CONFLICT` | Requirements contradict design | Escalate — human must resolve |
   | `TASK_SCOPE_EXCEEDED` | Task too large; needs decomposition | Flag for splitting |
   | `CONSTITUTIONAL_VIOLATION` | Aura-SDD Article violated | Re-read `.aura/constitution.md` |

2. **Trace root cause** — trace backward: exact error → line → why → design assumption. Use web search for external library behavior, platform issues, known bugs.

3. **Assess CONFIDENCE**: `HIGH` (certain, fix unambiguous) | `MEDIUM` (likely, minor uncertainty) | `LOW` (speculative)

4. **Determine NEXT_ACTION**: `RETRY_TASK` (root cause clear, within boundary) | `BLOCK_TASK` (outside boundary or LOW confidence) | `STOP_FOR_HUMAN` (SPEC_CONFLICT / TASK_SCOPE_EXCEEDED / CONSTITUTIONAL_VIOLATION)

5. **Produce fix plan**:
   ```
   ## Debug Report — Task <id>

   ### ROOT_CAUSE_CATEGORY
   <one of 10 categories>

   ### CONFIDENCE
   HIGH | MEDIUM | LOW
   _Rationale:_ <one sentence>

   ### Root Cause
   <One sentence: the actual cause, not the symptom>

   ### Why previous attempts failed
   <What the implementer assumed that was wrong>

   ### Fix Plan
   1. <Specific change to file X>: <what to change and why>
   2. <Specific change to file Y>: <what to change and why>

   ### Verification Steps
   1. Run: `<test command>`
   2. Expected: <specific output>

   ### NEXT_ACTION
   RETRY_TASK | BLOCK_TASK | STOP_FOR_HUMAN
   _Reason:_ <one sentence>

   ### Notes for Implementer
   <Any non-obvious context the next implementer needs>
   ```

ROOT_CAUSE_CATEGORY must be assigned (one of 10). CONFIDENCE must be stated with rationale. Root cause must be identified (not symptom). NEXT_ACTION must be determined.

Follow rules in `.aura/settings/rules/` for relevant guidance.
