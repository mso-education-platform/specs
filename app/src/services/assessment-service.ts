import { ApiError } from "@/lib/api-errors"
import { ASSESSMENT_TOTAL_STEPS } from "@/lib/constants/personalization"
import type { AssessmentSubmitDto } from "@/lib/validation/assessment"
import { assessmentRepository } from "@/repositories/assessment-repository"
import { learnerRepository } from "@/repositories/learner-repository"
import { personalizationService } from "@/services/personalization-service"
import { OnboardingStatus } from "@prisma/client"

const questionBank = [
  {
    questionId: "q1",
    prompt: "How comfortable are you with coding basics?",
    promptKey: "assessment.questions.q1.prompt",
    type: "MULTIPLE_CHOICE",
    choices: ["New", "Some practice", "Comfortable"],
    choicesKeys: [
      "assessment.questions.q1.choices.new",
      "assessment.questions.q1.choices.some_practice",
      "assessment.questions.q1.choices.comfortable",
    ],
  },
  {
    questionId: "q2",
    prompt: "How often do you build projects?",
    promptKey: "assessment.questions.q2.prompt",
    type: "MULTIPLE_CHOICE",
    choices: ["Rarely", "Sometimes", "Regularly"],
    choicesKeys: [
      "assessment.questions.q2.choices.rarely",
      "assessment.questions.q2.choices.sometimes",
      "assessment.questions.q2.choices.regularly",
    ],
  },
  { questionId: "q3", prompt: "Describe one learning goal this month.", promptKey: "assessment.questions.q3.prompt", type: "OPEN_TEXT" },
]

function scoreResponse(response: string | number | string[]): number {
  if (typeof response === "number") {
    return Math.min(1, Math.max(0, response / 100))
  }

  if (Array.isArray(response)) {
    return Math.min(1, response.length / 3)
  }

  return response.length > 60 ? 1 : response.length > 20 ? 0.7 : 0.45
}

export const assessmentService = {
  async startAssessment(userId: string) {
    const learner = await learnerRepository.getLearnerByUserId(userId)

    if (!learner?.ageLevel || !learner.selectedProgramId) {
      throw new ApiError(400, "ONBOARDING_INCOMPLETE", "Complete age level and program selection first.")
    }

    const existingSession = await assessmentRepository.findActiveSession(learner.id)
    if (existingSession) {
      throw new ApiError(409, "ACTIVE_SESSION_EXISTS", "An active assessment session already exists.")
    }

    const session = await assessmentRepository.createSession({
      learnerId: learner.id,
      programId: learner.selectedProgramId,
      ageLevel: learner.ageLevel,
    })

    return {
      assessmentSessionId: session.id,
      questions: questionBank,
      progress: {
        currentStep: 1,
        totalSteps: ASSESSMENT_TOTAL_STEPS,
      },
    }
  },

  async submitAssessment(userId: string, dto: AssessmentSubmitDto) {
    const learner = await learnerRepository.getLearnerByUserId(userId)
    if (!learner) {
      throw new ApiError(404, "LEARNER_NOT_FOUND", "Learner profile not found.")
    }

    const session = await assessmentRepository.getSessionById(dto.assessmentSessionId)
    if (!session || session.learnerId !== learner.id) {
      throw new ApiError(404, "ASSESSMENT_SESSION_NOT_FOUND", "Assessment session was not found.")
    }

    const scored = dto.responses.map((item) => ({
      ...item,
      points: scoreResponse(item.response),
    }))

    const scoreTotal = scored.reduce((sum, current) => sum + current.points, 0) / scored.length
    const scoreBreakdown = {
      logic: scoreTotal,
      communication: Math.max(0.2, scoreTotal - 0.1),
      creativity: Math.min(1, scoreTotal + 0.05),
    }

    await assessmentRepository.submitSession({
      assessmentSessionId: dto.assessmentSessionId,
      scoreTotal,
      scoreBreakdown,
      responses: dto.responses,
    })

    const personalization = await personalizationService.personalizeFromAssessment({
      learnerId: learner.id,
      programId: session.programId,
      assessmentSessionId: session.id,
      scoreTotal,
      scoreBreakdown,
    })

    await learnerRepository.setOnboardingStatus(learner.userId, OnboardingStatus.COMPLETED)

    return {
      assessmentSessionId: session.id,
      scoreTotal,
      scoreBreakdown,
      learningPathId: personalization.learningPathId,
      adaptationSummary: personalization.adaptationSummary,
    }
  },
}
