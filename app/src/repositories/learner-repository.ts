import { OnboardingStatus, ProgramCode } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

export const learnerRepository = {
  async ensureLearnerProfile(userId: string) {
    return prisma.learnerProfile.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { selectedProgram: true },
    })
  },

  async updateOnboarding(userId: string, data: { ageLevel: "A_8_12" | "B_13_18"; programCode: ProgramCode; onboardingStatus: OnboardingStatus }) {
    const program = await prisma.program.findUnique({ where: { code: data.programCode } })

    return prisma.learnerProfile.upsert({
      where: { userId },
      update: {
        ageLevel: data.ageLevel,
        selectedProgramId: program?.id,
        onboardingStatus: data.onboardingStatus,
      },
      create: {
        userId,
        ageLevel: data.ageLevel,
        selectedProgramId: program?.id,
        onboardingStatus: data.onboardingStatus,
      },
      include: { selectedProgram: true },
    })
  },

  async getLearnerByUserId(userId: string) {
    return prisma.learnerProfile.findUnique({
      where: { userId },
      include: {
        selectedProgram: true,
      },
    })
  },

  async setOnboardingStatus(userId: string, onboardingStatus: OnboardingStatus) {
    return prisma.learnerProfile.update({
      where: { userId },
      data: { onboardingStatus },
    })
  },

  async getParentLearners(parentUserId: string) {
    return prisma.parentLearnerLink.findMany({
      where: { parentUserId },
      include: {
        learner: {
          include: {
            user: true,
            learningPaths: {
              where: { status: "ACTIVE" },
              include: { units: true },
            },
          },
        },
      },
    })
  },
}
