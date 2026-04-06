# Data Model: Learning Platform

## Modeling Principles

- Keep learner progression and adaptation auditable.
- Separate catalog entities (programs, units) from learner runtime entities (sessions, progress, paths).
- Use enums for critical states to avoid ambiguous string values.

## Entities

## 1. User

Purpose: Shared identity for learner, educator, parent, and mentor roles.

Fields:
- id: string (UUID)
- email: string (unique)
- name: string
- role: enum `UserRole` (`LEARNER`, `EDUCATOR`, `PARENT`, `MENTOR`, `ADMIN`)
- createdAt: datetime
- updatedAt: datetime

Validation rules:
- email must be valid format.
- role is mandatory.

## 2. LearnerProfile

Purpose: Learner-specific data and onboarding status.

Fields:
- id: string (UUID)
- userId: string (FK -> User.id, unique)
- ageLevel: enum `AgeLevel` (`A_8_12`, `B_13_18`)
- selectedProgramId: string (FK -> Program.id, nullable until chosen)
- onboardingStatus: enum `OnboardingStatus` (`NOT_STARTED`, `AGE_CONFIRMED`, `PROGRAM_SELECTED`, `ASSESSMENT_IN_PROGRESS`, `COMPLETED`)
- engagementScore: number (0-100)
- createdAt: datetime
- updatedAt: datetime

Validation rules:
- selectedProgramId required when onboardingStatus >= `PROGRAM_SELECTED`.
- ageLevel immutable after assessment completion unless educator/admin override.

## 3. Program

Purpose: Learning track definition.

Fields:
- id: string (UUID)
- code: enum `ProgramCode` (`WEB_DEV`, `AI_ORIENTED`)
- title: string
- description: string
- minUnits: integer
- maxUnits: integer
- isActive: boolean
- createdAt: datetime
- updatedAt: datetime

Validation rules:
- code unique.
- `WEB_DEV` should map to exactly 10 catalog units for baseline release.
- `AI_ORIENTED` supports 8-12 units.

## 4. LearningUnit

Purpose: Catalog unit metadata with prerequisites and pedagogical content descriptors.

