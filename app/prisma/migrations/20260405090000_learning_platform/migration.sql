-- Create enums
CREATE TYPE "UserRole" AS ENUM ('LEARNER', 'EDUCATOR', 'PARENT', 'MENTOR', 'ADMIN');
CREATE TYPE "AgeLevel" AS ENUM ('A_8_12', 'B_13_18');
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'AGE_CONFIRMED', 'PROGRAM_SELECTED', 'ASSESSMENT_IN_PROGRESS', 'COMPLETED');
CREATE TYPE "ProgramCode" AS ENUM ('WEB_DEV', 'AI_ORIENTED');
CREATE TYPE "UnitDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE "AssessmentStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'SCORED', 'FAILED');
CREATE TYPE "PathStatus" AS ENUM ('ACTIVE', 'SUPERSEDED', 'ARCHIVED');
CREATE TYPE "PathGenerator" AS ENUM ('RULES_ONLY', 'AI_PLUS_RULES');
CREATE TYPE "PathUnitState" AS ENUM ('LOCKED', 'UNLOCKED', 'IN_PROGRESS', 'COMPLETED', 'DEFERRED');
CREATE TYPE "SubmissionStatus" AS ENUM ('NONE', 'SUBMITTED', 'REVIEWED');
CREATE TYPE "DecisionType" AS ENUM ('REINFORCEMENT', 'ACCELERATION', 'STYLE_SWITCH', 'LOGIC_INJECTION', 'MENTOR_SUGGESTION');
CREATE TYPE "DecisionSource" AS ENUM ('RULE', 'AI', 'RULE_OVERRIDE');
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "MentorshipStatus" AS ENUM ('OPEN', 'MATCHED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED');

-- Create tables
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'LEARNER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Program" (
  "id" TEXT NOT NULL,
  "code" "ProgramCode" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "minUnits" INTEGER NOT NULL,
  "maxUnits" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");

CREATE TABLE "LearnerProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "ageLevel" "AgeLevel",
  "selectedProgramId" TEXT,
  "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "engagementScore" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LearnerProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearnerProfile_userId_key" ON "LearnerProfile"("userId");

CREATE TABLE "LearningUnit" (
  "id" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "difficulty" "UnitDifficulty" NOT NULL,
  "estimatedMinutes" INTEGER NOT NULL,
  "isMandatory" BOOLEAN NOT NULL DEFAULT true,
  "orderIndex" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LearningUnit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearningUnit_programId_slug_key" ON "LearningUnit"("programId", "slug");
CREATE UNIQUE INDEX "LearningUnit_programId_orderIndex_key" ON "LearningUnit"("programId", "orderIndex");

CREATE TABLE "UnitPrerequisite" (
  "id" TEXT NOT NULL,
  "unitId" TEXT NOT NULL,
  "prerequisiteUnitId" TEXT NOT NULL,
  CONSTRAINT "UnitPrerequisite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UnitPrerequisite_unitId_prerequisiteUnitId_key" ON "UnitPrerequisite"("unitId", "prerequisiteUnitId");

CREATE TABLE "AssessmentSession" (
  "id" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "ageLevel" "AgeLevel" NOT NULL,
  "status" "AssessmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "submittedAt" TIMESTAMP(3),
  "scoreTotal" DOUBLE PRECISION,
  "scoreBreakdownJson" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AssessmentSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AssessmentSession_learnerId_status_idx" ON "AssessmentSession"("learnerId", "status");

CREATE TABLE "AssessmentResponse" (
  "id" TEXT NOT NULL,
  "assessmentSessionId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "responsePayloadJson" JSONB NOT NULL,
  "awardedPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AssessmentResponse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AssessmentResponse_assessmentSessionId_questionId_key" ON "AssessmentResponse"("assessmentSessionId", "questionId");

CREATE TABLE "LearningPath" (
  "id" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "status" "PathStatus" NOT NULL DEFAULT 'ACTIVE',
  "generatedBy" "PathGenerator" NOT NULL DEFAULT 'RULES_ONLY',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearningPath_learnerId_version_key" ON "LearningPath"("learnerId", "version");

CREATE TABLE "LearningPathUnit" (
  "id" TEXT NOT NULL,
  "learningPathId" TEXT NOT NULL,
  "unitId" TEXT NOT NULL,
  "sequenceIndex" INTEGER NOT NULL,
  "state" "PathUnitState" NOT NULL DEFAULT 'LOCKED',
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "projectSubmissionStatus" "SubmissionStatus" NOT NULL DEFAULT 'NONE',
  "reflectionCompleted" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "LearningPathUnit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearningPathUnit_learningPathId_sequenceIndex_key" ON "LearningPathUnit"("learningPathId", "sequenceIndex");
CREATE UNIQUE INDEX "LearningPathUnit_learningPathId_unitId_key" ON "LearningPathUnit"("learningPathId", "unitId");
CREATE INDEX "LearningPathUnit_learningPathId_sequenceIndex_idx" ON "LearningPathUnit"("learningPathId", "sequenceIndex");

CREATE TABLE "AdaptationDecision" (
  "id" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "assessmentSessionId" TEXT,
  "decisionType" "DecisionType" NOT NULL,
  "source" "DecisionSource" NOT NULL,
  "rationale" TEXT NOT NULL,
  "inputsJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdaptationDecision_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdaptationDecision_learnerId_createdAt_idx" ON "AdaptationDecision"("learnerId", "createdAt");

CREATE TABLE "MentorshipRequest" (
  "id" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "requestedMentorId" TEXT,
  "topic" TEXT NOT NULL,
  "urgency" "Urgency" NOT NULL,
  "status" "MentorshipStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MentorshipRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MentorshipRequest_status_urgency_idx" ON "MentorshipRequest"("status", "urgency");

CREATE TABLE "ParentLearnerLink" (
  "id" TEXT NOT NULL,
  "parentUserId" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "relationshipType" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ParentLearnerLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ParentLearnerLink_parentUserId_learnerId_key" ON "ParentLearnerLink"("parentUserId", "learnerId");

-- Foreign keys
ALTER TABLE "LearnerProfile" ADD CONSTRAINT "LearnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearnerProfile" ADD CONSTRAINT "LearnerProfile_selectedProgramId_fkey" FOREIGN KEY ("selectedProgramId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LearningUnit" ADD CONSTRAINT "LearningUnit_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UnitPrerequisite" ADD CONSTRAINT "UnitPrerequisite_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UnitPrerequisite" ADD CONSTRAINT "UnitPrerequisite_prerequisiteUnitId_fkey" FOREIGN KEY ("prerequisiteUnitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_assessmentSessionId_fkey" FOREIGN KEY ("assessmentSessionId") REFERENCES "AssessmentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningPathUnit" ADD CONSTRAINT "LearningPathUnit_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningPathUnit" ADD CONSTRAINT "LearningPathUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdaptationDecision" ADD CONSTRAINT "AdaptationDecision_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdaptationDecision" ADD CONSTRAINT "AdaptationDecision_assessmentSessionId_fkey" FOREIGN KEY ("assessmentSessionId") REFERENCES "AssessmentSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_requestedMentorId_fkey" FOREIGN KEY ("requestedMentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ParentLearnerLink" ADD CONSTRAINT "ParentLearnerLink_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentLearnerLink" ADD CONSTRAINT "ParentLearnerLink_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
