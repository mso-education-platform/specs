import { ApiError } from "@/lib/api-errors"
import { parentFollowRepository } from "@/repositories/parent-follow-repository"

type AdminNotificationEntity = Awaited<ReturnType<typeof parentFollowRepository.listAdminNotifications>>[number]

export const adminNotificationService = {
  async listNotifications() {
    const notifications = await parentFollowRepository.listAdminNotifications()

    return {
      notifications: notifications.map((notification: AdminNotificationEntity) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
        parentFollowRequestId: notification.parentFollowRequestId,
        parentName: notification.parentFollowRequest?.parent.name ?? null,
        parentEmail: notification.parentFollowRequest?.parent.email ?? null,
        learnerName: notification.parentFollowRequest?.learner.user.name ?? null,
        learnerEmail: notification.parentFollowRequest?.learner.user.email ?? null,
        requestStatus: notification.parentFollowRequest?.status ?? null,
      })),
    }
  },

  async markAsRead(notificationId: string) {
    try {
      const updated = await parentFollowRepository.markNotificationAsRead(notificationId)

      return {
        id: updated.id,
        isRead: updated.isRead,
      }
    } catch {
      throw new ApiError(404, "ADMIN_NOTIFICATION_NOT_FOUND", "Admin notification not found.")
    }
  },
}
