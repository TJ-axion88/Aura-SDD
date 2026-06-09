# Tasks: {{FEATURE_NAME}}

## Implementation Waves

### Wave 0 — Foundation (sequential, must complete first)

- [ ] **Task 0.1** — Types, interfaces, and shared utilities
  _Boundary:_ shared
  _Depends:_ none
  _Requires:_ All scenarios (foundational)
  _Files:_ `src/<!-- types.ts --> (new)`, `test/<!-- types.test.ts --> (new)`
  <!-- Define all types, interfaces, and shared utilities that other tasks will use. Write type-level tests first. -->

### Wave 1 — Parallel implementation [P]

- [ ] **Task 1.1** [P] — <!-- Component A -->
  _Boundary:_ <!-- boundary-a -->
  _Depends:_ Task 0.1
  _Requires:_ Scenario 1 (AC 1.1, 1.2)
  _Files:_ `src/<!-- a.ts --> (new)`, `test/<!-- a.test.ts --> (new)`
  <!-- RED: Write failing tests for Scenario 1 ACs. GREEN: Implement minimal code. REFACTOR: Clean up. -->

- [ ] **Task 1.2** [P] — <!-- Component B -->
  _Boundary:_ <!-- boundary-b -->
  _Depends:_ Task 0.1
  _Requires:_ Scenario 2 (AC 2.1, 2.2)
  _Files:_ `src/<!-- b.ts --> (new)`, `test/<!-- b.test.ts --> (new)`
  <!-- RED → GREEN → REFACTOR for Scenario 2 -->

### Wave 2 — Integration

- [ ] **Task 2.1** — Integration and end-to-end validation
  _Boundary:_ integration
  _Depends:_ Task 1.1, Task 1.2
  _Requires:_ All scenarios
  _Files:_ `test/integration/<!-- feature.test.ts --> (new)`
  <!-- Write integration tests that cross boundaries. Verify all acceptance criteria end-to-end. -->

## Implementation Notes

<!-- /aura-impl appends task learnings here after each task completes -->
