---
name: aura-sync
description: "Aura-SDD: Spec↔Implementation drift detector. Scans spec.md ACs against implementation files, produces coverage matrix and SYNC_STATUS verdict."
mode: agent
---

Detect drift between a feature's spec.md acceptance criteria and the actual implementation. Produce a coverage matrix and SYNC_STATUS verdict.

**Usage:** `aura-sync <feature-name>` or `aura-sync --all`

1. **Load spec artifacts**: Read `.aura/specs/<feature>/spec.md`, extract every AC (WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL lines) and assign IDs AC-1…AC-N. Read `tasks.md` for task↔AC refs. Read `plan.md` for declared files.

2. **Build search scope**: Use files from `plan.md` boundary commitments or `git log` since spec creation. Exclude `test/`, `*.md`, `*.json`, `node_modules/`, `.aura/`.

3. **Scan each AC**: Extract key terms → `grep -rn` in impl files → check tasks.md for completed task referencing AC.
   - **COVERED**: completed task references AC AND keyword found in impl
   - **PARTIAL**: task done OR keyword found, not both
   - **MISSING**: no task, no keyword
   - **UNTESTABLE**: non-functional requirement → flag for manual review

4. **Coverage matrix**:
   ```
   | AC  | Criterion (summary)              | Task  | Impl  | Status  |
   |-----|----------------------------------|-------|-------|---------|
   | AC-1 | WHEN user logs in → token      | ✅    | found | COVERED |
   | AC-2 | IF expires → reject            | ✅    | found | COVERED |
   | AC-3 | WHERE rate > 100 → queue       | ❌    | none  | MISSING |
   ```

5. **SYNC_STATUS verdict**:
   - `IN_SYNC` — all ACs COVERED/UNTESTABLE
   - `PARTIAL_COVERAGE` — some PARTIAL
   - `DRIFT_DETECTED` — one or more MISSING
   - `SPEC_BEHIND` — impl has code not in any AC

6. **Report** with verdict, counts, blocking issues, warnings.

7. **Recommended actions**:
   - IN_SYNC → proceed to `aura-validate`
   - DRIFT_DETECTED → run `aura-tasks --amend <feature>` or `aura-spec-refine`
   - SPEC_BEHIND → add new ACs or remove orphaned code
