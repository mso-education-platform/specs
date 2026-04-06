import { describe, expect, it, vi } from "vitest"
import { onboardingService } from "@/services/onboarding-service"
import { learnerRepository } from "@/repositories/learner-repository"

describe("US1 integration: onboarding flow", () => {
  it("moves learner to PROGRAM_SELECTED status", async () => {
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

    updateOnboardingSpy.mockRestore()
  })
})
