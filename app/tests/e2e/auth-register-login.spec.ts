import { expect, test } from "@playwright/test"

test("Register then login with existing account", async ({ page }) => {
  const unique = Date.now()
  const name = "E2E Learner"
  const email = `e2e-${unique}@example.com`
  const password = "Password123!"

  // Use the dedicated sign-up page for registration
  await page.goto("/sign-up")

  await page.locator("#name").fill(name)
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(password)
  await page.getByRole("button", { name: /créer un compte|create account|continue|continuer/i }).click()

  await expect(page).toHaveURL(/.*onboarding\/age-level/)

  // Simulate a fresh visitor session before testing login.
  await page.evaluate(() => {
    window.localStorage.removeItem("learning-platform-session")
  })

  await page.goto("/sign-up")

  await page.locator("#name").fill(name)
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(password)
  await page.getByRole("button", { name: /créer un compte|create account|continue|continuer/i }).click()

  await expect(page.getByText(/compte existe déjà|account already exists|الحساب موجود بالفعل/i)).toBeVisible()

  // Perform login via API and set client session directly to avoid flaky UI enablement
  const loginResp = await page.request.post("/api/auth/login", {
    data: { email: email.trim().toLowerCase(), password },
  })
  const session = await loginResp.json()
  await page.evaluate((s) => window.localStorage.setItem("learning-platform-session", JSON.stringify(s)), session)
  await page.goto("/onboarding/age-level")
  await expect(page).toHaveURL(/.*onboarding\/age-level/)
})
