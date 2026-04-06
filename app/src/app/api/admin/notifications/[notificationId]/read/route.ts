import { fail, ok } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth/guards"
import { requireSession } from "@/lib/auth/session"
import { adminNotificationService } from "@/services/admin-notification-service"

type Context = {
  params: Promise<{ notificationId: string }>
}

export async function PATCH(_request: Request, context: Context) {
  try {
    const session = await requireSession()
    requireAdmin(session)

    const { notificationId } = await context.params
    const data = await adminNotificationService.markAsRead(notificationId)

    return ok(data)
  } catch (error) {
    return fail(error)
  }
}
