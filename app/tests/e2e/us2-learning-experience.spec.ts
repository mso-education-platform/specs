import { expect, test } from "@playwright/test"

test("US2 learner unit progression", async ({ page }) => {
  let unitState: "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" = "UNLOCKED"
  let secondUnitState: "LOCKED" | "UNLOCKED" = "LOCKED"
  let projectSubmissionStatus: "NONE" | "SUBMITTED" | "REVIEWED" = "NONE"
  let reflectionCompleted = false

  await page.addInitScript(() => {
    window.localStorage.setItem(
      "learning-platform-session",
      JSON.stringify({
        userId: "550e8400-e29b-41d4-a716-446655440010",
        role: "LEARNER",
        email: "learner@example.com",
        name: "Learner",
      }),
    )
  })

  await page.route("**/api/learning-path", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        learningPathId: "550e8400-e29b-41d4-a716-446655440100",
        programCode: "WEB_DEV",
        version: 1,
        units: [
          {
            unitId: "550e8400-e29b-41d4-a716-446655440101",
            title: "HTML Foundations",
            objective: "Build semantic page structure.",
            sequenceIndex: 1,
            state: unitState,
            projectSubmissionStatus,
            reflectionCompleted,
            prerequisites: [],
          },
          {
            unitId: "550e8400-e29b-41d4-a716-446655440102",
            title: "CSS Basics",
            objective: "Style layout and typography.",
            sequenceIndex: 2,
            state: secondUnitState,
            projectSubmissionStatus: "NONE",
            reflectionCompleted: false,
            prerequisites: ["550e8400-e29b-41d4-a716-446655440101"],
          },
        ],
      }),
    })
  })

  await page.route("**/api/units/*", async (route) => {
    const requestBody = route.request().postDataJSON() as {
      state?: "UNLOCKED" | "IN_PROGRESS" | "COMPLETED"
      projectSubmissionStatus?: "NONE" | "SUBMITTED" | "REVIEWED"
      reflectionCompleted?: boolean
    }

    if (requestBody.state) {
      unitState = requestBody.state
    }
    if (requestBody.projectSubmissionStatus) {
      projectSubmissionStatus = requestBody.projectSubmissionStatus
    }
    if (typeof requestBody.reflectionCompleted === "boolean") {
      reflectionCompleted = requestBody.reflectionCompleted
    }
    if (unitState === "COMPLETED") {
      secondUnitState = "UNLOCKED"
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        unitId: "550e8400-e29b-41d4-a716-446655440101",
        state: unitState,
        projectSubmissionStatus,
        reflectionCompleted,
      }),
    })
  })

  await page.goto("/track")
  await expect(page.getByText("HTML Foundations")).toBeVisible()

  await page.getByRole("button", { name: /open|ouvrir|فتح/i }).first().click()
  await expect(page).toHaveURL(/.*\/unit\//)

  await page.getByRole("button", { name: /start unit|commencer l'unité|بدء الوحدة/i }).click()
  await page.getByRole("button", { name: /complete unit|terminer l'unité|إكمال الوحدة/i }).click()

  await expect(page.getByText(/completed|terminée|مكتملة/i)).toBeVisible()

  await page.goto("/track")
  await expect(page.getByText("CSS Basics")).toBeVisible()
  await expect(page.getByText(/unlocked|déverrouillée|مفتوحة/i)).toBeVisible()
})
