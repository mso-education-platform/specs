import { fail, ok } from "@/lib/api-response"
import { requireParent, requireParentWithLinkedLearners } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { dashboardService } from "@/services/dashboard-service"

export async function GET() {
  try {
    const session = await requireSession()
    requireParent(session)

    const data = await dashboardService.getParentDashboard(session.userId)
    requireParentWithLinkedLearners(data.children.length)

    return ok(data)
  } catch (error) {
    return fail(error)
  }
}
