import { fail, ok } from "@/lib/api-response"
import { ApiError } from "@/lib/api-errors"
import { requireLearner } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { learnerRepository } from "@/repositories/learner-repository"
import { unitProgressPatchSchema } from "@/lib/validation/learning-path"
import { learningPathService } from "@/services/learning-path-service"

export async function PATCH(request: Request, { params }: { params: Promise<{ unitId: string }> }) {
  try {
    const session = await requireSession()
    requireLearner(session)

    const learner = await learnerRepository.getLearnerByUserId(session.userId)
    if (!learner) {
      throw new ApiError(404, "LEARNER_NOT_FOUND", "Learner profile not found.")
    }

    const body = await request.json()
    const patch = unitProgressPatchSchema.parse(body)
    const { unitId } = await params

    const updated = await learningPathService.updateUnitProgress(learner.id, unitId, patch)
    return ok(updated)
  } catch (error) {
    return fail(error)
  }
}
