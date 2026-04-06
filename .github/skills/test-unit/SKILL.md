---
name: test-unit
description: Conventions for unit tests with Vitest.
---

Conventions for unit tests with Vitest:
- Files under `tests/unit/` or colocated with `[name].test.ts`
- Always mock infrastructure (Prisma, Redis) via `vi.mock()`
- Never mock the domain or the use cases
- Use the AAA structure: Arrange / Act / Assert
- Test names: "should [expected behavior] when [condition]"
