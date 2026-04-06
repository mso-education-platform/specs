import { OnboardingStatus } from "@prisma/client"
import { learnerRepository } from "@/repositories/learner-repository"
import type { OnboardingRequestDto } from "@/lib/validation/onboarding"

export const onboardingService = {
  async upsertOnboarding(userId: string, dto: OnboardingRequestDto) {
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
