import { OnboardingStatus } from "@prisma/client"
import { ApiError } from "@/lib/api-errors"
import { learnerRepository } from "@/repositories/learner-repository"
import type { OnboardingRequestDto } from "@/lib/validation/onboarding"
import { learningPathService } from "@/services/learning-path-service"

const onboardingOrder: Record<OnboardingStatus, number> = {
  NOT_STARTED: 0,
  AGE_CONFIRMED: 1,
  PROGRAM_SELECTED: 2,
  ASSESSMENT_IN_PROGRESS: 3,
  COMPLETED: 4,
}

export const onboardingService = {
  async upsertOnboarding(userId: string, dto: OnboardingRequestDto, identity?: { email?: string; name?: string }) {
    const ensuredUser = await learnerRepository.ensureLearnerUser({
      userId,
      email: identity?.email,
      name: identity?.name,
    })

    const effectiveUserId = ensuredUser.id

    const existing = await learnerRepository.getLearnerByUserId(effectiveUserId)

    const existingStatus = existing?.onboardingStatus as OnboardingStatus | undefined

    if (existingStatus && onboardingOrder[existingStatus] >= onboardingOrder[OnboardingStatus.ASSESSMENT_IN_PROGRESS]) {
      throw new ApiError(409, "ONBOARDING_ALREADY_PROGRESSING", "Onboarding cannot be changed after assessment has started.")
    }

    const learnerProfile = await learnerRepository.updateOnboarding(effectiveUserId, {
      ageLevel: dto.ageLevel,
      programCode: dto.programCode,
      onboardingStatus: OnboardingStatus.PROGRAM_SELECTED,
    })

    // If a program was selected, generate an initial learning path for the learner
    if (learnerProfile.selectedProgram?.id) {
      try {
        await learningPathService.generateInitialPath(learnerProfile.id, learnerProfile.selectedProgram.id)
      } catch (err) {
        // Do not fail onboarding if path generation fails; surface minimal info.
        // The client can retry or show a friendly message.
        // eslint-disable-next-line no-console
        console.warn("Could not generate initial learning path:", err)
      }
    }

    return {
      learnerId: learnerProfile.id,
      onboardingStatus: learnerProfile.onboardingStatus,
      canonicalUserId: effectiveUserId,
    }
  },
}
