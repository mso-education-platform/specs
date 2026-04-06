import { fail, ok } from "@/lib/api-response"
import { requireEducator } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { dashboardService } from "@/services/dashboard-service"

export async function GET() {
  try {
    const session = await requireSession()
    requireEducator(session)

    const data = await dashboardService.getEducatorDashboard()
    return ok(data)
  } catch (error) {
    return fail(error)
  }
}
