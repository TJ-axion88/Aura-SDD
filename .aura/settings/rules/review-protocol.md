# Review Protocol

The adversarial review protocol used by `/aura-review`. Always run as an independent subagent — never as the same agent that implemented the code.

## Independence requirement

The reviewer MUST NOT be the implementer. `/aura-impl` dispatches a fresh reviewer subagent. The reviewer reads the diff fresh, without the implementer's assumptions.

## The 12 checks

### Mechanical verification (run first)
1. **Tests pass**: Execute test suite; all tests green; no `.skip`, `.only`, `xit`
2. **No regressions**: Full test suite (including existing) still passes
3. **TDD evidence**: Red phase exists in git history or test commit; green was not first

### Spec compliance
4. **Requirements coverage**: Each AC in `_Requires:_` has a corresponding test assertion
5. **EARS fidelity**: Each WHEN/IF/WHILE trigger produces the specified response
6. **Edge case coverage**: Failure modes in ACs tested (not just happy path)

### Boundary discipline
7. **Boundary scope**: Files changed ⊆ files declared in `_Files:_` AND `_Boundary:_` scope
8. **No leakage**: No domain logic from another boundary's responsibility
9. **Interface contracts**: Consumed and exposed types match plan.md Boundary Commitments

### Code quality
10. **No overengineering**: No abstraction, generalization, or optimization not required by the task
11. **Error propagation**: Errors bubble as specified in plan.md Error Handling
12. **Constitutional compliance**: No violations of `.aura/constitution.md` articles

## Verdict format

APPROVED: State "APPROVED — all 12 checks passed."

REJECTED: List each failing check with:
- Check number and name
- Specific evidence (file:line or test name)
- Specific required fix

## Severity levels

**Blocking** (REJECTED):
- Any of checks 1–9 fail
- Checks 10–12 fail with clear violation

**Non-blocking** (APPROVED with notes):
- Stylistic preferences
- Optional optimizations
- Documentation improvements

Never reject for stylistic reasons. Reject for correctness, coverage, or boundary violations only.
