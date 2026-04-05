import { ProgramCode, AgeLevel } from "@prisma/client"
import { z } from "zod"

export const onboardingRequestSchema = z.object({
  ageLevel: z.nativeEnum(AgeLevel),
  programCode: z.nativeEnum(ProgramCode),
})

export type OnboardingRequestDto = z.infer<typeof onboardingRequestSchema>
