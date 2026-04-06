import { describe, expect, it, vi } from "vitest"
import { UserRole } from "@prisma/client"
import * as sessionModule from "@/lib/auth/session"
import * as dashboardServiceModule from "@/services/dashboard-service"
import { GET } from "@/app/api/dashboard/parent/route"

describe("US4 integration: parent-child link filtering", () => {
  it("returns forbidden for non-parent roles", async () => {
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

  it("returns linked child progress for parent role", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "parent-1",
      role: UserRole.PARENT,
      email: "parent@example.com",
      name: "Parent",
    })

    const dashboardSpy = vi.spyOn(dashboardServiceModule.dashboardService, "getParentDashboard").mockResolvedValue({
      children: [
        {
          learnerId: "learner-1",
          learnerName: "Child One",
          milestones: ["Onboarding completed"],
          engagement: {
            score: 61,
            level: "MEDIUM",
            pathCompletionRate: 33.3,
            activeUnits: 1,
            completedUnits: 1,
          },
        },
      ],
    })

    const response = await GET()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.children).toHaveLength(1)
    expect(payload.children[0].learnerName).toBe("Child One")

    sessionSpy.mockRestore()
    dashboardSpy.mockRestore()
  })

  it("returns parent-link-required when no learners are linked", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "parent-2",
      role: UserRole.PARENT,
      email: "parent2@example.com",
      name: "Parent Two",
    })

    const dashboardSpy = vi.spyOn(dashboardServiceModule.dashboardService, "getParentDashboard").mockResolvedValue({
      children: [],
    })

    const response = await GET()
    const payload = await response.json()

    expect(response.status).toBe(403)
    expect(payload.error.code).toBe("PARENT_LINK_REQUIRED")

    sessionSpy.mockRestore()
    dashboardSpy.mockRestore()
  })
})
