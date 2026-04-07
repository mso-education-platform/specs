import { z } from "zod"
import { PathUnitState, ProgramCode, SubmissionStatus } from "@prisma/client"

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

export const learningPathUnitSchema = z.object({
  unitId: z.string().uuid(),
  title: z.string().min(1),
  objective: z.string().min(1),
  sequenceIndex: z.number().int().positive(),
  state: z.nativeEnum(PathUnitState),
  projectSubmissionStatus: z.nativeEnum(SubmissionStatus),
  reflectionCompleted: z.boolean(),
  prerequisites: z.array(z.string().uuid()),
})

export const learningPathResponseSchema = z.object({
  learningPathId: z.string().uuid(),
  programCode: z.enum(["WEB_DEV", "AI_ORIENTED"]),
  version: z.number().int().positive(),
  units: z.array(learningPathUnitSchema),
})

export const unitProgressPatchResponseSchema = z.object({
  unitId: z.string().uuid(),
  state: z.nativeEnum(PathUnitState),
  projectSubmissionStatus: z.nativeEnum(SubmissionStatus),
  reflectionCompleted: z.boolean(),
})

export const enrollProgramSchema = z.object({
  programCode: z.nativeEnum(ProgramCode),
})

export type EnrollProgramDto = z.infer<typeof enrollProgramSchema>

export type UnitProgressPatchDto = z.infer<typeof unitProgressPatchSchema>
