# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: us1-onboarding.spec.ts >> US1 onboarding happy path
- Location: tests/e2e/us1-onboarding.spec.ts:3:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*onboarding\/feedback/
Received string:  "http://127.0.0.1:3000/dashboard"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    2 × unexpected value "http://127.0.0.1:3000/onboarding/assessment"
    7 × unexpected value "http://127.0.0.1:3000/dashboard"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "0"
          - generic [ref=e15]: "1"
        - generic [ref=e16]: Issue
      - button "Collapse issues badge" [ref=e17]:
        - img [ref=e18]
  - generic [ref=e21]:
    - complementary [ref=e22]:
      - generic [ref=e26]:
        - generic [ref=e27]: Plateforme d'apprentissage
        - generic [ref=e28]: v0.1
      - navigation [ref=e29]:
        - link "Accueil" [ref=e30] [cursor=pointer]:
          - /url: /
          - img [ref=e32]
          - generic [ref=e35]: Accueil
        - link "Tableau de bord" [ref=e36] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e38]
          - generic [ref=e43]: Tableau de bord
        - link "Mon avancement" [ref=e44] [cursor=pointer]:
          - /url: /track
          - img [ref=e46]
          - generic [ref=e48]: Mon avancement
      - generic [ref=e52]:
        - generic [ref=e53]: Learner Test
        - generic [ref=e54]: learner-1775510154414@example.com
        - generic [ref=e55]: Apprenant
    - generic [ref=e56]:
      - banner [ref=e57]:
        - generic [ref=e58]:
          - heading "Plateforme d'apprentissage" [level=2] [ref=e59]
          - generic [ref=e60]: Apprenant
          - navigation [ref=e61]:
            - link "Parcours" [ref=e62] [cursor=pointer]:
              - /url: /tracks
          - button [ref=e64]:
            - img
        - combobox "Language" [ref=e66]:
          - option "Français" [selected]
          - option "العربية"
      - main [ref=e67]:
        - generic [ref=e68]:
          - heading "Tableau de bord de l'apprenant" [level=1] [ref=e69]
          - paragraph [ref=e70]: Vos premières unités sont débloquées en fonction de votre évaluation d'onboarding.
          - generic [ref=e71]:
            - generic [ref=e72]:
              - paragraph [ref=e73]: Unités complétées
              - paragraph [ref=e74]: "0"
            - generic [ref=e75]:
              - paragraph [ref=e76]: Total des unités
              - paragraph [ref=e77]: "2"
            - generic [ref=e78]:
              - paragraph [ref=e79]: Disponibles maintenant
              - paragraph [ref=e80]: "1"
          - generic [ref=e81]:
            - generic [ref=e82]:
              - paragraph [ref=e83]: Continuez votre parcours personnalisé
              - paragraph [ref=e84]: "Prochaine unité suggérée : HTML Foundations"
            - generic [ref=e85]:
              - link "Ouvrir le parcours" [ref=e86] [cursor=pointer]:
                - /url: /track
                - button "Ouvrir le parcours" [ref=e87]
              - link "Ouvrir la prochaine unité" [ref=e88] [cursor=pointer]:
                - /url: /unit/unit-1
                - button "Ouvrir la prochaine unité" [ref=e89]
          - generic [ref=e90]:
            - generic [ref=e91]:
              - paragraph [ref=e92]: 1. HTML Foundations
              - paragraph [ref=e93]: "ID de l'unité: unit-1"
            - generic [ref=e95]: Déverrouillée
          - generic [ref=e96]:
            - generic [ref=e97]:
              - paragraph [ref=e98]: 2. CSS Basics
              - paragraph [ref=e99]: "ID de l'unité: unit-2"
            - generic [ref=e101]: Verrouillée
  - alert [ref=e102]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test"
  2  | 
  3  | test("US1 onboarding happy path", async ({ page }) => {
  4  |   const unique = Date.now()
  5  | 
  6  |   await page.route("**/api/onboarding", async (route) => {
  7  |     await route.fulfill({
  8  |       status: 200,
  9  |       contentType: "application/json",
  10 |       body: JSON.stringify({
  11 |         learnerId: "550e8400-e29b-41d4-a716-446655440111",
  12 |         onboardingStatus: "PROGRAM_SELECTED",
  13 |       }),
  14 |     })
  15 |   })
  16 | 
  17 |   await page.route("**/api/assessment/start", async (route) => {
  18 |     await route.fulfill({
  19 |       status: 200,
  20 |       contentType: "application/json",
  21 |       body: JSON.stringify({
  22 |         assessmentSessionId: "550e8400-e29b-41d4-a716-446655440222",
  23 |         questions: [
  24 |           { questionId: "q1", prompt: "Question 1", type: "OPEN_TEXT" },
  25 |           { questionId: "q2", prompt: "Question 2", type: "OPEN_TEXT" },
  26 |           { questionId: "q3", prompt: "Question 3", type: "OPEN_TEXT" },
  27 |         ],
  28 |         progress: { currentStep: 1, totalSteps: 3 },
  29 |       }),
  30 |     })
  31 |   })
  32 | 
  33 |   await page.route("**/api/assessment/submit", async (route) => {
  34 |     await route.fulfill({
  35 |       status: 200,
  36 |       contentType: "application/json",
  37 |       body: JSON.stringify({
  38 |         assessmentSessionId: "550e8400-e29b-41d4-a716-446655440222",
  39 |         scoreTotal: 0.82,
  40 |         scoreBreakdown: { logic: 0.82, communication: 0.75, creativity: 0.87 },
  41 |         learningPathId: "550e8400-e29b-41d4-a716-446655440333",
  42 |         adaptationSummary: {
  43 |           strengths: ["logic", "creativity"],
  44 |           improvements: ["communication"],
  45 |         },
  46 |       }),
  47 |     })
  48 |   })
  49 | 
  50 |   await page.route("**/api/learning-path", async (route) => {
  51 |     await route.fulfill({
  52 |       status: 200,
  53 |       contentType: "application/json",
  54 |       body: JSON.stringify({
  55 |         learningPathId: "550e8400-e29b-41d4-a716-446655440333",
  56 |         programCode: "WEB_DEV",
  57 |         version: 1,
  58 |         units: [
  59 |           { unitId: "unit-1", title: "HTML Foundations", sequenceIndex: 1, state: "UNLOCKED" },
  60 |           { unitId: "unit-2", title: "CSS Basics", sequenceIndex: 2, state: "LOCKED" },
  61 |         ],
  62 |       }),
  63 |     })
  64 |   })
  65 | 
  66 |   await page.goto("/sign-in")
  67 | 
  68 |   await page.locator("#name").fill("Learner Test")
  69 |   await page.locator("#email").fill(`learner-${unique}@example.com`)
  70 |   await page.locator("#password").fill("Password123!")
  71 |   await page.getByRole("button", { name: /continue/i }).click()
  72 | 
  73 |   await expect(page).toHaveURL(/.*onboarding\/age-level/)
  74 | 
  75 |   await page.getByRole("button", { name: /8-12|a_8_12/i }).click()
  76 |   await page.getByRole("button", { name: /continue/i }).click()
  77 | 
  78 |   await expect(page).toHaveURL(/.*onboarding\/program/)
  79 | 
  80 |   await page.getByRole("button", { name: /web|développement|web_dev/i }).click()
  81 |   await page.getByRole("button", { name: /évaluation|assessment|continuer/i }).last().click()
  82 |   await expect(page).toHaveURL(/.*onboarding\/assessment/)
  83 | 
  84 |   await page.getByRole("button", { name: /commencer|start/i }).click()
  85 |   const inputs = page.getByRole("textbox")
  86 |   await inputs.nth(0).fill("I enjoy coding challenges and small projects.")
  87 |   await inputs.nth(1).fill("I build projects every week with friends.")
  88 |   await inputs.nth(2).fill("I want to improve problem solving this month.")
  89 |   await page.getByRole("button", { name: /envoyer|submit/i }).click()
  90 | 
> 91 |   await expect(page).toHaveURL(/.*onboarding\/feedback/)
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  92 |   await page.getByRole("link", { name: /aller au tableau de bord|go dashboard/i }).click()
  93 |   await expect(page).toHaveURL(/.*dashboard/)
  94 |   await expect(page.getByText(/html foundations/i).first()).toBeVisible()
  95 | })
  96 | 
```