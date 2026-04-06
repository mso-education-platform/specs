import { z } from "zod"

export const mentorshipRequestSchema = z.object({
  topic: z.string().min(3),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
  requestedMentorId: z.string().uuid().optional(),
})

export type MentorshipRequestPayload = z.infer<typeof mentorshipRequestSchema>
import { Urgency } from "@prisma/client"
import { z } from "zod"

export const mentorshipRequestSchema = z.object({
  topic: z.string().min(3),
  urgency: z.nativeEnum(Urgency),
  requestedMentorId: z.string().uuid().optional(),
})

export type MentorshipRequestDto = z.infer<typeof mentorshipRequestSchema>
