import { z } from "zod"

export const confirmAgeSchema = z.object({
  ageLevel: z.enum(["A_8_12", "B_13_18"]),
})

export const programSelectSchema = z.object({
  programCode: z.enum(["WEB_DEV", "AI_ORIENTED"]),
})

export const onboardingPayloadSchema = z.object({
  ageLevel: z.enum(["A_8_12", "B_13_18"]),
  programCode: z.enum(["WEB_DEV", "AI_ORIENTED"]),
})

export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>
import { ProgramCode, AgeLevel } from "@prisma/client"
import { z } from "zod"

export const onboardingRequestSchema = z.object({
  ageLevel: z.nativeEnum(AgeLevel),
  programCode: z.nativeEnum(ProgramCode),
})

export type OnboardingRequestDto = z.infer<typeof onboardingRequestSchema>
