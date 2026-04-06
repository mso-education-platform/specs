/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@prisma/client' {
  export const PrismaClient: any
  export type PrismaClient = any
  export const Prisma: any
  export namespace Prisma {
    export type InputJsonValue = any
  }
  export type UserRole = 'LEARNER' | 'EDUCATOR' | 'PARENT' | 'MENTOR' | 'ADMIN'
  export const UserRole: {
    LEARNER: 'LEARNER'
    EDUCATOR: 'EDUCATOR'
    PARENT: 'PARENT'
    MENTOR: 'MENTOR'
    ADMIN: 'ADMIN'
  }

  export type AgeLevel = 'A_8_12' | 'B_13_18'
  export const AgeLevel: {
    A_8_12: 'A_8_12'
    B_13_18: 'B_13_18'
  }

  export type OnboardingStatus = 'NOT_STARTED' | 'AGE_CONFIRMED' | 'PROGRAM_SELECTED' | 'ASSESSMENT_IN_PROGRESS' | 'COMPLETED'
  export const OnboardingStatus: {
    NOT_STARTED: 'NOT_STARTED'
    AGE_CONFIRMED: 'AGE_CONFIRMED'
    PROGRAM_SELECTED: 'PROGRAM_SELECTED'
    ASSESSMENT_IN_PROGRESS: 'ASSESSMENT_IN_PROGRESS'
    COMPLETED: 'COMPLETED'
  }

  export type ProgramCode = 'WEB_DEV' | 'AI_ORIENTED'
  export const ProgramCode: {
    WEB_DEV: 'WEB_DEV'
    AI_ORIENTED: 'AI_ORIENTED'
  }

  export type UnitDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  export const UnitDifficulty: {
    BEGINNER: 'BEGINNER'
    INTERMEDIATE: 'INTERMEDIATE'
    ADVANCED: 'ADVANCED'
  }

  export type AssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'SCORED' | 'FAILED'
  export const AssessmentStatus: {
    NOT_STARTED: 'NOT_STARTED'
    IN_PROGRESS: 'IN_PROGRESS'
    SUBMITTED: 'SUBMITTED'
    SCORED: 'SCORED'
    FAILED: 'FAILED'
  }

  export type PathStatus = 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED'
  export const PathStatus: {
    ACTIVE: 'ACTIVE'
    SUPERSEDED: 'SUPERSEDED'
    ARCHIVED: 'ARCHIVED'
  }

  export type PathGenerator = 'RULES_ONLY' | 'AI_PLUS_RULES'
  export const PathGenerator: {
    RULES_ONLY: 'RULES_ONLY'
    AI_PLUS_RULES: 'AI_PLUS_RULES'
  }

  export type PathUnitState = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED'
  export const PathUnitState: {
    LOCKED: 'LOCKED'
    UNLOCKED: 'UNLOCKED'
    IN_PROGRESS: 'IN_PROGRESS'
    COMPLETED: 'COMPLETED'
    DEFERRED: 'DEFERRED'
  }

  export type SubmissionStatus = 'NONE' | 'SUBMITTED' | 'REVIEWED'
  export const SubmissionStatus: {
    NONE: 'NONE'
    SUBMITTED: 'SUBMITTED'
    REVIEWED: 'REVIEWED'
  }

  export type DecisionType = 'REINFORCEMENT' | 'ACCELERATION' | 'STYLE_SWITCH' | 'LOGIC_INJECTION' | 'MENTOR_SUGGESTION'
  export const DecisionType: {
    REINFORCEMENT: 'REINFORCEMENT'
    ACCELERATION: 'ACCELERATION'
    STYLE_SWITCH: 'STYLE_SWITCH'
    LOGIC_INJECTION: 'LOGIC_INJECTION'
    MENTOR_SUGGESTION: 'MENTOR_SUGGESTION'
  }

  export type DecisionSource = 'RULE' | 'AI' | 'RULE_OVERRIDE'
  export const DecisionSource: {
    RULE: 'RULE'
    AI: 'AI'
    RULE_OVERRIDE: 'RULE_OVERRIDE'
  }

  export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH'
  export const Urgency: {
    LOW: 'LOW'
    MEDIUM: 'MEDIUM'
    HIGH: 'HIGH'
  }

  export type MentorshipStatus = 'OPEN' | 'MATCHED' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED'
  export const MentorshipStatus: {
    OPEN: 'OPEN'
    MATCHED: 'MATCHED'
    IN_PROGRESS: 'IN_PROGRESS'
    CLOSED: 'CLOSED'
    CANCELLED: 'CANCELLED'
  }
}
