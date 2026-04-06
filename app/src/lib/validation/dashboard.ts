import { z } from "zod"

export const interventionQueueItemSchema = z.object({
  learnerId: z.string(),
  learnerName: z.string(),
  programCode: z.enum(["WEB_DEV", "AI_ORIENTED"]).nullable().optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  reason: z.string(),
  openMentorshipRequests: z.number().int().nonnegative(),
  completionRate: z.number().min(0).max(100),
})

export const adaptationHistoryItemSchema = z.object({
  id: z.string(),
  learnerId: z.string(),
  learnerName: z.string(),
  decisionType: z.string(),
  source: z.string(),
  rationale: z.string(),
  createdAt: z.string(),
})

export const educatorDashboardResponseSchema = z.object({
  cohortSummary: z.object({
    totalLearners: z.number().int().nonnegative(),
    activeLearners: z.number().int().nonnegative(),
    completedOnboarding: z.number().int().nonnegative(),
    onboardingCompletionRate: z.number().min(0).max(100),
    averageEngagementScore: z.number().min(0).max(100),
    averagePathCompletionRate: z.number().min(0).max(100),
  }),
  interventionQueue: z.array(interventionQueueItemSchema),
  adaptationHistory: z.array(adaptationHistoryItemSchema),
})

export type EducatorDashboardResponseDto = z.infer<typeof educatorDashboardResponseSchema>
