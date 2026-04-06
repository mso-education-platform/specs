import { PathGenerator, PathStatus, PathUnitState } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

export const learningPathRepository = {
  async getLatestVersion(learnerId: string) {
    const path = await prisma.learningPath.findFirst({
      where: { learnerId },
      orderBy: { version: "desc" },
      select: { version: true },
    })

    return path?.version ?? 0
  },

  async archiveActivePaths(learnerId: string) {
    return prisma.learningPath.updateMany({
      where: { learnerId, status: PathStatus.ACTIVE },
      data: { status: PathStatus.SUPERSEDED },
    })
  },

  async createPathFromProgramUnits(input: {
    learnerId: string
    programId: string
    unitIds: string[]
    generatedBy?: PathGenerator
  }) {
    const nextVersion = (await this.getLatestVersion(input.learnerId)) + 1

    await this.archiveActivePaths(input.learnerId)

    return prisma.learningPath.create({
      data: {
        learnerId: input.learnerId,
        programId: input.programId,
        version: nextVersion,
        status: PathStatus.ACTIVE,
        generatedBy: input.generatedBy ?? PathGenerator.RULES_ONLY,
        units: {
          create: input.unitIds.map((unitId, index) => ({
            unitId,
            sequenceIndex: index + 1,
            state: index === 0 ? PathUnitState.UNLOCKED : PathUnitState.LOCKED,
          })),
        },
      },
      include: {
        units: {
          include: {
            unit: true,
          },
          orderBy: { sequenceIndex: "asc" },
        },
      },
    })
  },

  async getActivePath(learnerId: string) {
    return prisma.learningPath.findFirst({
      where: { learnerId, status: PathStatus.ACTIVE },
      include: {
        program: true,
        units: {
          include: {
            unit: {
              include: {
                prerequisites: {
                  include: {
                    prerequisiteUnit: true,
                  },
                },
              },
            },
          },
          orderBy: { sequenceIndex: "asc" },
        },
      },
    })
  },
}
