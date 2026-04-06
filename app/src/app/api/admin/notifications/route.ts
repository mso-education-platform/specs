import { fail, ok } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { adminNotificationService } from "@/services/admin-notification-service"

export async function GET() {
  try {
    const session = await requireSession()
    requireAdmin(session)

    const data = await adminNotificationService.listNotifications()
    return ok(data)
  } catch (error) {
    return fail(error)
  }
}
