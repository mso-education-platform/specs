import { DecisionSource, DecisionType } from "@prisma/client"
import { SCORE_BANDS } from "@/lib/constants/personalization"
import { assessmentRepository } from "@/repositories/assessment-repository"
import { learningPathService } from "@/services/learning-path-service"

type PersonalizationInput = {
  learnerId: string
  programId: string
  assessmentSessionId: string
  scoreTotal: number
  scoreBreakdown: Record<string, number>
}

export const personalizationService = {
  async personalizeFromAssessment(input: PersonalizationInput) {
    const decisionType =
      input.scoreTotal < SCORE_BANDS.reinforcement
        ? DecisionType.REINFORCEMENT
        : input.scoreTotal > SCORE_BANDS.standard
          ? DecisionType.ACCELERATION
          : DecisionType.STYLE_SWITCH

    const source = input.scoreTotal > SCORE_BANDS.standard ? DecisionSource.AI : DecisionSource.RULE

    await assessmentRepository.logAdaptationDecision({
      learnerId: input.learnerId,
      assessmentSessionId: input.assessmentSessionId,
      decisionType,
      source,
      rationale:
        decisionType === DecisionType.REINFORCEMENT
          ? "Score indicates foundational reinforcement is needed."
          : decisionType === DecisionType.ACCELERATION
            ? "Score indicates readiness for accelerated progression."
            : "Balanced score indicates adaptive pacing with style adjustments.",
      inputs: {
        scoreTotal: input.scoreTotal,
        scoreBreakdown: input.scoreBreakdown,
      },
    })

    const path = await learningPathService.generateInitialPath(input.learnerId, input.programId)

    return {
      learningPathId: path.id,
      adaptationSummary: {
        strengths: Object.keys(input.scoreBreakdown).filter((domain) => input.scoreBreakdown[domain] >= 0.7),
        improvements: Object.keys(input.scoreBreakdown).filter((domain) => input.scoreBreakdown[domain] < 0.7),
      },
    }
  },

  async triggerAdaptiveRefreshFromProgress(input: {
    learnerId: string
    learningPathId: string
    unitId: string
    state: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
    projectSubmissionStatus: "NONE" | "SUBMITTED" | "REVIEWED"
    reflectionCompleted: boolean
  }) {
    if (input.state !== "COMPLETED" && input.projectSubmissionStatus !== "REVIEWED") {
      return { triggered: false }
    }

    const decisionType = input.projectSubmissionStatus === "REVIEWED" ? DecisionType.ACCELERATION : DecisionType.STYLE_SWITCH
    const rationale =
      input.projectSubmissionStatus === "REVIEWED"
        ? "Reviewed project progress indicates readiness for increased challenge."
        : "Completed unit progress indicates learner pacing should be refreshed."

    await assessmentRepository.logAdaptationDecision({
      learnerId: input.learnerId,
      decisionType,
      source: DecisionSource.RULE,
      rationale,
      inputs: {
        trigger: "unit-progress-update",
        learningPathId: input.learningPathId,
        unitId: input.unitId,
        state: input.state,
        projectSubmissionStatus: input.projectSubmissionStatus,
        reflectionCompleted: input.reflectionCompleted,
      },
    })

    return { triggered: true }
  },
}
