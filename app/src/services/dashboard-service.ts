import { MentorshipStatus, OnboardingStatus, PathStatus, PathUnitState } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { EducatorDashboardResponseDto, ParentDashboardResponseDto } from "@/lib/validation/dashboard"
import { learnerRepository } from "@/repositories/learner-repository"

type ParentLinkRecord = Awaited<ReturnType<typeof learnerRepository.getParentLearners>>[number]

type LearnerRecord = {
  id: string
  onboardingStatus: OnboardingStatus
  engagementScore: number
  user: {
    id: string
    name: string
  }
  selectedProgram: {
    code: "WEB_DEV" | "AI_ORIENTED"
  } | null
  learningPaths: Array<{
    units: Array<{
      state: PathUnitState
    }>
  }>
  mentorshipRequests: Array<{
    id: string
  }>
}

type InterventionQueueItem = {
  learnerId: string
  learnerName: string
  programCode: "WEB_DEV" | "AI_ORIENTED" | null
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
  reason: string
  openMentorshipRequests: number
  completionRate: number
}

function toPercent(value: number): number {
  return Number(value.toFixed(1))
}

function clampPercent(value: number): number {
  if (value < 0) {
    return 0
  }

  if (value > 100) {
    return 100
  }

  return value
}

export const dashboardService = {
  async getEducatorDashboard(): Promise<EducatorDashboardResponseDto> {
    const learners = (await prisma.learnerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        selectedProgram: {
          select: {
            code: true,
          },
        },
        learningPaths: {
          where: { status: PathStatus.ACTIVE },
          include: {
            units: {
              select: {
                state: true,
              },
            },
          },
        },
        mentorshipRequests: {
          where: {
            status: {
              in: [MentorshipStatus.OPEN, MentorshipStatus.MATCHED, MentorshipStatus.IN_PROGRESS],
            },
          },
          select: {
            id: true,
          },
        },
      },
    })) as LearnerRecord[]

    const totalLearners = learners.length
    const completedOnboarding = learners.filter(
      (learner: LearnerRecord) => learner.onboardingStatus === OnboardingStatus.COMPLETED,
    ).length

    const pathCompletionRates = learners.map((learner: LearnerRecord) => {
      const activePath = learner.learningPaths[0]
      if (!activePath || activePath.units.length === 0) {
        return 0
      }

      const completedUnits = activePath.units.filter(
        (unit: { state: PathUnitState }) => unit.state === PathUnitState.COMPLETED,
      ).length
      return (completedUnits / activePath.units.length) * 100
    })

    const activeLearners = learners.filter((learner: LearnerRecord) => {
      const hasStartedPath = learner.learningPaths[0]?.units.some(
        (unit: { state: PathUnitState }) =>
          unit.state === PathUnitState.IN_PROGRESS || unit.state === PathUnitState.COMPLETED,
      )

      return learner.onboardingStatus === OnboardingStatus.COMPLETED || hasStartedPath
    }).length

    const averageEngagementScore =
      totalLearners === 0
        ? 0
        : learners.reduce((sum: number, learner: LearnerRecord) => sum + learner.engagementScore, 0) / totalLearners

    const averagePathCompletionRate =
      pathCompletionRates.length === 0
        ? 0
        : pathCompletionRates.reduce((sum: number, rate: number) => sum + rate, 0) / pathCompletionRates.length

    const interventionQueue = learners
      .map((learner: LearnerRecord): InterventionQueueItem | null => {
        const activePath = learner.learningPaths[0]
        const totalUnits = activePath?.units.length ?? 0
        const completedUnits =
          activePath?.units.filter((unit: { state: PathUnitState }) => unit.state === PathUnitState.COMPLETED).length ?? 0
        const completionRate = totalUnits === 0 ? 0 : (completedUnits / totalUnits) * 100
        const openMentorshipRequests = learner.mentorshipRequests.length

        const needsOnboardingSupport = learner.onboardingStatus !== OnboardingStatus.COMPLETED
        const lowEngagement = learner.engagementScore < 40
        const lowCompletion = completionRate < 30

        if (!needsOnboardingSupport && !lowEngagement && !lowCompletion && openMentorshipRequests === 0) {
          return null
        }

        let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW"
        let reason = "Learner requires periodic educator follow-up."

        if (needsOnboardingSupport) {
          riskLevel = "HIGH"
          reason = "Onboarding is incomplete and requires intervention."
        } else if (lowEngagement || openMentorshipRequests > 0) {
          riskLevel = "MEDIUM"
          reason = lowEngagement
            ? "Engagement score is below target range."
            : "Learner has open mentorship requests pending follow-up."
        } else if (lowCompletion) {
          riskLevel = "LOW"
          reason = "Path completion is behind pace; monitor progress."
        }

        return {
          learnerId: learner.id,
          learnerName: learner.user.name,
          programCode: learner.selectedProgram?.code ?? null,
          riskLevel,
          reason,
          openMentorshipRequests,
          completionRate: toPercent(clampPercent(completionRate)),
        }
      })
      .filter((item: InterventionQueueItem | null): item is InterventionQueueItem => item !== null)
      .sort((a: InterventionQueueItem, b: InterventionQueueItem) => {
        const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 }
        return weight[b.riskLevel] - weight[a.riskLevel]
      })

    const adaptationHistory = await prisma.adaptationDecision.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        learner: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return {
      cohortSummary: {
        totalLearners,
        activeLearners,
        completedOnboarding,
        onboardingCompletionRate: totalLearners === 0 ? 0 : toPercent((completedOnboarding / totalLearners) * 100),
        averageEngagementScore: toPercent(clampPercent(averageEngagementScore)),
        averagePathCompletionRate: toPercent(clampPercent(averagePathCompletionRate)),
      },
      interventionQueue,
      adaptationHistory: adaptationHistory.map((item: {
        id: string
        learnerId: string
        decisionType: string
        source: string
        rationale: string
        createdAt: Date
        learner: { user: { name: string } }
      }) => ({
        id: item.id,
        learnerId: item.learnerId,
        learnerName: item.learner.user.name,
        decisionType: item.decisionType,
        source: item.source,
        rationale: item.rationale,
        createdAt: item.createdAt.toISOString(),
      })),
    }
  },

  async getParentDashboard(parentUserId: string): Promise<ParentDashboardResponseDto> {
    const links = await learnerRepository.getParentLearners(parentUserId)

    return {
      children: links.map((link: ParentLinkRecord) => {
        const learner = link.learner
        const activePath = learner.learningPaths[0]
        const units: Array<{ state: PathUnitState }> = activePath?.units ?? []

        const completedUnits = units.filter((unit: { state: PathUnitState }) => unit.state === PathUnitState.COMPLETED).length
        const activeUnits = units.filter(
          (unit: { state: PathUnitState }) => unit.state === PathUnitState.IN_PROGRESS || unit.state === PathUnitState.UNLOCKED,
        ).length
        const pathCompletionRate = units.length === 0 ? 0 : (completedUnits / units.length) * 100

        const engagementScore = clampPercent(learner.engagementScore)
        const engagementLevel = engagementScore < 40 ? "LOW" : engagementScore < 70 ? "MEDIUM" : "HIGH"

        const milestones: string[] = []

        if (learner.onboardingStatus === OnboardingStatus.COMPLETED) {
          milestones.push("Onboarding completed")
        }

        if (completedUnits > 0) {
          milestones.push(`${completedUnits} unit(s) completed`)
        }

        if (activeUnits > 0) {
          milestones.push("Currently active in learning path")
        }

        if (learner.mentorshipRequests.length > 0) {
          milestones.push("Mentorship support requested")
        }

        if (pathCompletionRate === 100 && units.length > 0) {
          milestones.push("Current learning path completed")
        }

        if (milestones.length === 0) {
          milestones.push("No milestones yet")
        }

        return {
          learnerId: learner.id,
          learnerName: learner.user.name,
          milestones,
          engagement: {
            score: Math.round(engagementScore),
            level: engagementLevel,
            pathCompletionRate: toPercent(clampPercent(pathCompletionRate)),
            activeUnits,
            completedUnits,
          },
        }
      }),
    }
  },
}
