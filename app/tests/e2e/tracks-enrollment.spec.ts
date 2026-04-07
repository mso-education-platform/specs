import { expect, test } from "@playwright/test"

test("learner can enroll from tracks page", async ({ page }) => {
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
    window.localStorage.setItem("learning-platform-onboarding-completed", "true")
  })

  let enrolledProgramCode: string | null = null

  await page.route("**/api/learning-path", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON() as { programCode?: string }
      enrolledProgramCode = body.programCode ?? null

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          learnerId: "550e8400-e29b-41d4-a716-446655440111",
          programCode: body.programCode,
          canonicalUserId: "550e8400-e29b-41d4-a716-446655440010",
        }),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        learningPathId: "550e8400-e29b-41d4-a716-446655440333",
        programCode: "WEB_DEV",
        version: 1,
        units: [],
      }),
    })
  })

  await page.goto("/tracks")

  await page.getByRole("button", { name: /inscrire au parcours/i }).first().click()

  await expect(page).toHaveURL(/.*\/dashboard/)
  expect(enrolledProgramCode).toBe("WEB_DEV")
})
