import { OnboardingStatus } from "@prisma/client"
import { ApiError } from "@/lib/api-errors"
import { learnerRepository } from "@/repositories/learner-repository"
import type { OnboardingRequestDto } from "@/lib/validation/onboarding"

const onboardingOrder: Record<OnboardingStatus, number> = {
  NOT_STARTED: 0,
  AGE_CONFIRMED: 1,
  PROGRAM_SELECTED: 2,
  ASSESSMENT_IN_PROGRESS: 3,
  COMPLETED: 4,
}

export const onboardingService = {
  async upsertOnboarding(userId: string, dto: OnboardingRequestDto) {
    const existing = await learnerRepository.getLearnerByUserId(userId)

    const existingStatus = existing?.onboardingStatus as OnboardingStatus | undefined

    if (existingStatus && onboardingOrder[existingStatus] >= onboardingOrder[OnboardingStatus.ASSESSMENT_IN_PROGRESS]) {
      throw new ApiError(409, "ONBOARDING_ALREADY_PROGRESSING", "Onboarding cannot be changed after assessment has started.")
    }

    const learnerProfile = await learnerRepository.updateOnboarding(userId, {
      ageLevel: dto.ageLevel,
      programCode: dto.programCode,
      onboardingStatus: OnboardingStatus.PROGRAM_SELECTED,
    })

    return {
      learnerId: learnerProfile.id,
      onboardingStatus: learnerProfile.onboardingStatus,
    }
  },
}
