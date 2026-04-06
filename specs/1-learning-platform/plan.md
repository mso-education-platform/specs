# Implementation Plan: Learning Platform

**Branch**: `1-learning-platform` | **Date**: 2026-04-05 | **Spec**: `/specs/1-learning-platform/spec.md`
**Input**: Feature specification from `/specs/1-learning-platform/spec.md`

## Summary

Implement the learning platform on top of the existing Next.js App Router application in `app/` by adding role-aware onboarding, assessment + personalization orchestration, dynamic learning paths, dashboards (learner/educator/parent), mentorship requests, and decision transparency logs. The solution uses a clean split between UI (Server/Client Components), API route handlers, domain services, and Prisma-backed persistence to keep the codebase scalable without over-engineering.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+, Next.js 15 App Router  
**Primary Dependencies**: Next.js, React, Prisma ORM, Zod, NextAuth/Auth.js (or existing auth), shadcn/ui components already present in `src/components/ui`  
**Storage**: PostgreSQL via Prisma (`app/prisma/schema.prisma`)  
**Testing**: Vitest + React Testing Library + Playwright + Supertest-compatible route tests  
**Target Platform**: Web (desktop/mobile browsers), Vercel/Node server runtime  
**Project Type**: Web application (single Next.js app with server-rendered and API routes)  
**Performance Goals**: Support 1000 concurrent users, keep p95 critical route/API latency < 2s, stream dashboard content for perceived responsiveness  
**Constraints**: Keep onboarding completion under 30 minutes, deterministic personalization safety rules, role-based data access, auditable adaptation decisions, minimal cognitive load in UX  
**Scale/Scope**: Initial release for learner/educator/parent flows; 8-12 AI track units and 10 Web track units; personalization per learner; cohort-level analytics views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Clarity and Simplicity: PASS
- Robustness and Maintenance-Free: PASS
- Test-Oriented Logic Implementation: PASS (plan includes unit/integration/e2e and contract tests; tasks should enforce tests-first for business rules)
- Performance for Real-Time Interactions: PASS (SSR/streaming, caching, pagination, and lightweight payloads are planned)
- Security First: PASS (RBAC, protected route handlers, least-privilege data access, and input validation are included)

## Project Structure

### Documentation (this feature)

```text
specs/1-learning-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── learning-platform.openapi.yaml
└── tasks.md            # Generated later by /speckit.tasks
```

### Source Code (repository root)

```text
app/
├── prisma/
│   └── schema.prisma                     # Modify: add domain models and enums
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                  # Modify: marketing home aligned with spec
│   │   │   ├── about/page.tsx            # Create
│   │   │   ├── contact/page.tsx          # Create
│   │   │   └── tracks/page.tsx           # Create (redirect to sign-in if unauthenticated)
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx          # Create
│   │   │   └── onboarding/
│   │   │      ├── age-level/page.tsx     # Create
│   │   │      ├── program/page.tsx       # Create
│   │   │      ├── assessment/page.tsx    # Create
│   │   │      └── feedback/page.tsx      # Create
│   │   ├── (learner)/
│   │   │   ├── dashboard/page.tsx        # Create
│   │   │   ├── track/page.tsx            # Create (first learning track view)
│   │   │   └── unit/[unitId]/page.tsx    # Create
│   │   ├── (educator)/dashboard/page.tsx # Create
│   │   ├── (parent)/dashboard/page.tsx   # Create
│   │   ├── api/
│   │   │   ├── onboarding/route.ts       # Create
│   │   │   ├── assessment/start/route.ts # Create
│   │   │   ├── assessment/submit/route.ts# Create
│   │   │   ├── learning-path/route.ts    # Create
│   │   │   ├── units/[unitId]/route.ts   # Create
│   │   │   ├── mentorship/requests/route.ts # Create
│   │   │   ├── dashboard/learner/route.ts   # Create
│   │   │   ├── dashboard/educator/route.ts  # Create
│   │   │   └── dashboard/parent/route.ts    # Create
│   │   ├── globals.css                    # Modify (education-first visual language)
│   │   └── layout.tsx                     # Modify (shared shell + role-aware nav)
│   ├── components/
│   │   ├── onboarding/                    # Create: flow-specific UI blocks
│   │   ├── assessment/                    # Create: question renderer, progress, result summary
│   │   ├── learning-path/                 # Create: unit timeline, prerequisite badges
│   │   ├── dashboards/                    # Create: learner/educator/parent widgets
│   │   ├── mentorship/                    # Create: mentor request and status components
│   │   └── shared/                        # Create: guard wrappers, empty/error views
│   ├── lib/
│   │   ├── auth/                          # Create: auth guards and role helpers
│   │   ├── db/                            # Create: prisma client wrapper and query helpers
│   │   ├── validation/                    # Create: zod schemas for API payloads
│   │   └── constants/                     # Create: scoring bands, adaptation rules metadata
│   ├── services/
│   │   ├── onboarding-service.ts          # Create
│   │   ├── assessment-service.ts          # Create
│   │   ├── personalization-service.ts     # Create
│   │   ├── learning-path-service.ts       # Create
│   │   ├── dashboard-service.ts           # Create
│   │   └── mentorship-service.ts          # Create
│   ├── repositories/
│   │   ├── learner-repository.ts          # Create
│   │   ├── assessment-repository.ts       # Create
│   │   ├── learning-path-repository.ts    # Create
│   │   └── mentorship-repository.ts       # Create
│   └── hooks/
│       ├── useAssessmentSession.ts        # Create
│       ├── useLearningPath.ts             # Create
│       └── useMentorship.ts               # Create
└── tests/
    ├── unit/                              # Create
    ├── integration/                       # Create
    ├── contract/                          # Create
    └── e2e/                               # Create
```

