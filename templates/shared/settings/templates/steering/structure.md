# Structure Steering

## Directory Philosophy

<!-- One paragraph: how the project is organized and why (by feature, by layer, by domain, etc.) -->

## Key Directories

```
<project root>/
├── <!-- src/ --> — <!-- what goes here -->
├── <!-- test/ --> — <!-- what goes here -->
└── <!-- docs/ --> — <!-- what goes here -->
```

## Naming Conventions

- **Files**: <!-- pattern, e.g., "kebab-case.ts" -->
- **Functions**: <!-- pattern, e.g., "camelCase verbs: createUser, fetchItems" -->
- **Types/Interfaces**: <!-- pattern, e.g., "PascalCase nouns: UserSession, CreateItemInput" -->
- **Constants**: <!-- pattern, e.g., "SCREAMING_SNAKE_CASE" -->
- **Test files**: <!-- pattern, e.g., "<name>.test.ts adjacent to source" -->

## Code Principles

- <!-- principle 1, e.g., "Prefer functions over classes" -->
- <!-- principle 2, e.g., "One primary export per file" -->
- <!-- principle 3, e.g., "Import from index files, not deep paths" -->

## Module Boundaries

<!-- Which modules may import from which. E.g., "UI may not import from DB layer directly." -->
