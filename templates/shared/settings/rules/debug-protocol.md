# Debug Protocol

Rules for `/aura-debug` when investigating a failed task after two rejected reviews.

## Core principle: Root cause first

Never jump to a fix. Find the root cause first. The symptom (failing test, rejection finding) is rarely the root cause.

## Failure classification tree

```
Is it a test failure?
  YES → Is the test correct?
    YES → The implementation is wrong
    NO  → The test needs fixing too
  NO  → Is it a build/type error?
    YES → What assumption about types/interfaces is wrong?
    NO  → Is it a boundary violation?
      YES → Design mismatch between task and plan
      NO  → Is it environmental?
        YES → Web search for platform/library issue
        NO  → Classify as unknown, ask for human help
```

## Investigation steps

1. **Isolate**: Identify the single smallest failing case
2. **Reproduce**: Confirm you can reproduce with a minimal reproduction
3. **Trace**: Follow the call stack backward from the error site
4. **Question assumptions**: What did the implementer assume that was wrong?
5. **Find the lie**: Where does the actual behavior diverge from the expected behavior?

## When to use web search

Use web search when:
- Error message contains a library/framework version
- Error involves OS/platform-specific behavior
- Stack trace shows code not in this project
- Error pattern is recognizable as a known issue

Search query format: `"<error message>" site:<framework-docs-url>` or `"<error message>" <framework> <version>`

## Fix plan requirements

The fix plan MUST be:
- Specific enough for a new implementer with no context
- List every file to change and what to change
- Include verification steps (exact commands to run)
- Explain WHY the fix works (not just what to do)

## What NOT to do

- Do not modify files outside the task's `_Boundary:_` to work around the issue
- Do not disable tests to make the build pass
- Do not add `try/catch` to hide errors
- Do not change the spec or plan to match a broken implementation