Fields:
- id: string (UUID)
- programId: string (FK -> Program.id)
- slug: string (unique per program)
- title: string
- objective: string
- difficulty: enum `UnitDifficulty` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`)
- estimatedMinutes: integer
- isMandatory: boolean
- orderIndex: integer
- createdAt: datetime
- updatedAt: datetime

Validation rules:
- orderIndex unique per program.
- estimatedMinutes > 0.

## 5. UnitPrerequisite

Purpose: Directed relation between units.

Fields:
- id: string (UUID)
- unitId: string (FK -> LearningUnit.id)
- prerequisiteUnitId: string (FK -> LearningUnit.id)

Validation rules:
- disallow self-dependency.
- graph cycle detection at write-time and in seed validation.

## 6. AssessmentSession

Purpose: Tracks initial assessment lifecycle and responses.

Fields:
- id: string (UUID)
- learnerId: string (FK -> LearnerProfile.id)
- programId: string (FK -> Program.id)
- ageLevel: enum `AgeLevel`
- status: enum `AssessmentStatus` (`NOT_STARTED`, `IN_PROGRESS`, `SUBMITTED`, `SCORED`, `FAILED`)
- startedAt: datetime
- submittedAt: datetime (nullable)
- scoreTotal: number (nullable)
- scoreBreakdownJson: jsonb
- createdAt: datetime
- updatedAt: datetime

Validation rules:
- only one active `IN_PROGRESS` session per learner.
- `submittedAt` required when status >= `SUBMITTED`.

## 7. AssessmentResponse

Purpose: Per-question learner response storage.

Fields:
- id: string (UUID)
- assessmentSessionId: string (FK -> AssessmentSession.id)
- questionId: string
- responsePayloadJson: jsonb
- awardedPoints: number
- createdAt: datetime

Validation rules:
- unique(questionId, assessmentSessionId).
- awardedPoints >= 0.

## 8. LearningPath

Purpose: Personalized pathway container for a learner.

Fields:
- id: string (UUID)
- learnerId: string (FK -> LearnerProfile.id)
- programId: string (FK -> Program.id)
- version: integer
- status: enum `PathStatus` (`ACTIVE`, `SUPERSEDED`, `ARCHIVED`)
- generatedBy: enum `PathGenerator` (`RULES_ONLY`, `AI_PLUS_RULES`)
- createdAt: datetime

Validation rules:
- one ACTIVE path per learner.
- version increments monotonically per learner.

## 9. LearningPathUnit

Purpose: Ordered units and unlock/progress state within a path.

Fields:
- id: string (UUID)
- learningPathId: string (FK -> LearningPath.id)
- unitId: string (FK -> LearningUnit.id)
- sequenceIndex: integer
- state: enum `PathUnitState` (`LOCKED`, `UNLOCKED`, `IN_PROGRESS`, `COMPLETED`, `DEFERRED`)
- startedAt: datetime (nullable)
- completedAt: datetime (nullable)
- projectSubmissionStatus: enum `SubmissionStatus` (`NONE`, `SUBMITTED`, `REVIEWED`)
- reflectionCompleted: boolean

Validation rules:
- sequenceIndex unique per learningPathId.
- completedAt required when state is `COMPLETED`.

## 10. AdaptationDecision

Purpose: Transparency and audit log for personalization decisions.

Fields:
- id: string (UUID)
- learnerId: string (FK -> LearnerProfile.id)
- assessmentSessionId: string (FK -> AssessmentSession.id, nullable)
- decisionType: enum `DecisionType` (`REINFORCEMENT`, `ACCELERATION`, `STYLE_SWITCH`, `LOGIC_INJECTION`, `MENTOR_SUGGESTION`)
- source: enum `DecisionSource` (`RULE`, `AI`, `RULE_OVERRIDE`)
- rationale: string
- inputsJson: jsonb
- createdAt: datetime

Validation rules:
- rationale required and non-empty.
- source `RULE_OVERRIDE` must reference prior AI signal in inputsJson.

## 11. MentorshipRequest

Purpose: On-demand mentorship workflow.

Fields:
- id: string (UUID)
- learnerId: string (FK -> LearnerProfile.id)
- requestedMentorId: string (FK -> User.id, nullable)
- topic: string
- urgency: enum `Urgency` (`LOW`, `MEDIUM`, `HIGH`)
- status: enum `MentorshipStatus` (`OPEN`, `MATCHED`, `IN_PROGRESS`, `CLOSED`, `CANCELLED`)
- createdAt: datetime
- updatedAt: datetime

Validation rules:
- topic required.
- only learner can create own request; educator/admin can reassign.

## 12. ParentLearnerLink

Purpose: Connect parent accounts to learners.

Fields:
- id: string (UUID)
- parentUserId: string (FK -> User.id)
- learnerId: string (FK -> LearnerProfile.id)
- relationshipType: string
- createdAt: datetime

Validation rules:
- unique(parentUserId, learnerId).

## Relationships

- User 1:1 LearnerProfile (for learner role)
- Program 1:N LearningUnit
- LearningUnit N:N LearningUnit (via UnitPrerequisite)
- LearnerProfile 1:N AssessmentSession
- AssessmentSession 1:N AssessmentResponse
- LearnerProfile 1:N LearningPath
- LearningPath 1:N LearningPathUnit
- LearnerProfile 1:N AdaptationDecision
- LearnerProfile 1:N MentorshipRequest
- User (parent) N:N LearnerProfile (via ParentLearnerLink)

## State Transitions

## OnboardingStatus
- `NOT_STARTED` -> `AGE_CONFIRMED` -> `PROGRAM_SELECTED` -> `ASSESSMENT_IN_PROGRESS` -> `COMPLETED`
- Recovery transition: any non-terminal state can resume to itself after interruption.

## AssessmentStatus
- `NOT_STARTED` -> `IN_PROGRESS` -> `SUBMITTED` -> `SCORED`
- Error transition: `IN_PROGRESS`/`SUBMITTED` -> `FAILED` (with retry creating new session version).

## PathUnitState
- `LOCKED` -> `UNLOCKED` -> `IN_PROGRESS` -> `COMPLETED`
- Optional transitions: `UNLOCKED` -> `DEFERRED`, `DEFERRED` -> `UNLOCKED`.

## MentorshipStatus
- `OPEN` -> `MATCHED` -> `IN_PROGRESS` -> `CLOSED`
- Cancellation: `OPEN`/`MATCHED` -> `CANCELLED`.

## Suggested Prisma Additions

- Add composite indexes:
  - `(learnerId, status)` on `AssessmentSession`
  - `(learningPathId, sequenceIndex)` on `LearningPathUnit`
  - `(learnerId, createdAt)` on `AdaptationDecision`
  - `(status, urgency)` on `MentorshipRequest`

- Add soft-delete only where required by policy; default to immutable log records for adaptation events.
