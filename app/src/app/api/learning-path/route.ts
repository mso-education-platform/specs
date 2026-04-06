import { ApiError } from "@/lib/api-errors"
import { fail, ok } from "@/lib/api-response"
import { requireLearner } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { learnerRepository } from "@/repositories/learner-repository"
import { learningPathService } from "@/services/learning-path-service"

export async function GET() {
  try {
    const session = await requireSession()
    requireLearner(session)

    const learner = await learnerRepository.getLearnerByUserId(session.userId)
    if (!learner) {
      throw new ApiError(404, "LEARNER_NOT_FOUND", "Learner profile not found.")
    }

    const activePath = await learningPathService.getActiveLearningPath(learner.id)
    if (!activePath) {
      throw new ApiError(404, "ACTIVE_PATH_NOT_FOUND", "No active learning path found.")
    }

    return ok({
      learningPathId: activePath.id,
      programCode: activePath.program.code,
      version: activePath.version,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        units: activePath.units.map((unit: any) => ({
        unitId: unit.unitId,
        title: unit.unit.title,
        sequenceIndex: unit.sequenceIndex,
        state: unit.state,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prerequisites: unit.unit.prerequisites.map((edge: any) => edge.prerequisiteUnitId),
      })),
    })
  } catch (error) {
    return fail(error)
  }
}
