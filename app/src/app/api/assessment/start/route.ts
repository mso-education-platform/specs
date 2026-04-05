import { fail, ok } from "@/lib/api-response"
import { requireSession } from "@/lib/auth/session"
import { requireLearner } from "@/lib/auth/guards"
import { assessmentStartSchema } from "@/lib/validation/assessment"
import { assessmentService } from "@/services/assessment-service"

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    requireLearner(session)

    const payload = assessmentStartSchema.parse(await request.json())
    void payload
    const result = await assessmentService.startAssessment(session.userId)

    return ok(result)
  } catch (error) {
    return fail(error)
  }
}
