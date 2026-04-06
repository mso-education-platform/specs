import { expect, test } from "@playwright/test"

test("US4 parent monitoring flow", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "learning-platform-session",
      JSON.stringify({
        userId: "550e8400-e29b-41d4-a716-446655440888",
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
            learnerId: "550e8400-e29b-41d4-a716-446655440102",
            learnerName: "Child One",
            milestones: ["Onboarding completed", "2 unit(s) completed"],
            engagement: {
              score: 74,
              level: "HIGH",
              pathCompletionRate: 50,
              activeUnits: 1,
              completedUnits: 2,
            },
          },
        ],
      }),
    })
  })

  await page.goto("/parent/dashboard")

  await expect(page.getByRole("heading", { name: /parent monitoring|suivi parent/i })).toBeVisible()
  await expect(page.getByText(/child progress overview|vue d'ensemble de la progression de l'enfant/i)).toBeVisible()
  await expect(page.getByText("Child One")).toBeVisible()
  await expect(page.getByText(/onboarding completed/i)).toBeVisible()
  await expect(page.getByText(/path completion: 50%|progression du parcours: 50%/i)).toBeVisible()
})
