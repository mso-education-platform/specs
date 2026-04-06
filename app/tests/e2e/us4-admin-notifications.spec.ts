import { expect, test } from "@playwright/test"

test("US4 admin notifications page", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "learning-platform-session",
      JSON.stringify({
        userId: "admin-1",
        role: "ADMIN",
        email: "admin@example.com",
        name: "Admin",
      }),
    )
  })

  await page.route("**/api/admin/notifications", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
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
      }),
    })
  })

  await page.route("**/api/admin/notifications/notif-1/read", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: "notif-1", isRead: true }),
    })
  })

  await page.goto("/educator/admin/notifications")

  await expect(page.getByText(/admin notifications|notifications administrateur/i)).toBeVisible()
  await expect(page.getByTestId("admin-notification-item")).toBeVisible()
  await page.getByTestId("mark-notification-read").click()
})
