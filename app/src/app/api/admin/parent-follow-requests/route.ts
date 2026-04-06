import { fail, ok } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { parentFollowService } from "@/services/parent-follow-service"

export async function GET() {
  try {
    const session = await requireSession()
    requireAdmin(session)

    const result = await parentFollowService.getAdminPendingRequests()
    return ok(result)
  } catch (error) {
    return fail(error)
  }
}
