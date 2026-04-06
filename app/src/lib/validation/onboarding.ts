import { z } from "zod"
import { ProgramCode, AgeLevel } from "@prisma/client"

export const confirmAgeSchema = z.object({
  ageLevel: z.nativeEnum(AgeLevel),
})

export const programSelectSchema = z.object({
  programCode: z.nativeEnum(ProgramCode),
})

export const onboardingPayloadSchema = z.object({
  ageLevel: z.nativeEnum(AgeLevel),
  programCode: z.nativeEnum(ProgramCode),
})

export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>

export const onboardingRequestSchema = z.object({
  ageLevel: z.nativeEnum(AgeLevel),
  programCode: z.nativeEnum(ProgramCode),
})

export type OnboardingRequestDto = z.infer<typeof onboardingRequestSchema>
