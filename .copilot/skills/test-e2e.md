Conventions for E2E tests with Playwright:
- Files located at tests/e2e/[feature].spec.ts
- Test only the critical flows defined in the spec
- Use `data-testid` attributes for selectors; never rely on CSS classes
- Maintain a fixtures file for test data
- Run with: `npx playwright test`