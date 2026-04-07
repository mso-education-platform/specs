import { expect, test } from "@playwright/test"

test("dashboard keeps enroll another track button disabled while current track is unfinished", async ({ page }) => {
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

  await page.route("**/api/learning-path", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        learningPathId: "550e8400-e29b-41d4-a716-446655440333",
        programCode: "WEB_DEV",
        version: 1,
        units: [
          {
            unitId: "550e8400-e29b-41d4-a716-446655440101",
            title: "HTML Foundations",
            objective: "Build semantic page structure.",
            sequenceIndex: 1,
            state: "COMPLETED",
            projectSubmissionStatus: "NONE",
            reflectionCompleted: false,
            prerequisites: [],
          },
          {
            unitId: "550e8400-e29b-41d4-a716-446655440102",
            title: "CSS Basics",
            objective: "Style layout and typography.",
            sequenceIndex: 2,
            state: "IN_PROGRESS",
            projectSubmissionStatus: "NONE",
            reflectionCompleted: false,
            prerequisites: ["550e8400-e29b-41d4-a716-446655440101"],
          },
        ],
      }),
    })
  })

  await page.goto("/dashboard")

  await expect(page.getByRole("button", { name: /autre parcours/i })).toBeDisabled()
})

test("dashboard unlocks enroll another track button when current track is fully completed", async ({ page }) => {
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

  await page.route("**/api/learning-path", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        learningPathId: "550e8400-e29b-41d4-a716-446655440333",
        programCode: "WEB_DEV",
        version: 1,
        units: [
          {
            unitId: "550e8400-e29b-41d4-a716-446655440101",
            title: "HTML Foundations",
            objective: "Build semantic page structure.",
            sequenceIndex: 1,
            state: "COMPLETED",
            projectSubmissionStatus: "NONE",
            reflectionCompleted: false,
            prerequisites: [],
          },
          {
            unitId: "550e8400-e29b-41d4-a716-446655440102",
            title: "CSS Basics",
            objective: "Style layout and typography.",
            sequenceIndex: 2,
            state: "COMPLETED",
            projectSubmissionStatus: "NONE",
            reflectionCompleted: false,
            prerequisites: ["550e8400-e29b-41d4-a716-446655440101"],
          },
        ],
      }),
    })
  })

  await page.goto("/dashboard")

  const enrollAnotherTrackButton = page.getByRole("button", { name: /autre parcours/i })
  await expect(enrollAnotherTrackButton).toBeEnabled()

  await enrollAnotherTrackButton.click()
  await expect(page).toHaveURL(/.*\/tracks/)
})

test("dashboard allows opening an unlocked unit directly", async ({ page }) => {
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

  await page.route("**/api/learning-path", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        learningPathId: "550e8400-e29b-41d4-a716-446655440333",
        programCode: "WEB_DEV",
        version: 1,
        units: [
          {
            unitId: "550e8400-e29b-41d4-a716-446655440101",
            title: "HTML Foundations",
            objective: "Build semantic page structure.",
            sequenceIndex: 1,
            state: "UNLOCKED",
            projectSubmissionStatus: "NONE",
            reflectionCompleted: false,
            prerequisites: [],
          },
        ],
      }),
    })
  })

  await page.route("**/api/units/*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        unitId: "550e8400-e29b-41d4-a716-446655440101",
        title: "HTML Foundations",
        objective: "Build semantic page structure.",
        sequenceIndex: 1,
        state: "UNLOCKED",
        projectSubmissionStatus: "NONE",
        reflectionCompleted: false,
        prerequisites: [],
      }),
    })
  })

  await page.goto("/dashboard")

  await page.getByRole("button", { name: /ouvrir l'unité/i }).click()
  await expect(page).toHaveURL(/.*\/unit\//)
})