**Structure Decision**: Keep a single Next.js app and add feature-sliced modules under `src/` (UI, services, repositories, validation, hooks). This aligns with existing project shape and keeps domain logic independent from rendering and transport.

## Component Hierarchy

1. Root shell
- `src/app/layout.tsx` provides global providers, auth/session context, and top-level navigation.

2. Public pages
- Public route group contains `Home`, `About`, `Contact`, and public `Tracks` page.
- Shared presentation components: hero, purpose section, audience cards, CTA blocks.

3. Auth and onboarding
- `sign-in` page handles authentication entry.
- Onboarding pages are step-based wrappers with local step components:
  - `AgeLevelStep`
  - `ProgramSelectionStep`
  - `AssessmentRunner`
  - `PersonalizationFeedback`

4. Role dashboards
- Learner dashboard: progress widgets, active units, recommendations.
- Educator dashboard: cohort KPIs, learner intervention queue, adaptation logs.
- Parent dashboard: child summary, milestones, engagement signals.

5. Learning flow pages
- Track landing page (after onboarding).
- Unit detail page with prerequisites, tasks/projects, reflection prompts, and navigation.

## API Routes and Responsibilities

1. `POST /api/onboarding`
- Persist age level and selected program.
- Validate eligibility and onboarding state transitions.

2. `POST /api/assessment/start`
- Create assessment session and return age/program-adapted first questions.

3. `POST /api/assessment/submit`
- Score responses, compute skill-domain metrics, trigger personalization pipeline.

4. `GET /api/learning-path`
- Return personalized unit sequence and unlock statuses for current learner.

5. `PATCH /api/units/{unitId}`
- Update unit progress, project submission status, reflection completion.

6. `POST /api/mentorship/requests`
- Create mentor request with context and urgency.

7. `GET /api/dashboard/learner`
- Return learner metrics, recent activity, and recommendation payload.

8. `GET /api/dashboard/educator`
- Return cohort analytics and intervention candidates.

9. `GET /api/dashboard/parent`
- Return high-level child milestones and engagement summary.

## Data Flow and Separation of Concerns

1. UI components
- Client Components manage local interaction state only.
- Server Components fetch initial page data via services (not direct DB calls from UI).

2. Route handlers (`src/app/api/**/route.ts`)
- Handle authentication and authorization checks.
- Parse/validate request payloads with Zod.
- Delegate to service layer.
- Map domain/service results to HTTP responses.

3. Service layer (`src/services/*`)
- Encapsulates business logic: scoring, adaptation, sequencing, progression rules.
- Coordinates repositories and deterministic rule checks.
- Emits adaptation decision logs for transparency.

