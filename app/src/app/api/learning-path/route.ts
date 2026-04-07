import { ApiError } from "@/lib/api-errors"
import { fail, ok } from "@/lib/api-response"
import { requireLearner } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { enrollProgramSchema } from "@/lib/validation/learning-path"
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

    // If the learner has no active learning path, return 200 with `null`.
    // This avoids client-side 404 entries in the browser network console while
    // allowing the UI to treat `data === null` as "no active path".
    if (!activePath) {
      return ok(null)
    }

    return ok(activePath)
  } catch (error) {
    return fail(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    requireLearner(session)

    const payload = enrollProgramSchema.parse(await request.json())
    const result = await learningPathService.enrollInProgram(session.userId, payload, {
      email: session.email,
      name: session.name,
    })

    return ok(result)
  } catch (error) {
    return fail(error)
  }
}
