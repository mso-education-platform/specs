import { describe, expect, it } from "vitest"
import {
  learningPathResponseSchema,
  unitProgressPatchResponseSchema,
  unitProgressPatchSchema,
} from "@/lib/validation/learning-path"

describe("US2 contract: learning path and unit progress", () => {
  it("accepts valid learning path response payload", () => {
    const payload = learningPathResponseSchema.parse({
      learningPathId: "550e8400-e29b-41d4-a716-446655440000",
      programCode: "WEB_DEV",
      version: 1,
      units: [
        {
          unitId: "550e8400-e29b-41d4-a716-446655440001",
          title: "HTML Foundations",
          objective: "Learn semantic HTML and page structure.",
          sequenceIndex: 1,
          state: "UNLOCKED",
          projectSubmissionStatus: "NONE",
          reflectionCompleted: false,
          prerequisites: [],
        },
      ],
    })

    expect(payload.units).toHaveLength(1)
    expect(payload.units[0].state).toBe("UNLOCKED")
  })

  it("accepts valid unit progress patch request", () => {
    const payload = unitProgressPatchSchema.parse({
      state: "COMPLETED",
      projectSubmissionStatus: "SUBMITTED",
      reflectionCompleted: true,
    })

    expect(payload.state).toBe("COMPLETED")
    expect(payload.reflectionCompleted).toBe(true)
  })

  it("accepts valid unit progress patch response", () => {
    const payload = unitProgressPatchResponseSchema.parse({
      unitId: "550e8400-e29b-41d4-a716-446655440001",
      state: "IN_PROGRESS",
      projectSubmissionStatus: "NONE",
      reflectionCompleted: false,
    })

    expect(payload.unitId).toContain("550e8400")
  })

  it("rejects malformed learning path response payload", () => {
    expect(() =>
      learningPathResponseSchema.parse({
        learningPathId: "not-a-uuid",
        programCode: "WEB_DEV",
        version: 1,
        units: [],
      }),
    ).toThrow()
  })
})
