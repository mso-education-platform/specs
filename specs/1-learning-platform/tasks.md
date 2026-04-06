# Tasks: Learning Platform

**Input**: Design documents from `/specs/1-learning-platform/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`

**Tests**: Included because testing is explicitly requested in the feature specification (`User Scenarios & Testing`) and required by the constitution.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependencies, folders, and base project configuration.

- [x] T001 Add testing and validation dependencies in `app/package.json`
- [x] T002 Configure Vitest and test scripts in `app/vitest.config.ts` and `app/package.json`
- [x] T003 [P] Configure Playwright E2E runner in `app/playwright.config.ts`
- [x] T004 [P] Create test directory structure and placeholders in `app/tests/unit/.gitkeep`, `app/tests/integration/.gitkeep`, `app/tests/contract/.gitkeep`, and `app/tests/e2e/.gitkeep`
- [x] T005 [P] Create feature module folders in `app/src/components/onboarding/.gitkeep`, `app/src/components/assessment/.gitkeep`, `app/src/components/learning-path/.gitkeep`, `app/src/components/dashboards/.gitkeep`, `app/src/components/mentorship/.gitkeep`, `app/src/components/shared/.gitkeep`, `app/src/services/.gitkeep`, `app/src/repositories/.gitkeep`, `app/src/lib/auth/.gitkeep`, `app/src/lib/db/.gitkeep`, `app/src/lib/validation/.gitkeep`, `app/src/lib/constants/.gitkeep`, and `app/src/hooks/.gitkeep`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core architecture, data model, auth guards, and shared infrastructure required by all stories.

**⚠️ CRITICAL**: No user story implementation starts before this phase is complete.

- [x] T006 Update domain models and enums for learner platform in `app/prisma/schema.prisma`
- [x] T007 Create and apply Prisma migration for learning platform schema in `app/prisma/migrations/`
- [x] T008 [P] Add Prisma client singleton and DB utilities in `app/src/lib/db/prisma.ts`
- [x] T009 [P] Seed programs, units, and prerequisites in `app/prisma/seed.ts`
- [x] T010 Implement auth session and role guard helpers in `app/src/lib/auth/session.ts` and `app/src/lib/auth/guards.ts`
- [x] T011 [P] Define shared Zod DTO schemas in `app/src/lib/validation/onboarding.ts`, `app/src/lib/validation/assessment.ts`, `app/src/lib/validation/learning-path.ts`, and `app/src/lib/validation/mentorship.ts`
- [x] T012 [P] Add scoring/adaptation constants and rule metadata in `app/src/lib/constants/personalization.ts`
- [x] T013 Implement repository base queries for learners and profiles in `app/src/repositories/learner-repository.ts`
- [x] T014 [P] Implement repository queries for assessments in `app/src/repositories/assessment-repository.ts`
- [x] T015 [P] Implement repository queries for learning paths and units in `app/src/repositories/learning-path-repository.ts`
- [x] T016 [P] Implement repository queries for mentorship requests in `app/src/repositories/mentorship-repository.ts`
- [x] T017 Create shared API error and response helpers in `app/src/lib/api-errors.ts` and `app/src/lib/api-response.ts`
- [x] T018 Update global app shell and role-aware navigation scaffolding in `app/src/app/layout.tsx` and `app/src/components/layout/TopBar.tsx`

**Checkpoint**: Foundation complete. User stories can now proceed.

---

## Phase 3: User Story 1 - Learner Onboarding (Priority: P1) 🎯 MVP

**Goal**: Let a learner complete login, age level confirmation, program selection, assessment, and path creation to reach dashboard access.

**Independent Test**: A learner can complete onboarding end-to-end and see unlocked units on first dashboard load.

### Tests for User Story 1

- [x] T019 [P] [US1] Add contract tests for onboarding and assessment start/submit endpoints in `app/tests/contract/us1-onboarding-assessment.contract.test.ts`
- [x] T020 [P] [US1] Add integration test for onboarding state transitions in `app/tests/integration/us1-onboarding-flow.integration.test.ts`
- [x] T021 [P] [US1] Add E2E onboarding happy-path test in `app/tests/e2e/us1-onboarding.spec.ts`

