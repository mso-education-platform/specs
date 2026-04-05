import { PathUnitState, SubmissionStatus } from "@prisma/client"
import { z } from "zod"

export const unitProgressPatchSchema = z.object({
  state: z.nativeEnum(PathUnitState).optional(),
  projectSubmissionStatus: z.nativeEnum(SubmissionStatus).optional(),
  reflectionCompleted: z.boolean().optional(),
})

export type UnitProgressPatchDto = z.infer<typeof unitProgressPatchSchema>
