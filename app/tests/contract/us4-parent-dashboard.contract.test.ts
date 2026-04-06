import { describe, expect, it } from "vitest"
import { parentDashboardResponseSchema } from "@/lib/validation/dashboard"

describe("US4 contract: parent dashboard", () => {
  it("accepts valid parent dashboard payload", () => {
    const payload = parentDashboardResponseSchema.parse({
      children: [
        {
          learnerId: "550e8400-e29b-41d4-a716-446655440111",
          learnerName: "Child One",
          milestones: ["Onboarding completed", "2 unit(s) completed"],
          engagement: {
            score: 72,
            level: "HIGH",
            pathCompletionRate: 50,
            activeUnits: 1,
            completedUnits: 2,
          },
        },
      ],
    })

    expect(payload.children).toHaveLength(1)
    expect(payload.children[0].engagement.level).toBe("HIGH")
  })

  it("rejects malformed parent dashboard payload", () => {
    expect(() =>
      parentDashboardResponseSchema.parse({
        children: [
          {
            learnerId: "learner-1",
            learnerName: "Child One",
            milestones: [],
            engagement: {
              score: 130,
              level: "HIGH",
              pathCompletionRate: 50,
              activeUnits: 0,
              completedUnits: 0,
            },
          },
        ],
      }),
    ).toThrow()
  })
})
