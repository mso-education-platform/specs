import { describe, expect, it, vi } from "vitest"
import { UserRole } from "@prisma/client"
import * as sessionModule from "@/lib/auth/session"
import * as adminNotificationServiceModule from "@/services/admin-notification-service"
import { GET as listAdminNotifications } from "@/app/api/admin/notifications/route"
import { PATCH as markAdminNotificationRead } from "@/app/api/admin/notifications/[notificationId]/read/route"

describe("US4 integration: admin notifications", () => {
  it("returns admin notifications for admin role", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "admin-1",
      role: UserRole.ADMIN,
      email: "admin@example.com",
      name: "Admin",
    })

    const serviceSpy = vi.spyOn(adminNotificationServiceModule.adminNotificationService, "listNotifications").mockResolvedValue({
      notifications: [
        {
          id: "notif-1",
          type: "PARENT_FOLLOW_REQUEST",
          title: "New parent follow request",
          message: "Parent requested follow access.",
          isRead: false,
          createdAt: new Date().toISOString(),
          parentFollowRequestId: "request-1",
          parentName: "Parent",
          parentEmail: "parent@example.com",
          learnerName: "Child",
          learnerEmail: "child@example.com",
          requestStatus: "PENDING",
        },
      ],
    })

    const response = await listAdminNotifications()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.notifications).toHaveLength(1)

    sessionSpy.mockRestore()
    serviceSpy.mockRestore()
  })

  it("marks notification as read", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "admin-1",
      role: UserRole.ADMIN,
      email: "admin@example.com",
      name: "Admin",
    })

    const serviceSpy = vi.spyOn(adminNotificationServiceModule.adminNotificationService, "markAsRead").mockResolvedValue({
      id: "notif-1",
      isRead: true,
    })

    const response = await markAdminNotificationRead(
      new Request("http://localhost/api/admin/notifications/notif-1/read", { method: "PATCH" }),
      { params: Promise.resolve({ notificationId: "notif-1" }) },
    )

    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.isRead).toBe(true)

    sessionSpy.mockRestore()
    serviceSpy.mockRestore()
  })
})
