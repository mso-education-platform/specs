---
name: spec-implementation
description: Guidelines for implementing a spec into code, tests, migrations and PR checklist.
---

Guidelines for implementing a spec

- Start by reading the specification and its checklists:
	- `specs/[n]-[name]/spec.md`
	- `specs/[n]-[name]/checklists/plan.md`
	- `specs/[n]-[name]/checklists/tasks.md`

- Before each implementation task, read the corresponding skill in `.copilot/skills/`.

- Implement one task at a time. Create a focused branch & PR for each task.

- Required checks before merging:
	- Unit tests pass locally and in CI
	- E2E tests for critical flows pass (Playwright)
	- New i18n keys are added and translations/schemas updated
	- If DB schema changed: run `npx prisma migrate dev --name [name]` and `npx prisma generate`
	- Type generation and build succeed (`tsc --noEmit`)

- PR contents checklist:
	- Title follows commit conventions (`feat|fix|chore: ...`)
	- Migration and generation commands included when relevant
	- Tests and examples demonstrating the implemented behavior

Use this file as the canonical step-by-step guide when turning a spec into code.
