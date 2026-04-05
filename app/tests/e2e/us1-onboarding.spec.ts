import { test, expect } from "@playwright/test"

test("US1 onboarding happy path", async ({ page }) => {
  await page.goto("/sign-in")

  await page.getByLabel("Name").fill("Learner Test")
  await page.getByLabel("Email").fill("learner@example.com")
  await page.getByRole("button", { name: "Continue" }).click()

  await expect(page).toHaveURL(/.*onboarding\/age-level/)

  await page.getByRole("button", { name: "8-12 years" }).click()
  await page.getByRole("button", { name: "Continue" }).click()

  await expect(page).toHaveURL(/.*onboarding\/program/)
})
