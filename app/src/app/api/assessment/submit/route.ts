import { fail, ok } from "@/lib/api-response"
import { requireSession } from "@/lib/auth/session"
import { requireLearner } from "@/lib/auth/guards"
import { assessmentSubmitSchema } from "@/lib/validation/assessment"
import { assessmentService } from "@/services/assessment-service"

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    requireLearner(session)

    const payload = assessmentSubmitSchema.parse(await request.json())
    const result = await assessmentService.submitAssessment(session.userId, payload)

    return ok(result)
  } catch (error) {
    return fail(error)
  }
}
