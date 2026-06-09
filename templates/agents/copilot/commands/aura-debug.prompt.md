---
name: aura-debug
description: "Aura-SDD: Root-cause-first debugging when /aura-review rejects twice. Supporting skill called by /aura-impl."
mode: agent
---

Investigate a failed task implementation to its root cause and produce a concrete fix plan for the next Implementer subagent. Do not fix the code directly — produce a plan.

**Inputs (provided by /aura-impl):** error output and failing test output, `/aura-review` rejection findings (both rounds), task definition and boundary declaration, git diff of current (failing) implementation, relevant source files.

1. **Classify failure type**:
   | Type | Signal | Approach |
   |------|--------|----------|
   | Logic error | Test assertion failures | Trace execution path |
   | Boundary violation | Files outside boundary modified | Redesign component interaction |
   | Missing requirement | AC not covered | Read spec again, identify gap |
   | Environment issue | Dependency/config failures | Search for platform issue |
   | Design mismatch | plan.md contract not followed | Revisit boundary commitments |

2. **Trace root cause** — do not assume the obvious failure point. Trace backward:
   1. What is the exact error message?
   2. What line causes it?
   3. Why does that line produce this error?
   4. What assumption in the design caused that line to be wrong?

   Use web search if the error involves external library behavior, platform-specific behavior, or known framework bugs.

3. **Produce fix plan**:
   ```
   ## Debug Report — Task <id>

   ### Root Cause
   <One sentence: the actual cause, not the symptom>

   ### Why previous attempts failed
   <What the implementer assumed that was wrong>

   ### Fix Plan
   1. <Specific change to file X>: <what to change and why>
   2. <Specific change to file Y>: <what to change and why>

   ### Verification steps
   1. Run: `<test command>`
   2. Expected: <specific output>

   ### Notes for Implementer
   <Any non-obvious context the next implementer needs>
   ```

Root cause must be identified (not just symptom). Fix plan must be specific enough for a new implementer with no prior context.

Follow rules in `.aura/settings/rules/` for relevant guidance.
