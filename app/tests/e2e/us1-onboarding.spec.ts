import { test, expect } from "@playwright/test"

test("US1 onboarding happy path", async ({ page }) => {
  const unique = Date.now()

  await page.route("**/api/onboarding", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        learnerId: "550e8400-e29b-41d4-a716-446655440111",
        onboardingStatus: "PROGRAM_SELECTED",
      }),
    })
  })

  await page.route("**/api/assessment/start", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        assessmentSessionId: "550e8400-e29b-41d4-a716-446655440222",
        questions: [
          { questionId: "q1", prompt: "Question 1", type: "OPEN_TEXT" },
          { questionId: "q2", prompt: "Question 2", type: "OPEN_TEXT" },
          { questionId: "q3", prompt: "Question 3", type: "OPEN_TEXT" },
        ],
        progress: { currentStep: 1, totalSteps: 3 },
      }),
    })
  })

  await page.route("**/api/assessment/submit", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        assessmentSessionId: "550e8400-e29b-41d4-a716-446655440222",
        scoreTotal: 0.82,
        scoreBreakdown: { logic: 0.82, communication: 0.75, creativity: 0.87 },
        learningPathId: "550e8400-e29b-41d4-a716-446655440333",
        adaptationSummary: {
          strengths: ["logic", "creativity"],
          improvements: ["communication"],
        },
      }),
    })
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
          { unitId: "unit-1", title: "HTML Foundations", sequenceIndex: 1, state: "UNLOCKED" },
          { unitId: "unit-2", title: "CSS Basics", sequenceIndex: 2, state: "LOCKED" },
        ],
      }),
    })
  })

  await page.goto("/sign-in")

  await page.locator("#name").fill("Learner Test")
  await page.locator("#email").fill(`learner-${unique}@example.com`)
  await page.locator("#password").fill("Password123!")
  await page.getByRole("button", { name: /continue/i }).click()

  await expect(page).toHaveURL(/.*onboarding\/age-level/)

  await page.getByRole("button", { name: /8-12|a_8_12/i }).click()
  await page.getByRole("button", { name: /continue/i }).click()

  await expect(page).toHaveURL(/.*onboarding\/program/)

  await page.getByRole("button", { name: /web|développement|web_dev/i }).click()
  await page.getByRole("button", { name: /évaluation|assessment|continuer/i }).last().click()
  await expect(page).toHaveURL(/.*onboarding\/assessment/)

  await page.getByRole("button", { name: /commencer|start/i }).click()
  const inputs = page.getByRole("textbox")
  await inputs.nth(0).fill("I enjoy coding challenges and small projects.")
  await inputs.nth(1).fill("I build projects every week with friends.")
  await inputs.nth(2).fill("I want to improve problem solving this month.")
  await page.getByRole("button", { name: /envoyer|submit/i }).click()

  await expect(page).toHaveURL(/.*onboarding\/feedback/)
  await page.getByRole("link", { name: /aller au tableau de bord|go dashboard/i }).click()
  await expect(page).toHaveURL(/.*dashboard/)
  await expect(page.getByText("HTML Foundations")).toBeVisible()
})
