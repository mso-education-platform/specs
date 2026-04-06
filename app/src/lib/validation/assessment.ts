import { z } from "zod"
import { ProgramCode } from "@prisma/client"

export const assessmentStartSchema = z.object({
  programCode: z.nativeEnum(ProgramCode),
})

export const assessmentResponseItem = z.object({
  questionId: z.string().min(1),
  response: z.union([z.string(), z.number(), z.array(z.string())]),
})

export const assessmentSubmitSchema = z.object({
  assessmentSessionId: z.string().uuid(),
  responses: z.array(assessmentResponseItem).min(1),
})

export type AssessmentStartDto = z.infer<typeof assessmentStartSchema>
export type AssessmentSubmitDto = z.infer<typeof assessmentSubmitSchema>

