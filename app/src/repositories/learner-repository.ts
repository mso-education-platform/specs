import { OnboardingStatus, ProgramCode, UserRole } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

export const learnerRepository = {
  async ensureLearnerUser(input: { userId: string; email?: string; name?: string }) {
    const fallbackEmail = `${input.userId}@local.learning-platform`
    const fallbackName = "Learner"

    if (input.email) {
      const existingByEmail = await prisma.user.findUnique({ where: { email: input.email } })
      if (existingByEmail) {
        return prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            role: UserRole.LEARNER,
            name: input.name ?? existingByEmail.name,
          },
        })
      }
    }

    return prisma.user.upsert({
      where: { id: input.userId },
      update: {
        role: UserRole.LEARNER,
        email: input.email ?? fallbackEmail,
        name: input.name ?? fallbackName,
      },
      create: {
        id: input.userId,
        role: UserRole.LEARNER,
        email: input.email ?? fallbackEmail,
        name: input.name ?? fallbackName,
      },
    })
  },

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