4. Repository layer (`src/repositories/*`)
- Owns Prisma queries and persistence details.
- Returns typed domain data to services.

5. Shared libs (`src/lib/*`)
- Cross-cutting concerns: auth helpers, validators, constants, typed DTOs.

## Business Logic Placement

- Assessment scoring: `assessment-service.ts`
- AI + deterministic adaptation orchestration: `personalization-service.ts`
- Unit sequencing and prerequisite enforcement: `learning-path-service.ts`
- Dashboard aggregation and role projections: `dashboard-service.ts`
- Mentorship matching/request workflow: `mentorship-service.ts`
- UI orchestration hooks only for client state and API calls; no core decision logic in hooks/components.

## Edge Cases

- Learner changes program after assessment already completed.
- Partial onboarding (drop-off between steps) and safe resume.
- Assessment timeout/disconnect with recoverable session state.
- Contradictory adaptation signals (e.g., high score but low engagement).
- Missing mentor availability for urgent requests.
- Parent with multiple linked learners.
- Prerequisite graph cycles or invalid unit dependencies from seed data.
- Role escalation attempts against dashboard endpoints.

## Performance Considerations

- Use Server Components for initial dashboard payloads to reduce client-side waterfalls.
- Cache stable data (unit catalogs, rubric metadata) with revalidation.
- Paginate educator cohort views and adaptation logs.
- Avoid N+1 Prisma queries via include/select batching in repositories.
- Keep assessment payload incremental (question chunks) instead of full-batch transfer.
- Add indexes for learner progress, cohort lookups, mentorship availability, and adaptation event timestamps.

## Testing Strategy Suggestions

- Unit tests:
  - Scoring algorithms by age/program/rubric.
  - Deterministic adaptation rules and conflict resolution.
  - Prerequisite enforcement and unit unlock logic.

- Integration tests:
  - Route handlers + services + test DB for onboarding, assessment submission, learning path retrieval.
  - AuthZ tests per role for dashboard endpoints.

- Contract tests:
  - Validate handlers against `contracts/learning-platform.openapi.yaml`.

- E2E tests:
  - Happy-path onboarding to first unit.
  - Learner progression with feedback.
  - Educator intervention workflow.
  - Parent monitoring visibility.

## Phase Deliverables

### Phase 0 (Research)
- Finalize testing stack choice in repo context.
- Validate auth integration pattern with existing app setup.
- Confirm AI provider abstraction boundary for personalization.

### Phase 1 (Design)
- Data model and relationships finalized in `data-model.md`.
- API contract documented in `contracts/learning-platform.openapi.yaml`.
- `quickstart.md` provides implementation order and verification steps.

### Post-Design Constitution Re-Check

- Clarity and Simplicity: PASS
- Robustness and Maintenance-Free: PASS
- Test-Oriented Logic Implementation: PASS
- Performance for Real-Time Interactions: PASS
- Security First: PASS

## Complexity Tracking

No constitution violations requiring justification.

## Implementation Addendum (2026-04-06): Authentication Hardening

### Summary

Implemented a focused enhancement of the onboarding entry flow to support password-based registration and login, with explicit UX for existing accounts and integrated E2E validation in CI.

### Delivered Scope

1. Data model and persistence
- Added nullable `passwordHash` on `User` in Prisma schema.
- Added migration for password hash column and aligned migration history/state.

2. API and validation
- Added auth endpoints:
  - `POST /api/auth/check-email`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Added dedicated auth payload schemas (`check-email`, `register`, `login`).
- Added secure password hashing/verification helper.

3. UX behavior
- Updated sign-in page to support register/login modes.
- Added existing-account detection during onboarding start.
- Added explicit message and CTA to switch to login form when account already exists.

4. Reliability and observability
- Improved API error mapping for validation and known Prisma errors.
- Added Playwright E2E test for register-then-login scenario.
- Updated CI to run Playwright E2E with PostgreSQL service and upload artifacts.

### Verification

- Local lint: pass.
- New Playwright test (`auth-register-login.spec.ts`): pass.
- CI workflow updated with E2E execution and report artifact upload.