### Implementation for User Story 1

- [x] T022 [P] [US1] Implement onboarding service state machine in `app/src/services/onboarding-service.ts`
- [x] T023 [P] [US1] Implement assessment session orchestration in `app/src/services/assessment-service.ts`
- [x] T024 [P] [US1] Implement personalization pipeline with deterministic overrides in `app/src/services/personalization-service.ts`
- [x] T025 [US1] Implement learning path generation service used at onboarding completion in `app/src/services/learning-path-service.ts`
- [x] T026 [US1] Implement `POST /api/onboarding` route handler in `app/src/app/api/onboarding/route.ts`
- [x] T027 [US1] Implement `POST /api/assessment/start` route handler in `app/src/app/api/assessment/start/route.ts`
- [x] T028 [US1] Implement `POST /api/assessment/submit` route handler in `app/src/app/api/assessment/submit/route.ts`
- [x] T029 [P] [US1] Build sign-in page for onboarding entry in `app/src/app/(auth)/sign-in/page.tsx`
- [x] T030 [P] [US1] Build age-level step page in `app/src/app/(auth)/onboarding/age-level/page.tsx` and `app/src/components/onboarding/AgeLevelStep.tsx`
- [x] T031 [P] [US1] Build program selection step page in `app/src/app/(auth)/onboarding/program/page.tsx` and `app/src/components/onboarding/ProgramSelectionStep.tsx`
- [x] T032 [US1] Build assessment step page with progress UI in `app/src/app/(auth)/onboarding/assessment/page.tsx` and `app/src/components/assessment/AssessmentRunner.tsx`
- [x] T033 [US1] Build personalization feedback page in `app/src/app/(auth)/onboarding/feedback/page.tsx` and `app/src/components/assessment/PersonalizationFeedback.tsx`
- [x] T034 [US1] Implement assessment client state hook in `app/src/hooks/useAssessmentSession.ts`
- [x] T035 [US1] Add learner onboarding resume and transition guards in `app/src/lib/auth/onboarding-guards.ts`
- [x] T036 [US1] Add adaptation decision logging during onboarding in `app/src/services/personalization-service.ts` and `app/src/repositories/assessment-repository.ts`

**Checkpoint**: User Story 1 independently works from sign-in through personalized path creation.

---

## Phase 4: User Story 2 - Personalized Learning Experience (Priority: P1)

**Goal**: Enable learners to view personalized units, start unit work, submit project progress, and receive adaptive path updates.

**Independent Test**: A learner can open personalized track, complete unit interactions, and observe path updates based on progress.

### Tests for User Story 2

- [x] T037 [P] [US2] Add contract tests for learning path and unit progress endpoints in `app/tests/contract/us2-learning-path.contract.test.ts`
- [x] T038 [P] [US2] Add integration tests for prerequisite enforcement and state transitions in `app/tests/integration/us2-learning-path.integration.test.ts`
- [x] T039 [P] [US2] Add E2E test for learner unit progression in `app/tests/e2e/us2-learning-experience.spec.ts`

### Implementation for User Story 2

- [x] T040 [US2] Implement `GET /api/learning-path` route handler in `app/src/app/api/learning-path/route.ts`
- [x] T041 [US2] Implement `PATCH /api/units/[unitId]` route handler in `app/src/app/api/units/[unitId]/route.ts`
- [x] T042 [P] [US2] Implement learning path query/transform logic in `app/src/services/learning-path-service.ts`
- [x] T043 [P] [US2] Implement unit progress update logic with prerequisite checks in `app/src/services/learning-path-service.ts`
- [x] T044 [P] [US2] Build learner dashboard page and aggregate widgets in `app/src/app/(learner)/dashboard/page.tsx` and `app/src/components/dashboards/LearnerDashboard.tsx`
- [x] T045 [P] [US2] Build first learning track page in `app/src/app/(learner)/track/page.tsx` and `app/src/components/learning-path/LearningPathTimeline.tsx`
- [x] T046 [US2] Build unit detail page in `app/src/app/(learner)/unit/[unitId]/page.tsx` and `app/src/components/learning-path/UnitDetailPanel.tsx`
- [x] T047 [US2] Implement learner learning-path hook for fetch/update operations in `app/src/hooks/useLearningPath.ts`
- [x] T048 [US2] Add project submission and reflection UI controls in `app/src/components/learning-path/UnitProgressActions.tsx`
- [x] T049 [US2] Add adaptive refresh trigger after performance updates in `app/src/services/personalization-service.ts` and `app/src/services/learning-path-service.ts`

