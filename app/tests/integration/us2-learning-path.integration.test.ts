import { describe, expect, it, vi } from "vitest"
import { PathUnitState } from "@prisma/client"
import { learningPathRepository } from "@/repositories/learning-path-repository"
import { learningPathService } from "@/services/learning-path-service"
import { personalizationService } from "@/services/personalization-service"

describe("US2 integration: learning path progression", () => {
  it("blocks progression when prerequisites are incomplete", async () => {
    const getPathUnitSpy = vi.spyOn(learningPathRepository, "getPathUnitForLearner").mockResolvedValue({
      activePath: {
        id: "path-1",
        units: [
          { unitId: "unit-prereq", state: PathUnitState.UNLOCKED },
          { unitId: "unit-target", state: PathUnitState.UNLOCKED },
        ],
      },
      unit: {
        id: "path-unit-target",
        unitId: "unit-target",
        sequenceIndex: 2,
        state: PathUnitState.UNLOCKED,
        startedAt: null,
        unit: {
          prerequisites: [{ prerequisiteUnitId: "unit-prereq" }],
        },
      },
    } as never)

    await expect(
      learningPathService.updateUnitProgress("learner-1", "unit-target", {
        state: PathUnitState.IN_PROGRESS,
      }),
    ).rejects.toThrow(/prerequisite/i)

    getPathUnitSpy.mockRestore()
  })

  it("allows completion transition, unlocks next unit, and triggers adaptive refresh", async () => {
    const getPathUnitSpy = vi.spyOn(learningPathRepository, "getPathUnitForLearner").mockResolvedValue({
      activePath: {
        id: "path-1",
        units: [
          { unitId: "unit-prereq", state: PathUnitState.COMPLETED },
          { unitId: "unit-target", state: PathUnitState.IN_PROGRESS },
        ],
      },
      unit: {
        id: "path-unit-target",
        unitId: "unit-target",
        sequenceIndex: 2,
        state: PathUnitState.IN_PROGRESS,
        startedAt: new Date(),
        unit: {
          prerequisites: [{ prerequisiteUnitId: "unit-prereq" }],
        },
      },
    } as never)

    const updateSpy = vi.spyOn(learningPathRepository, "updatePathUnit").mockResolvedValue({
      unitId: "unit-target",
      state: PathUnitState.COMPLETED,
      projectSubmissionStatus: "SUBMITTED",
      reflectionCompleted: true,
    } as never)
    const unlockSpy = vi.spyOn(learningPathRepository, "unlockNextUnit").mockResolvedValue(null)
    const triggerSpy = vi
      .spyOn(personalizationService, "triggerAdaptiveRefreshFromProgress")
      .mockResolvedValue({ triggered: true })

    const result = await learningPathService.updateUnitProgress("learner-1", "unit-target", {
      state: PathUnitState.COMPLETED,
      projectSubmissionStatus: "SUBMITTED",
      reflectionCompleted: true,
    })

    expect(result.state).toBe("COMPLETED")
    expect(unlockSpy).toHaveBeenCalledOnce()
    expect(triggerSpy).toHaveBeenCalledOnce()

    getPathUnitSpy.mockRestore()
    updateSpy.mockRestore()
    unlockSpy.mockRestore()
    triggerSpy.mockRestore()
  })
})
