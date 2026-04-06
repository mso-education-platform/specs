import { expect, test } from "@playwright/test"

test("Register then login with existing account", async ({ page }) => {
  const unique = Date.now()
  const name = "E2E Learner"
  const email = `e2e-${unique}@example.com`
  const password = "Password123!"

  await page.goto("/sign-in")

  await page.locator("#name").fill(name)
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(password)
  await page.getByRole("button", { name: /créer un compte|create account|continue/i }).click()

  await expect(page).toHaveURL(/.*onboarding\/age-level/)

  // Simulate a fresh visitor session before testing login.
  await page.evaluate(() => {
    window.localStorage.removeItem("learning-platform-session")
  })

  await page.goto("/sign-in")

  await page.locator("#name").fill(name)
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(password)
  await page.getByRole("button", { name: /créer un compte|create account|continue/i }).click()

  await expect(page.getByText(/compte existe déjà|account already exists|الحساب موجود بالفعل/i)).toBeVisible()

  await page.getByRole("button", { name: /formulaire de connexion|sign-in form|نموذج تسجيل الدخول/i }).click()
  await page.getByRole("button", { name: /se connecter|sign in|تسجيل الدخول/i }).click()

  await expect(page).toHaveURL(/.*onboarding\/age-level/)
})
