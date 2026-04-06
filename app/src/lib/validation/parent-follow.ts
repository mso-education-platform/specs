import { z } from "zod"

export const parentFollowRequestCreateSchema = z.object({
  learnerEmail: z.string().email(),
  relationshipType: z.string().min(2).max(80),
  note: z.string().max(500).optional(),
})

export const reviewParentFollowRequestSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reviewNote: z.string().max(500).optional(),
})

export const parentFollowRequestCreatedResponseSchema = z.object({
  requestId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  parentName: z.string(),
  learnerName: z.string(),
  createdAt: z.string(),
})

export const adminParentFollowRequestItemSchema = z.object({
  requestId: z.string(),
  parentUserId: z.string(),
  parentName: z.string(),
  parentEmail: z.string().email(),
  learnerId: z.string(),
  learnerName: z.string(),
  learnerEmail: z.string().email(),
  relationshipType: z.string(),
  note: z.string().nullable().optional(),
  createdAt: z.string(),
})

export const adminParentFollowRequestListResponseSchema = z.object({
  unreadNotificationsCount: z.number().int().nonnegative(),
  requests: z.array(adminParentFollowRequestItemSchema),
})

export const adminReviewParentFollowRequestResponseSchema = z.object({
  requestId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  parentName: z.string(),
  learnerName: z.string(),
  reviewedAt: z.string().nullable(),
  reviewedByUserId: z.string().nullable(),
  reviewNote: z.string().nullable(),
})

export type ParentFollowRequestCreateDto = z.infer<typeof parentFollowRequestCreateSchema>
export type ReviewParentFollowRequestDto = z.infer<typeof reviewParentFollowRequestSchema>
export type ParentFollowRequestCreatedResponseDto = z.infer<typeof parentFollowRequestCreatedResponseSchema>
export type AdminParentFollowRequestListResponseDto = z.infer<typeof adminParentFollowRequestListResponseSchema>
export type AdminReviewParentFollowRequestResponseDto = z.infer<typeof adminReviewParentFollowRequestResponseSchema>
