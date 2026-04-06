import { describe, expect, it } from "vitest"
import { educatorDashboardResponseSchema } from "@/lib/validation/dashboard"

describe("US3 contract: educator dashboard", () => {
  it("accepts valid educator dashboard payload", () => {
    const payload = educatorDashboardResponseSchema.parse({
      cohortSummary: {
        totalLearners: 24,
        activeLearners: 17,
        completedOnboarding: 19,
        onboardingCompletionRate: 79.2,
        averageEngagementScore: 68.4,
        averagePathCompletionRate: 43.5,
      },
      interventionQueue: [
        {
          learnerId: "550e8400-e29b-41d4-a716-446655440100",
          learnerName: "Learner One",
          programCode: "WEB_DEV",
          riskLevel: "HIGH",
          reason: "Onboarding is incomplete and requires intervention.",
          openMentorshipRequests: 1,
          completionRate: 0,
        },
      ],
      adaptationHistory: [
        {
          id: "550e8400-e29b-41d4-a716-446655440200",
          learnerId: "550e8400-e29b-41d4-a716-446655440100",
          learnerName: "Learner One",
          decisionType: "REINFORCEMENT",
          source: "RULE",
          rationale: "Strengthen HTML foundations before moving to CSS.",
          createdAt: new Date().toISOString(),
        },
      ],
    })

    expect(payload.interventionQueue[0].riskLevel).toBe("HIGH")
    expect(payload.cohortSummary.totalLearners).toBeGreaterThan(0)
  })

  it("rejects malformed educator dashboard payload", () => {
    expect(() =>
      educatorDashboardResponseSchema.parse({
        cohortSummary: {
          totalLearners: -1,
          activeLearners: 0,
          completedOnboarding: 0,
          onboardingCompletionRate: 0,
          averageEngagementScore: 0,
          averagePathCompletionRate: 0,
        },
        interventionQueue: [],
        adaptationHistory: [],
      }),
    ).toThrow()
  })
})
