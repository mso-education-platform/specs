import { describe, expect, it, vi } from "vitest"
import { OnboardingStatus } from "@prisma/client"
import { onboardingService } from "@/services/onboarding-service"
import { learnerRepository } from "@/repositories/learner-repository"

describe("US1 integration: onboarding flow", () => {
  it("moves learner to PROGRAM_SELECTED status", async () => {
    const getLearnerSpy = vi.spyOn(learnerRepository, "getLearnerByUserId").mockResolvedValue(null)
    const updateOnboardingSpy = vi.spyOn(learnerRepository, "updateOnboarding").mockResolvedValue({
      id: "learner-1",
      onboardingStatus: "PROGRAM_SELECTED",
    } as never)

    const result = await onboardingService.upsertOnboarding("user-1", {
      ageLevel: "A_8_12",
      programCode: "WEB_DEV",
    })

    expect(result.learnerId).toBe("learner-1")
    expect(result.onboardingStatus).toBe("PROGRAM_SELECTED")
    expect(updateOnboardingSpy).toHaveBeenCalledOnce()

    getLearnerSpy.mockRestore()
    updateOnboardingSpy.mockRestore()
  })

  it("blocks onboarding edits once assessment is in progress", async () => {
    const getLearnerSpy = vi.spyOn(learnerRepository, "getLearnerByUserId").mockResolvedValue({
      id: "learner-1",
      onboardingStatus: OnboardingStatus.ASSESSMENT_IN_PROGRESS,
    } as never)

    await expect(
      onboardingService.upsertOnboarding("user-1", {
        ageLevel: "A_8_12",
        programCode: "WEB_DEV",
      }),
    ).rejects.toThrow(/cannot be changed/i)

    getLearnerSpy.mockRestore()
  })
})
