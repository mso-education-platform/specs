import { expect, test } from "@playwright/test"

test("US4 parent follow request submission UI", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "learning-platform-session",
      JSON.stringify({
        userId: "parent-1",
        role: "PARENT",
        email: "parent@example.com",
        name: "Parent",
      }),
    )
  })

  await page.route("**/api/dashboard/parent", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        children: [
          {
            learnerId: "learner-1",
            learnerName: "Child One",
            milestones: ["Onboarding completed"],
            engagement: {
              score: 70,
              level: "HIGH",
              pathCompletionRate: 60,
              activeUnits: 1,
              completedUnits: 3,
            },
          },
        ],
      }),
    })
  })

  await page.route("**/api/parent/follow-requests", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        requestId: "request-1",
        status: "PENDING",
        parentName: "Parent",
        learnerName: "Child One",
        createdAt: new Date().toISOString(),
      }),
    })
  })

  await page.goto("/parent/dashboard")

  await page.getByRole("link", { name: /demander l'adhésion/i }).click()
  await expect(page.getByTestId("parent-follow-request-form")).toBeVisible()
  await page.getByTestId("learner-email-input").fill("child.one@example.com")
  await page.getByTestId("relationship-type-input").fill("Parent")
  await page.getByTestId("submit-parent-follow-request").click()

  await expect(page.getByTestId("parent-follow-request-success")).toBeVisible()
})

test("US4 parent request form appears from sidebar request link when child already linked", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "learning-platform-session",
      JSON.stringify({
        userId: "parent-1",
        role: "PARENT",
        email: "parent@example.com",
        name: "Parent",
      }),
    )
  })

  await page.route("**/api/dashboard/parent", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        children: [
          {
            learnerId: "learner-1",
            learnerName: "Child One",
            milestones: ["Onboarding completed"],
            engagement: {
              score: 70,
              level: "HIGH",
              pathCompletionRate: 60,
              activeUnits: 1,
              completedUnits: 3,
            },
          },
        ],
      }),
    })
  })

  await page.goto("/parent/dashboard")

  await expect(page.getByTestId("parent-follow-request-form")).toHaveCount(0)
  await page.getByRole("link", { name: /demander l'adhésion/i }).click()
  await expect(page.getByTestId("parent-follow-request-form")).toBeVisible()
})

test("US4 admin review queue UI", async ({ page }) => {
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

  await page.route("**/api/dashboard/educator", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        cohortSummary: {
          totalLearners: 10,
          activeLearners: 8,
          completedOnboarding: 7,
          onboardingCompletionRate: 70,
          averageEngagementScore: 65,
          averagePathCompletionRate: 55,
        },
        interventionQueue: [],
        adaptationHistory: [],
      }),
    })
  })

  await page.route("**/api/admin/parent-follow-requests", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        unreadNotificationsCount: 1,
        requests: [
          {
            requestId: "request-1",
            parentUserId: "parent-1",
            parentName: "Parent",
            parentEmail: "parent@example.com",
            learnerId: "learner-1",
            learnerName: "Child One",
            learnerEmail: "child.one@example.com",
            relationshipType: "Parent",
            note: null,
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    })
  })

  await page.route("**/api/admin/parent-follow-requests/request-1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        requestId: "request-1",
        status: "APPROVED",
        parentName: "Parent",
        learnerName: "Child One",
        reviewedAt: new Date().toISOString(),
        reviewedByUserId: "admin-1",
        reviewNote: null,
      }),
    })
  })

  await page.goto("/educator/dashboard")

  await expect(page.getByTestId("admin-parent-follow-requests")).toBeVisible()
  await expect(page.getByTestId("admin-parent-request-item")).toBeVisible()
  await page.getByTestId("approve-parent-request").click()
})
