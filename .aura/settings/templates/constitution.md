# Constitution: {{PROJECT_NAME}}

Version: 1.0  
Date: {{DATE}}

## Preamble

<!-- One paragraph: project type, scale, primary users, and why this Constitution exists. -->

## Articles

### Article 1 — <!-- Principle Name -->

<!-- One clear, specific, checkable statement. -->

_Rationale:_ <!-- Why this matters for this project -->

### Article 2 — <!-- Principle Name -->

<!-- ... -->

_Rationale:_ <!-- ... -->

### Article 3 — <!-- Principle Name -->

<!-- ... -->

_Rationale:_ <!-- ... -->

<!-- Add 2–6 more articles as appropriate. Aim for 5–9 total. -->

## Constitutional Gates

Questions that `/aura-plan` will evaluate for each spec:

1. Does this plan violate Article 1 (<!-- name -->)?
2. Does this plan violate Article 2 (<!-- name -->)?
3. <!-- Add one gate per article -->

## Amendment Process

To amend a Constitution article:

1. Create an amendment spec: `/aura-spec constitution-amendment-article-N`
2. Include rationale explaining why the amendment is necessary
3. Run `/aura-plan` for the amendment spec (it will flag the Constitutional change)
4. Human approval required before the amendment takes effect
5. Update this document and increment the version number

## Amendment History

| Version | Date | Article | Change | Rationale |
|---------|------|---------|--------|-----------|
| 1.0 | {{DATE}} | All | Initial constitution | Project inception |