**Checkpoint**: User Story 2 independently supports end-to-end learner progression through personalized units.

---

## Phase 5: User Story 3 - Educator Supervision (Priority: P2)

**Goal**: Provide educator analytics and intervention actions to monitor and support learners.

**Independent Test**: An educator can view cohort analytics and perform intervention actions for a selected learner.

### Tests for User Story 3

- [ ] T050 [P] [US3] Add contract tests for educator dashboard endpoint in `app/tests/contract/us3-educator-dashboard.contract.test.ts`
- [ ] T051 [P] [US3] Add integration tests for educator authorization and intervention data in `app/tests/integration/us3-educator-dashboard.integration.test.ts`
- [ ] T052 [P] [US3] Add E2E educator supervision flow test in `app/tests/e2e/us3-educator-supervision.spec.ts`

### Implementation for User Story 3

- [ ] T053 [P] [US3] Implement educator dashboard aggregation service in `app/src/services/dashboard-service.ts`
- [ ] T054 [US3] Implement `GET /api/dashboard/educator` route handler in `app/src/app/api/dashboard/educator/route.ts`
- [ ] T055 [P] [US3] Build educator dashboard page in `app/src/app/(educator)/dashboard/page.tsx`
- [ ] T056 [US3] Build cohort analytics and intervention queue components in `app/src/components/dashboards/EducatorCohortAnalytics.tsx` and `app/src/components/dashboards/InterventionQueue.tsx`
- [ ] T057 [US3] Add adaptation history panel for transparency in `app/src/components/dashboards/AdaptationDecisionLog.tsx`

**Checkpoint**: User Story 3 independently enables educator monitoring and intervention workflows.

---

## Phase 6: User Story 4 - Parent Monitoring (Priority: P2)

**Goal**: Allow parents to view high-level learner milestones, engagement, and progress safely.

**Independent Test**: A parent can log in and view linked child progress without access to educator/learner-only controls.

### Tests for User Story 4

- [ ] T058 [P] [US4] Add contract tests for parent dashboard endpoint in `app/tests/contract/us4-parent-dashboard.contract.test.ts`
- [ ] T059 [P] [US4] Add integration tests for parent-child link filtering in `app/tests/integration/us4-parent-dashboard.integration.test.ts`
- [ ] T060 [P] [US4] Add E2E parent monitoring flow test in `app/tests/e2e/us4-parent-monitoring.spec.ts`

### Implementation for User Story 4

- [ ] T061 [P] [US4] Implement parent dashboard aggregate queries in `app/src/services/dashboard-service.ts` and `app/src/repositories/learner-repository.ts`
- [ ] T062 [US4] Implement `GET /api/dashboard/parent` route handler in `app/src/app/api/dashboard/parent/route.ts`
- [ ] T063 [P] [US4] Build parent dashboard page in `app/src/app/(parent)/dashboard/page.tsx`
- [ ] T064 [US4] Build child milestones and engagement widgets in `app/src/components/dashboards/ParentChildProgress.tsx`
- [ ] T065 [US4] Add parent access guard for linked learners only in `app/src/lib/auth/guards.ts`

**Checkpoint**: User Story 4 independently provides secure parent-facing progress visibility.

---

## Phase 7: User Story 5 - Community and Mentorship (Priority: P3)

**Goal**: Support mentorship request flows and community participation hooks for collaborative learning.

**Independent Test**: A learner can create mentorship requests, see status updates, and interact with community-oriented UI entry points.

### Tests for User Story 5

- [ ] T066 [P] [US5] Add contract tests for mentorship request endpoint in `app/tests/contract/us5-mentorship.contract.test.ts`
- [ ] T067 [P] [US5] Add integration tests for mentorship lifecycle transitions in `app/tests/integration/us5-mentorship.integration.test.ts`
- [ ] T068 [P] [US5] Add E2E mentorship request flow test in `app/tests/e2e/us5-community-mentorship.spec.ts`

