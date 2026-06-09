# Clarify Protocol

Rules for `/aura-clarify` when resolving ambiguity in `spec.md`.

## Goal of clarification

Remove ALL `[NEEDS CLARIFICATION]` markers without adding ambiguity. After clarification, each acceptance criterion must be:
1. Testable — a developer can write a test that verifies it
2. Unambiguous — only one interpretation is possible
3. EARS-formatted — uses WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL

## Question quality rules

### Good questions (ask these)

- **Specific**: "For AC 2.3 — when the session expires during a file upload, should the upload be cancelled immediately or completed and then the user redirected to login?"
- **Binary or enumerable**: Offer concrete options when possible
- **Testability-focused**: "How would we know in a test that this behavior is correct?"

### Bad questions (avoid these)

- **Vague**: "Can you clarify Scenario 2?" → Ask what specifically is unclear
- **Assumption-hiding**: "Should we use JWT?" → Not a user-facing clarification question
- **Leading**: "Should it redirect to login, since that's the standard?" → Present options neutrally

## Resolution format

When the user answers, update spec.md:

Before:
```markdown
- IF the user's session expires during checkout, THE SYSTEM SHALL [NEEDS CLARIFICATION: cancel or complete?]
```

After:
```markdown
- IF the user's session expires during checkout, THE SYSTEM SHALL cancel the checkout, clear the cart, and redirect to /login with message "Session expired. Please log in again."
```

## Unresolvable markers

If the user cannot answer a clarification (e.g., depends on external team decision):
- Keep the `[NEEDS CLARIFICATION]` marker
- Add `[BLOCKED: <reason>]` annotation
- Document the dependency in the spec's Open Questions section
- Do NOT proceed to `/aura-plan` with unresolved markers (unless user explicitly overrides)

## Ambiguity sources to watch

- Performance requirements without numbers ("should be fast" → "SHALL respond in ≤ 500ms at p95")
- User roles without definitions ("admin user" → define in steering/product.md or spec)
- Error messages without exact text (matters for frontend i18n)
- Pagination without page size or cursor strategy
- "Optional" features without on/off conditions
