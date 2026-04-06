import { AssessmentStatus, DecisionSource, DecisionType, Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

type ResponseItem = {
  questionId: string
  response: string | number | string[]
}

export const assessmentRepository = {
  async findActiveSession(learnerId: string) {
    return prisma.assessmentSession.findFirst({
      where: { learnerId, status: AssessmentStatus.IN_PROGRESS },
      orderBy: { createdAt: "desc" },
    })
  },

  async createSession(input: { learnerId: string; programId: string; ageLevel: "A_8_12" | "B_13_18" }) {
    return prisma.assessmentSession.create({
      data: {
        learnerId: input.learnerId,
        programId: input.programId,
        ageLevel: input.ageLevel,
        status: AssessmentStatus.IN_PROGRESS,
      },
    })
  },

  async submitSession(input: {
    assessmentSessionId: string
    scoreTotal: number
    scoreBreakdown: Record<string, number>
    responses: ResponseItem[]
  }) {
    await prisma.assessmentResponse.createMany({
      data: input.responses.map((item) => ({
        assessmentSessionId: input.assessmentSessionId,
        questionId: item.questionId,
        responsePayloadJson: { value: item.response },
        awardedPoints: typeof item.response === "number" ? Number(item.response) : 1,
      })),
      skipDuplicates: true,
    })

    return prisma.assessmentSession.update({
      where: { id: input.assessmentSessionId },
      data: {
        status: AssessmentStatus.SCORED,
        submittedAt: new Date(),
        scoreTotal: input.scoreTotal,
        scoreBreakdownJson: input.scoreBreakdown,
      },
    })
  },

  async logAdaptationDecision(input: {
    learnerId: string
    assessmentSessionId?: string
    decisionType: DecisionType
    source: DecisionSource
    rationale: string
    inputs: Record<string, unknown>
  }) {
    return prisma.adaptationDecision.create({
      data: {
        learnerId: input.learnerId,
        assessmentSessionId: input.assessmentSessionId,
        decisionType: input.decisionType,
        source: input.source,
        rationale: input.rationale,
        inputsJson: input.inputs as unknown as Prisma.InputJsonValue,
      },
    })
  },

  async getSessionById(sessionId: string) {
    return prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      include: {
        learner: {
          include: {
            selectedProgram: true,
            user: true,
          },
        },
      },
    })
  },
}