### Implementation for User Story 5

- [ ] T069 [P] [US5] Implement mentorship domain service in `app/src/services/mentorship-service.ts`
- [ ] T070 [US5] Implement `POST /api/mentorship/requests` route handler in `app/src/app/api/mentorship/requests/route.ts`
- [ ] T071 [P] [US5] Build mentorship request UI components in `app/src/components/mentorship/MentorshipRequestForm.tsx` and `app/src/components/mentorship/MentorshipStatusCard.tsx`
- [ ] T072 [US5] Implement mentorship client hook in `app/src/hooks/useMentorship.ts`
- [ ] T073 [US5] Add learner community entry section and mentors list teaser in `app/src/app/(learner)/dashboard/page.tsx` and `app/src/components/mentorship/CommunityPanel.tsx`

**Checkpoint**: User Story 5 independently enables on-demand mentorship and community participation entry points.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, performance, UX quality, and documentation consistency across all stories.

- [ ] T074 [P] Align public marketing pages and education-first copy in `app/src/app/page.tsx`, `app/src/app/(public)/about/page.tsx`, and `app/src/app/(public)/contact/page.tsx`
- [ ] T075 [P] Implement authenticated/public tracks page behavior and redirect logic in `app/src/app/(public)/tracks/page.tsx`
- [ ] T076 Improve global style tokens and responsive readability in `app/src/app/globals.css`
- [ ] T077 [P] Add API route rate-limit and request-size protections in `app/src/lib/auth/guards.ts` and `app/src/lib/api-errors.ts`
- [ ] T078 [P] Add performance-oriented query indexes and verify migrations in `app/prisma/schema.prisma` and `app/prisma/migrations/`
- [ ] T079 Run full quickstart validation and update docs in `specs/1-learning-platform/quickstart.md`
- [ ] T080 Execute full test suite and record baseline results in `app/tests/TEST_RESULTS.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): no dependencies.
- Foundational (Phase 2): depends on Setup and blocks all stories.
- User Story phases (Phase 3-7): all depend on Foundational completion.
- Polish (Phase 8): depends on completion of all target user stories.

### User Story Dependencies

- US1 (P1): starts immediately after Foundational; no dependency on other user stories.
- US2 (P1): starts after Foundational; depends on US1 onboarding outputs (active learner path).
- US3 (P2): starts after Foundational; can run in parallel with US2 once shared dashboard service contracts are stable.
- US4 (P2): starts after Foundational; can run in parallel with US3.
- US5 (P3): starts after Foundational; best after US2 learner dashboard is available for mentorship entry points.

### Within Each User Story

- Tests first and expected to fail before implementation.
- Services/repositories before route handlers.
- Route handlers before page integration.
- Hooks/components after endpoint contracts are stable.

## Parallel Opportunities

- Setup: T003, T004, T005 can run in parallel after T001-T002.
- Foundational: T008, T009, T011, T012, T014, T015, T016 are parallelizable once schema direction is fixed.
- US1: T022-T024 and T029-T031 can run in parallel; merge at T032-T036.
- US2: T042-T045 can run in parallel; merge at T046-T049.
- US3: T053 and T055 can run in parallel before finishing T056-T057.
- US4: T061 and T063 can run in parallel before T064-T065.
- US5: T069 and T071 can run in parallel before T072-T073.

---

## Parallel Example: User Story 1

```bash
# Parallel tests
Task T019: app/tests/contract/us1-onboarding-assessment.contract.test.ts
Task T020: app/tests/integration/us1-onboarding-flow.integration.test.ts
Task T021: app/tests/e2e/us1-onboarding.spec.ts

# Parallel implementation
Task T022: app/src/services/onboarding-service.ts
Task T023: app/src/services/assessment-service.ts
Task T024: app/src/services/personalization-service.ts
Task T029: app/src/app/(auth)/sign-in/page.tsx
Task T030: app/src/app/(auth)/onboarding/age-level/page.tsx
Task T031: app/src/app/(auth)/onboarding/program/page.tsx
```

## Parallel Example: User Story 2

```bash
# Parallel tests
Task T037: app/tests/contract/us2-learning-path.contract.test.ts
Task T038: app/tests/integration/us2-learning-path.integration.test.ts
Task T039: app/tests/e2e/us2-learning-experience.spec.ts

