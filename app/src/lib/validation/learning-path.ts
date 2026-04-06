import { z } from "zod"
import { PathUnitState, SubmissionStatus } from "@prisma/client"

export const getLearningPathQuery = z.object({
  learnerId: z.string().uuid().optional(),
})

export const updateUnitProgressSchema = z.object({
  unitId: z.string().uuid(),
  state: z.enum(["LOCKED", "UNLOCKED", "IN_PROGRESS", "COMPLETED", "DEFERRED"]),
  projectSubmissionStatus: z.enum(["NONE", "SUBMITTED", "REVIEWED"]).optional(),
})

export type UpdateUnitProgress = z.infer<typeof updateUnitProgressSchema>

export const unitProgressPatchSchema = z.object({
  state: z.nativeEnum(PathUnitState).optional(),
  projectSubmissionStatus: z.nativeEnum(SubmissionStatus).optional(),
  reflectionCompleted: z.boolean().optional(),
})

export type UnitProgressPatchDto = z.infer<typeof unitProgressPatchSchema>
