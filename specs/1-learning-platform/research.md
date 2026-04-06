# Phase 0 Research: Learning Platform

## 1. Testing Stack in Existing Next.js App

Decision: Use Vitest for unit/integration tests, React Testing Library for component behavior, Playwright for end-to-end user flows, and schema-driven contract tests for API routes.

Rationale: This combination is lightweight, fast in CI, and aligns well with Next.js App Router projects. Vitest is easier to configure in TS monorepo-ish setups than heavier alternatives, while Playwright covers multi-step onboarding reliably.

Alternatives considered:
- Jest + RTL: mature but slower feedback and more config overhead for ESM-heavy Next.js setups.
- Cypress E2E: strong UI tooling but less suited for cross-browser and parallel CI at this stage.

## 2. Authentication and Role Model Integration

Decision: Keep auth in a dedicated auth module (`src/lib/auth`) with route-level role guards and session-based access checks in route handlers.

Rationale: It enforces separation of concerns and prevents role logic from leaking into components. Route handlers remain the trust boundary for authorization.

Alternatives considered:
- Role checks only in client UI: rejected due to security risk (bypassable).
- Duplicating role checks in each component: rejected due to maintainability issues.

## 3. AI Personalization Boundary

Decision: Use a service-layer personalization orchestrator (`personalization-service.ts`) that combines deterministic rules with AI recommendations and records decision traces.

Rationale: Keeps AI non-authoritative, auditable, and easy to replace. Deterministic rules remain the final guardrail for pedagogical safety.

Alternatives considered:
- AI-first direct decisions stored immediately: rejected because it weakens transparency and safety controls.
- Rule-only system with no AI input: rejected because it reduces personalization quality over time.

## 4. Data Access Pattern

Decision: Introduce repositories per aggregate (learner, assessment, learning path, mentorship) and keep Prisma usage inside repositories.

Rationale: This limits persistence coupling and simplifies unit testing of service logic with mocked repositories.

Alternatives considered:
- Direct Prisma calls from route handlers: rejected due to mixed concerns and brittle tests.
- Over-abstracted generic repository base class: rejected to avoid unnecessary indirection.

## 5. API Design Style

Decision: Use RESTful route handlers under `src/app/api` with explicit DTO validation and role-scoped responses.

Rationale: Matches existing Next.js conventions and keeps contract testing straightforward.

Alternatives considered:
- GraphQL: flexible, but introduces additional runtime and schema management complexity not needed for current scope.
- RPC-only actions: too implicit for cross-role contract governance.

## 6. Performance Baseline Strategy

Decision: SSR/Server Components for initial dashboard payloads, cached metadata for static catalogs, and paginated analytics responses.

Rationale: Minimizes client round-trips and keeps critical paths responsive under concurrent load.

Alternatives considered:
- Fully client-side fetching: rejected due to data waterfall and slower first meaningful render.
- Premature event-driven microservices split: rejected as over-engineering for initial release.

## 7. Edge-Case Handling Strategy

Decision: Model onboarding and assessment with explicit states (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED`) and idempotent submission endpoints.

Rationale: Enables safe retries/resume and prevents duplicate processing.

Alternatives considered:
- Stateless one-shot onboarding flow: rejected because interruptions are common and would degrade completion rates.
