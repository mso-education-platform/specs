import { expect, test } from "@playwright/test"

test("US3 educator supervision flow", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "learning-platform-session",
      JSON.stringify({
        userId: "550e8400-e29b-41d4-a716-446655440777",
        role: "EDUCATOR",
        email: "educator@example.com",
        name: "Educator",
      }),
    )
  })

  await page.route("**/api/dashboard/educator", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        cohortSummary: {
          totalLearners: 12,
          activeLearners: 9,
          completedOnboarding: 10,
          onboardingCompletionRate: 83.3,
          averageEngagementScore: 63.2,
          averagePathCompletionRate: 42.1,
        },
        interventionQueue: [
          {
            learnerId: "550e8400-e29b-41d4-a716-446655440101",
            learnerName: "Learner One",
            programCode: "AI_ORIENTED",
            riskLevel: "HIGH",
            reason: "Onboarding is incomplete and requires intervention.",
            openMentorshipRequests: 2,
            completionRate: 0,
          },
        ],
        adaptationHistory: [
          {
            id: "550e8400-e29b-41d4-a716-446655440201",
            learnerId: "550e8400-e29b-41d4-a716-446655440101",
            learnerName: "Learner One",
            decisionType: "REINFORCEMENT",
            source: "RULE",
            rationale: "Assign foundational reinforcement before next unit.",
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    })
  })

  await page.goto("/educator/dashboard")

  await expect(page.getByRole("heading", { name: /educator supervision/i })).toBeVisible()
  await expect(page.getByText(/cohort analytics/i)).toBeVisible()
  await expect(page.getByText("Learner One").first()).toBeVisible()
  await expect(page.getByText(/intervention queue/i)).toBeVisible()
  await expect(page.getByText(/adaptation decision log/i)).toBeVisible()
})
