import { created, fail } from "@/lib/api-response"
import { requireParent } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { parentFollowRequestCreateSchema } from "@/lib/validation/parent-follow"
import { parentFollowService } from "@/services/parent-follow-service"

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    requireParent(session)

    const payload = parentFollowRequestCreateSchema.parse(await request.json())
    const result = await parentFollowService.submitParentFollowRequest(session.userId, payload)

    return created(result)
  } catch (error) {
    return fail(error)
  }
}
