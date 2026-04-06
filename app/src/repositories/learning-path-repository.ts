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

  async getPathUnitForLearner(learnerId: string, unitId: string) {
    const activePath = await this.getActivePath(learnerId)
    if (!activePath) {
      return null
    }

    const unit = activePath.units.find((pathUnit: { unitId: string }) => pathUnit.unitId === unitId)
    if (!unit) {
      return null
    }

    return {
      activePath,
      unit,
    }
  },

  async updatePathUnit(
    pathUnitId: string,
    data: {
      state?: PathUnitState
      projectSubmissionStatus?: "NONE" | "SUBMITTED" | "REVIEWED"
      reflectionCompleted?: boolean
      startedAt?: Date
      completedAt?: Date | null
    },
  ) {
    return prisma.learningPathUnit.update({
      where: { id: pathUnitId },
      data,
      include: {
        unit: {
          include: {
            prerequisites: true,
          },
        },
      },
    })
  },

  async unlockNextUnit(learningPathId: string, currentSequenceIndex: number) {
    const nextUnit = await prisma.learningPathUnit.findFirst({
      where: {
        learningPathId,
        sequenceIndex: currentSequenceIndex + 1,
      },
    })

    if (!nextUnit || nextUnit.state !== PathUnitState.LOCKED) {
      return null
    }

    return prisma.learningPathUnit.update({
      where: { id: nextUnit.id },
      data: { state: PathUnitState.UNLOCKED },
    })
  },
}