# Parallel implementation
Task T042: app/src/services/learning-path-service.ts
Task T043: app/src/services/learning-path-service.ts
Task T044: app/src/app/(learner)/dashboard/page.tsx
Task T045: app/src/app/(learner)/track/page.tsx
```

## Parallel Example: User Story 3

```bash
# Parallel tests
Task T050: app/tests/contract/us3-educator-dashboard.contract.test.ts
Task T051: app/tests/integration/us3-educator-dashboard.integration.test.ts
Task T052: app/tests/e2e/us3-educator-supervision.spec.ts

# Parallel implementation
Task T053: app/src/services/dashboard-service.ts
Task T055: app/src/app/(educator)/dashboard/page.tsx
```

## Parallel Example: User Story 4

```bash
# Parallel tests
Task T058: app/tests/contract/us4-parent-dashboard.contract.test.ts
Task T059: app/tests/integration/us4-parent-dashboard.integration.test.ts
Task T060: app/tests/e2e/us4-parent-monitoring.spec.ts

# Parallel implementation
Task T061: app/src/services/dashboard-service.ts
Task T063: app/src/app/(parent)/dashboard/page.tsx
```

## Parallel Example: User Story 5

```bash
# Parallel tests
Task T066: app/tests/contract/us5-mentorship.contract.test.ts
Task T067: app/tests/integration/us5-mentorship.integration.test.ts
Task T068: app/tests/e2e/us5-community-mentorship.spec.ts

# Parallel implementation
Task T069: app/src/services/mentorship-service.ts
Task T071: app/src/components/mentorship/MentorshipRequestForm.tsx
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate onboarding end-to-end before expanding scope.

### Incremental Delivery

1. Deliver US1 as MVP.
2. Add US2 for core learner value.
3. Add US3 and US4 for supervision visibility.
4. Add US5 for mentorship/community enhancements.
5. Finish with Phase 8 hardening and performance checks.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. After foundation:
   - Engineer A: US1/US2 backend services and APIs.
   - Engineer B: US1/US2 frontend pages and hooks.
   - Engineer C: US3/US4 dashboards.
   - Engineer D: US5 mentorship + cross-cutting tests.

---

## Delivered Addendum: Authentication Hardening & E2E CI (2026-04-06)

**Goal**: Secure onboarding entry with password auth, handle existing-account UX, and validate with E2E in CI.

- [x] T081 [US1] Add password hash persistence field to `app/prisma/schema.prisma`
- [x] T082 [US1] Add password hash migration in `app/prisma/migrations/20260406110000_add_user_password_hash/migration.sql`
- [x] T083 [US1] Implement password hash/verify helper in `app/src/lib/auth/password.ts`
- [x] T084 [US1] Add auth request schemas in `app/src/lib/validation/auth.ts`
- [x] T085 [US1] Implement `POST /api/auth/check-email` in `app/src/app/api/auth/check-email/route.ts`
- [x] T086 [US1] Implement `POST /api/auth/register` in `app/src/app/api/auth/register/route.ts`
- [x] T087 [US1] Implement `POST /api/auth/login` in `app/src/app/api/auth/login/route.ts`
- [x] T088 [US1] Update sign-in UI with password + register/login modes in `app/src/app/(auth)/sign-in/page.tsx`
- [x] T089 [US1] Add existing-account prompt and login-form CTA in `app/src/app/(auth)/sign-in/page.tsx`
- [x] T090 [US1] Improve API error mapping for auth flows in `app/src/lib/api-errors.ts`
- [x] T091 [US1] Add Playwright E2E test for register then login in `app/tests/e2e/auth-register-login.spec.ts`
- [x] T092 [US1] Add E2E execution step in CI workflow `/.github/workflows/ci.yml`
- [x] T093 [US1] Add Playwright artifact upload step in CI workflow `/.github/workflows/ci.yml`
