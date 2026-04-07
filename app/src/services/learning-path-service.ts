import { PathGenerator, PathUnitState } from "@prisma/client"
import { ApiError } from "@/lib/api-errors"
import type { EnrollProgramDto } from "@/lib/validation/learning-path"
import type { UnitProgressPatchDto } from "@/lib/validation/learning-path"
import { learnerRepository } from "@/repositories/learner-repository"
import { learningPathRepository } from "@/repositories/learning-path-repository"
import { prisma } from "@/lib/db/prisma"

const allowedStateTransitions: Record<PathUnitState, PathUnitState[]> = {
  LOCKED: [PathUnitState.UNLOCKED],
  UNLOCKED: [PathUnitState.IN_PROGRESS, PathUnitState.DEFERRED],
  IN_PROGRESS: [PathUnitState.COMPLETED, PathUnitState.DEFERRED],
  COMPLETED: [],
  DEFERRED: [PathUnitState.UNLOCKED, PathUnitState.IN_PROGRESS],
}

type LearningPathUnitDto = {
  unitId: string
  title: string
  objective: string
  sequenceIndex: number
  state: PathUnitState
  projectSubmissionStatus: "NONE" | "SUBMITTED" | "REVIEWED"
  reflectionCompleted: boolean
  prerequisites: string[]
}

type PathUnitEdge = { prerequisiteUnitId: string }
type PathUnitEntity = {
  id: string
  unitId: string
  sequenceIndex: number
  state: PathUnitState
  startedAt?: Date | null
  projectSubmissionStatus: "NONE" | "SUBMITTED" | "REVIEWED"
  reflectionCompleted: boolean
  unit: {
    title: string
    objective: string
    prerequisites: PathUnitEdge[]
  }
}

