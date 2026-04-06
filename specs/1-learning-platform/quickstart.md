# Quickstart: Implementing Learning Platform Feature

## 1. Pre-Implementation Checks

1. Confirm dependencies in `app/package.json`:
- Prisma client/runtime
- Zod
- Preferred test stack (Vitest/Playwright)

2. Confirm env vars in `app/.env` (or deployment env):
- `DATABASE_URL`
- Auth/session secrets
- Optional AI provider keys for personalization layer

3. Generate/update Prisma client after schema changes:
- `npm --prefix app run prisma:generate` (or equivalent script)

## 2. Recommended Implementation Order

1. Data layer first
- Update `app/prisma/schema.prisma` with entities from `data-model.md`.
- Add migrations and seed baseline programs + units.

2. Domain and service layer
- Create repositories in `app/src/repositories`.
- Create services in `app/src/services`.
- Add input schemas in `app/src/lib/validation`.

3. API routes
- Implement route handlers under `app/src/app/api/**/route.ts`.
- Ensure every route validates payloads and checks role permissions.

4. UI and route groups
- Implement public/auth/learner/educator/parent pages in `app/src/app` route groups.
- Build feature-specific components under `app/src/components/*`.

5. Hooks and state orchestration
- Add client hooks for assessment session, learning path loading, mentorship requests.

6. Observability and safety
- Add structured adaptation decision logging.
- Add error boundaries and user-safe fallback messages.

## 3. File-Level Delivery Checklist (app/)

## Modify

- `app/prisma/schema.prisma`
- `app/src/app/layout.tsx`
- `app/src/app/globals.css`
- `app/src/app/page.tsx`

## Create

- `app/src/app/(public)/about/page.tsx`
- `app/src/app/(public)/contact/page.tsx`
- `app/src/app/(public)/tracks/page.tsx`
- `app/src/app/(auth)/sign-in/page.tsx`
- `app/src/app/(auth)/onboarding/age-level/page.tsx`
- `app/src/app/(auth)/onboarding/program/page.tsx`
- `app/src/app/(auth)/onboarding/assessment/page.tsx`
- `app/src/app/(auth)/onboarding/feedback/page.tsx`
- `app/src/app/(learner)/dashboard/page.tsx`
- `app/src/app/(learner)/track/page.tsx`
- `app/src/app/(learner)/unit/[unitId]/page.tsx`
- `app/src/app/(educator)/dashboard/page.tsx`
- `app/src/app/(parent)/dashboard/page.tsx`
- `app/src/app/api/onboarding/route.ts`
- `app/src/app/api/assessment/start/route.ts`
- `app/src/app/api/assessment/submit/route.ts`
- `app/src/app/api/learning-path/route.ts`
- `app/src/app/api/units/[unitId]/route.ts`
- `app/src/app/api/mentorship/requests/route.ts`
- `app/src/app/api/dashboard/learner/route.ts`
- `app/src/app/api/dashboard/educator/route.ts`
- `app/src/app/api/dashboard/parent/route.ts`
- `app/src/components/onboarding/*`
- `app/src/components/assessment/*`
- `app/src/components/learning-path/*`
- `app/src/components/dashboards/*`
- `app/src/components/mentorship/*`
- `app/src/components/shared/*`
- `app/src/lib/auth/*`
- `app/src/lib/db/*`
- `app/src/lib/validation/*`
- `app/src/lib/constants/*`
- `app/src/services/*`
- `app/src/repositories/*`
- `app/src/hooks/*`
- `app/tests/unit/*`
- `app/tests/integration/*`
- `app/tests/contract/*`
- `app/tests/e2e/*`

## 4. Data Flow Validation (During Build)

1. Server-rendered pages should fetch initial data through services, not direct Prisma in UI files.
2. Client components should call route handlers for mutations.
3. Route handlers should delegate all core business decisions to services.
4. Services should call repositories only; repositories own Prisma calls.
5. Adaptation decisions should be persisted and exposed in educator-facing logs.

## 5. Testing Execution Order

1. Unit tests for services:
- Scoring logic
- Adaptation rule engine
- Path sequencing/prerequisite enforcement

2. Integration tests for routes:
- Onboarding transitions
- Assessment submit -> path generation
- Role-specific dashboard access controls

3. Contract tests against `contracts/learning-platform.openapi.yaml`.

4. E2E tests for critical user journeys:
- New learner onboarding to first unlocked unit
- Educator intervention path
- Parent progress monitoring

## 6. Performance and Reliability Checks

- Verify p95 response for dashboard and learning path endpoints under realistic seed data.
- Confirm onboarding resume behavior after interrupted sessions.
- Check query plans for key indexes (`learnerId`, `status`, `sequenceIndex`, `createdAt`).
- Ensure no endpoint leaks cross-role sensitive fields.

## 7. Definition of Done (Feature Slice)

- Functional requirements FR-001 through FR-010 implemented for initial slice.
- OpenAPI contract implemented and validated.
- Tests passing in CI with coverage for core service logic.
- Learner, educator, and parent role flows usable end-to-end.
- Adaptation decisions auditable and visible in educator tooling.
