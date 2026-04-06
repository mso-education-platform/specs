import { describe, expect, it, vi } from "vitest"
import { UserRole } from "@prisma/client"
import * as sessionModule from "@/lib/auth/session"
import * as dashboardServiceModule from "@/services/dashboard-service"
import { GET } from "@/app/api/dashboard/educator/route"

describe("US3 integration: educator authorization and intervention data", () => {
  it("returns forbidden for non-educator roles", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "learner-1",
      role: UserRole.LEARNER,
      email: "learner@example.com",
      name: "Learner",
    })

    const response = await GET()
    const payload = await response.json()

    expect(response.status).toBe(403)
    expect(payload.error.code).toBe("FORBIDDEN")

    sessionSpy.mockRestore()
  })

  it("returns intervention data for educator role", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "educator-1",
      role: UserRole.EDUCATOR,
      email: "educator@example.com",
      name: "Educator",
    })

    const dashboardSpy = vi.spyOn(dashboardServiceModule.dashboardService, "getEducatorDashboard").mockResolvedValue({
      cohortSummary: {
        totalLearners: 3,
        activeLearners: 2,
        completedOnboarding: 2,
        onboardingCompletionRate: 66.7,
        averageEngagementScore: 54,
        averagePathCompletionRate: 36,
      },
      interventionQueue: [
        {
          learnerId: "learner-1",
          learnerName: "Sam Learner",
          programCode: "WEB_DEV",
          riskLevel: "MEDIUM",
          reason: "Engagement score is below target range.",
          openMentorshipRequests: 1,
          completionRate: 20,
        },
      ],
      adaptationHistory: [],
    })

    const response = await GET()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.cohortSummary.totalLearners).toBe(3)
    expect(payload.interventionQueue).toHaveLength(1)
    expect(payload.interventionQueue[0].learnerName).toBe("Sam Learner")

    sessionSpy.mockRestore()
    dashboardSpy.mockRestore()
  })
})
