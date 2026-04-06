import { ApiError } from "@/lib/api-errors"
import { parentFollowRepository } from "@/repositories/parent-follow-repository"
import type { ParentFollowRequestCreateDto, ReviewParentFollowRequestDto } from "@/lib/validation/parent-follow"

export const parentFollowService = {
  async submitParentFollowRequest(parentUserId: string, payload: ParentFollowRequestCreateDto) {
    const learner = await parentFollowRepository.findLearnerByEmail(payload.learnerEmail)

    if (!learner) {
      throw new ApiError(404, "LEARNER_NOT_FOUND", "Learner account was not found for this email.")
    }

    const existingLink = await parentFollowRepository.findApprovedParentLink(parentUserId, learner.id)
    if (existingLink) {
      throw new ApiError(409, "PARENT_ALREADY_LINKED", "Parent is already linked to this learner.")
    }

    const pendingRequest = await parentFollowRepository.findPendingRequest(parentUserId, learner.id)
    if (pendingRequest) {
      throw new ApiError(409, "PARENT_REQUEST_ALREADY_PENDING", "A parent follow request is already pending.")
    }

    const createdRequest = await parentFollowRepository.createRequest({
      parentUserId,
      learnerId: learner.id,
      relationshipType: payload.relationshipType,
      note: payload.note,
    })

    await parentFollowRepository.createAdminNotification({
      parentFollowRequestId: createdRequest.id,
      title: "New parent follow request",
      message: `${createdRequest.parent.name} requested follow access for ${createdRequest.learner.user.name}.`,
    })

    return {
      requestId: createdRequest.id,
      status: createdRequest.status as "PENDING" | "APPROVED" | "REJECTED",
      parentName: createdRequest.parent.name,
      learnerName: createdRequest.learner.user.name,
      createdAt: createdRequest.createdAt.toISOString(),
    }
  },

  async getAdminPendingRequests() {
    const [pendingRequests, unreadNotificationsCount] = await Promise.all([
      parentFollowRepository.listPendingRequests(),
      parentFollowRepository.countUnreadAdminNotifications(),
    ])

    return {
      unreadNotificationsCount,
      requests: pendingRequests.map((request: {
        id: string
        parentUserId: string
        parent: { name: string; email: string }
        learnerId: string
        learner: { user: { name: string; email: string } }
        relationshipType: string
        note: string | null
        createdAt: Date
      }) => ({
        requestId: request.id,
        parentUserId: request.parentUserId,
        parentName: request.parent.name,
        parentEmail: request.parent.email,
        learnerId: request.learnerId,
        learnerName: request.learner.user.name,
        learnerEmail: request.learner.user.email,
        relationshipType: request.relationshipType,
        note: request.note,
        createdAt: request.createdAt.toISOString(),
      })),
    }
  },

  async reviewParentFollowRequest(adminUserId: string, requestId: string, payload: ReviewParentFollowRequestDto) {
    const request = await parentFollowRepository.getRequestById(requestId)

    if (!request) {
      throw new ApiError(404, "PARENT_REQUEST_NOT_FOUND", "Parent follow request not found.")
    }

    if (request.status !== "PENDING") {
      throw new ApiError(409, "PARENT_REQUEST_ALREADY_REVIEWED", "Parent follow request has already been reviewed.")
    }

    const status: "APPROVED" | "REJECTED" = payload.action === "APPROVE" ? "APPROVED" : "REJECTED"

    const reviewedRequest = await parentFollowRepository.reviewRequest({
      requestId,
      reviewerId: adminUserId,
      status,
      reviewNote: payload.reviewNote,
    })

    if (status === "APPROVED") {
      await parentFollowRepository.upsertParentLink({
        parentUserId: reviewedRequest.parentUserId,
        learnerId: reviewedRequest.learnerId,
        relationshipType: reviewedRequest.relationshipType,
      })
    }

    await parentFollowRepository.markNotificationAsReadForRequest(requestId)

    return {
      requestId: reviewedRequest.id,
      status: reviewedRequest.status as "PENDING" | "APPROVED" | "REJECTED",
      parentName: reviewedRequest.parent.name,
      learnerName: reviewedRequest.learner.user.name,
      reviewedAt: reviewedRequest.reviewedAt?.toISOString() ?? null,
      reviewedByUserId: reviewedRequest.reviewedByUserId,
      reviewNote: reviewedRequest.reviewNote ?? null,
    }
  },
}