export const learningPathService = {
  async enrollInProgram(userId: string, dto: EnrollProgramDto, identity?: { email?: string; name?: string }) {
    const ensuredUser = await learnerRepository.ensureLearnerUser({
      userId,
      email: identity?.email,
      name: identity?.name,
    })

    const learnerProfile = await learnerRepository.ensureLearnerProfile(ensuredUser.id)
    const activePath = await learningPathRepository.getActivePath(learnerProfile.id)
    if (activePath) {
      const hasIncompleteUnits = activePath.units.some(
        (unit: { state: PathUnitState }) => unit.state !== PathUnitState.COMPLETED,
      )
      if (hasIncompleteUnits) {
        throw new ApiError(
          409,
          "ACTIVE_PATH_NOT_COMPLETED",
          "Finish your current learning track before enrolling in another one.",
        )
      }
    }

    const updatedLearnerProfile = await learnerRepository.setSelectedProgram(ensuredUser.id, dto.programCode)
    if (!updatedLearnerProfile.selectedProgram?.id) {
      throw new ApiError(404, "PROGRAM_NOT_FOUND", "Program not found.")
    }

    await this.generateInitialPath(updatedLearnerProfile.id, updatedLearnerProfile.selectedProgram.id)

    return {
      learnerId: updatedLearnerProfile.id,
      programCode: dto.programCode,
      canonicalUserId: ensuredUser.id,
    }
  },

  async generateInitialPath(learnerId: string, programId: string) {
    const units = await prisma.learningUnit.findMany({
      where: { programId },
      orderBy: { orderIndex: "asc" },
      select: { id: true },
    })

    return learningPathRepository.createPathFromProgramUnits({
      learnerId,
      programId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      unitIds: units.map((unit: any) => unit.id),
      generatedBy: PathGenerator.AI_PLUS_RULES,
    })
  },

  async getActiveLearningPath(learnerId: string) {
    const activePath = await learningPathRepository.getActivePath(learnerId)
    if (!activePath) {
      return null
    }

    return {
      learningPathId: activePath.id,
      programCode: activePath.program.code,
      version: activePath.version,
      units: (activePath.units as PathUnitEntity[]).map((pathUnit): LearningPathUnitDto => ({
        unitId: pathUnit.unitId,
        title: pathUnit.unit.title,
        objective: pathUnit.unit.objective,
        sequenceIndex: pathUnit.sequenceIndex,
        state: pathUnit.state,
        projectSubmissionStatus: pathUnit.projectSubmissionStatus,
        reflectionCompleted: pathUnit.reflectionCompleted,
        prerequisites: pathUnit.unit.prerequisites.map((edge) => edge.prerequisiteUnitId),
      })),
    }
  },

  async getLearningPathUnit(learnerId: string, unitId: string) {
    const record = await learningPathRepository.getPathUnitForLearner(learnerId, unitId)
    if (!record) {
      throw new ApiError(404, "UNIT_NOT_FOUND", "Learning unit not found in active path.")
    }

    const unit = record.unit as PathUnitEntity

    return {
      unitId: unit.unitId,
      title: unit.unit.title,
      objective: unit.unit.objective,
      sequenceIndex: unit.sequenceIndex,
      state: unit.state,
      projectSubmissionStatus: unit.projectSubmissionStatus,
      reflectionCompleted: unit.reflectionCompleted,
      prerequisites: unit.unit.prerequisites.map((edge) => edge.prerequisiteUnitId),
    }
  },

  async updateUnitProgress(learnerId: string, unitId: string, patch: UnitProgressPatchDto) {
    if (!patch.state && patch.projectSubmissionStatus === undefined && patch.reflectionCompleted === undefined) {
      throw new ApiError(400, "EMPTY_PATCH", "Provide at least one field to update unit progress.")
    }

    const record = await learningPathRepository.getPathUnitForLearner(learnerId, unitId)
    if (!record) {
      throw new ApiError(404, "UNIT_NOT_FOUND", "Learning unit not found in active path.")
    }

    const { activePath } = record
    const unit = record.unit as PathUnitEntity
    const currentState = unit.state
    const nextState = patch.state ?? currentState

    if (patch.state && patch.state !== currentState) {
      const allowedTargets = allowedStateTransitions[currentState]
      if (!allowedTargets.includes(patch.state)) {
        throw new ApiError(409, "INVALID_STATE_TRANSITION", `Cannot move unit from ${currentState} to ${patch.state}.`)
      }
    }

    if (nextState === PathUnitState.IN_PROGRESS || nextState === PathUnitState.COMPLETED) {
      const prerequisiteIds = unit.unit.prerequisites.map((edge) => edge.prerequisiteUnitId)
      const completedUnitIds = new Set(
        (activePath.units as PathUnitEntity[])
          .filter((pathUnit) => pathUnit.state === PathUnitState.COMPLETED)
          .map((pathUnit) => pathUnit.unitId),
      )

      const missingPrerequisites = prerequisiteIds.filter((prerequisiteId) => !completedUnitIds.has(prerequisiteId))
      if (missingPrerequisites.length > 0) {
        throw new ApiError(409, "PREREQUISITES_NOT_COMPLETED", "Complete prerequisite units before progressing this unit.")
      }
    }

    const updatedUnit = await learningPathRepository.updatePathUnit(unit.id, {
      state: patch.state,
      projectSubmissionStatus: patch.projectSubmissionStatus,
      reflectionCompleted: patch.reflectionCompleted,
      startedAt: nextState === PathUnitState.IN_PROGRESS && !unit.startedAt ? new Date() : undefined,
      completedAt:
        nextState === PathUnitState.COMPLETED
          ? new Date()
          : patch.state && patch.state !== PathUnitState.COMPLETED
            ? null
            : undefined,
    })

    if (nextState === PathUnitState.COMPLETED) {
      await learningPathRepository.unlockNextUnit(activePath.id, unit.sequenceIndex)
    }

    if (
      nextState === PathUnitState.COMPLETED ||
      patch.projectSubmissionStatus === "REVIEWED" ||
      patch.reflectionCompleted === true
    ) {
      const { personalizationService } = await import("@/services/personalization-service")
      await personalizationService.triggerAdaptiveRefreshFromProgress({
        learnerId,
        learningPathId: activePath.id,
        unitId,
        state: nextState,
        projectSubmissionStatus: updatedUnit.projectSubmissionStatus,
        reflectionCompleted: updatedUnit.reflectionCompleted,
      })
    }

    return {
      unitId: updatedUnit.unitId,
      state: updatedUnit.state,
      projectSubmissionStatus: updatedUnit.projectSubmissionStatus,
      reflectionCompleted: updatedUnit.reflectionCompleted,
    }
  },
}
