import { fail, ok } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { reviewParentFollowRequestSchema } from "@/lib/validation/parent-follow"
import { parentFollowService } from "@/services/parent-follow-service"

type Context = {
  params: Promise<{ requestId: string }>
}

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireSession()
    requireAdmin(session)

    const { requestId } = await context.params
    const payload = reviewParentFollowRequestSchema.parse(await request.json())

    const result = await parentFollowService.reviewParentFollowRequest(session.userId, requestId, payload)

    return ok(result)
  } catch (error) {
    return fail(error)
  }
}
