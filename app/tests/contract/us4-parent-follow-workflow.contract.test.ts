import { describe, expect, it } from "vitest"
import {
  adminParentFollowRequestListResponseSchema,
  adminReviewParentFollowRequestResponseSchema,
  parentFollowRequestCreatedResponseSchema,
} from "@/lib/validation/parent-follow"

describe("US4 contract: parent follow workflow", () => {
  it("accepts valid parent follow request creation payload", () => {
    const payload = parentFollowRequestCreatedResponseSchema.parse({
      requestId: "550e8400-e29b-41d4-a716-446655440301",
      status: "PENDING",
      parentName: "Parent One",
      learnerName: "Child One",
      createdAt: new Date().toISOString(),
    })

    expect(payload.status).toBe("PENDING")
  })

  it("accepts valid admin pending request list payload", () => {
    const payload = adminParentFollowRequestListResponseSchema.parse({
      unreadNotificationsCount: 2,
      requests: [
        {
          requestId: "550e8400-e29b-41d4-a716-446655440302",
          parentUserId: "550e8400-e29b-41d4-a716-446655440303",
          parentName: "Parent One",
          parentEmail: "parent.one@example.com",
          learnerId: "550e8400-e29b-41d4-a716-446655440304",
          learnerName: "Child One",
          learnerEmail: "child.one@example.com",
          relationshipType: "Parent",
          note: "Needs follow access",
          createdAt: new Date().toISOString(),
        },
      ],
    })

    expect(payload.requests).toHaveLength(1)
  })

  it("accepts valid admin review response payload", () => {
    const payload = adminReviewParentFollowRequestResponseSchema.parse({
      requestId: "550e8400-e29b-41d4-a716-446655440305",
      status: "APPROVED",
      parentName: "Parent One",
      learnerName: "Child One",
      reviewedAt: new Date().toISOString(),
      reviewedByUserId: "550e8400-e29b-41d4-a716-446655440306",
      reviewNote: null,
    })

    expect(payload.status).toBe("APPROVED")
  })
})
