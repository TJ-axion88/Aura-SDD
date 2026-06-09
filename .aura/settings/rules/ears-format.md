# EARS Format — Acceptance Criteria Standard

All acceptance criteria in `spec.md` MUST use EARS (Easy Approach to Requirements Syntax) format.

## Patterns

| Trigger | Template | Use when |
|---------|----------|----------|
| Event-driven | `WHEN <trigger>, THE SYSTEM SHALL <response>.` | A specific event occurs |
| Conditional | `IF <condition>, THE SYSTEM SHALL <response>.` | A state is true |
| Ongoing | `WHILE <state>, THE SYSTEM SHALL <response>.` | A continuous condition |
| Optional feature | `WHERE <feature enabled>, THE SYSTEM SHALL <response>.` | Feature flag or config |
| Ubiquitous | `THE SYSTEM SHALL <response>.` | Always true requirement |

## Rules

1. Use EXACTLY ONE of the five pattern forms per criterion
2. `THE SYSTEM SHALL` is always present and in this exact form
3. Responses are observable, testable outcomes — not implementation steps
4. One criterion per line
5. Use numeric IDs: `AC 1.1`, `AC 1.2`, `AC 2.1`

## Examples

✅ CORRECT:
```
- WHEN the user submits a valid form, THE SYSTEM SHALL create a session and redirect to /dashboard.
- IF the token is expired, THE SYSTEM SHALL return HTTP 401 with error code "token_expired".
- WHILE the file upload is in progress, THE SYSTEM SHALL display a progress indicator.
- THE SYSTEM SHALL validate email addresses against RFC 5322.
```

❌ INCORRECT:
```
- The system should handle errors  (not testable, not EARS)
- When a user logs in, check the password  (describes implementation, not outcome)
- Validate inputs  (no trigger, no outcome)
```

## Application

- `/aura-spec` generates criteria using this format
- `/aura-review` checks AC 5 (EARS fidelity): rejects if criteria don't follow format
- `/aura-validate` verifies each criterion has a corresponding test
