import { describe, expect, it } from "vitest"
import { onboardingRequestSchema } from "@/lib/validation/onboarding"
import { assessmentStartSchema, assessmentSubmitSchema } from "@/lib/validation/assessment"

describe("US1 contract: onboarding and assessment payloads", () => {
  it("accepts valid onboarding payload", () => {
    const payload = onboardingRequestSchema.parse({
      ageLevel: "A_8_12",
      programCode: "WEB_DEV",
    })

    expect(payload.ageLevel).toBe("A_8_12")
    expect(payload.programCode).toBe("WEB_DEV")
  })

  it("accepts valid assessment start payload", () => {
    const payload = assessmentStartSchema.parse({
      programCode: "AI_ORIENTED",
    })

    expect(payload.programCode).toBe("AI_ORIENTED")
  })

  it("accepts valid assessment submit payload", () => {
    const payload = assessmentSubmitSchema.parse({
      assessmentSessionId: "550e8400-e29b-41d4-a716-446655440000",
      responses: [
        {
          questionId: "q1",
          response: "I practice weekly",
        },
      ],
    })

    expect(payload.responses).toHaveLength(1)
  })
})
