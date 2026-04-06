import { OnboardingStatus } from "@prisma/client"
import { ApiError } from "@/lib/api-errors"

const onboardingOrder: Record<OnboardingStatus, number> = {
  NOT_STARTED: 0,
  AGE_CONFIRMED: 1,
  PROGRAM_SELECTED: 2,
  ASSESSMENT_IN_PROGRESS: 3,
  COMPLETED: 4,
}

export function requireOnboardingStatus(current: OnboardingStatus, required: OnboardingStatus) {
  if (onboardingOrder[current] < onboardingOrder[required]) {
    throw new ApiError(400, "ONBOARDING_STEP_REQUIRED", `Complete onboarding step ${required} first.`)
  }
}

export function getOnboardingResumePath(status: OnboardingStatus) {
  switch (status) {
    case "NOT_STARTED":
    case "AGE_CONFIRMED":
      return "/onboarding/age-level"
    case "PROGRAM_SELECTED":
      return "/onboarding/assessment"
    case "ASSESSMENT_IN_PROGRESS":
      return "/onboarding/assessment"
    case "COMPLETED":
      return "/dashboard"
    default:
      return "/onboarding/age-level"
  }
}
