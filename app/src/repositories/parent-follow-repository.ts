import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

export const parentFollowRepository = {
  async findLearnerByEmail(email: string) {
    return prisma.learnerProfile.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
  },

  async findApprovedParentLink(parentUserId: string, learnerId: string) {
    return prisma.parentLearnerLink.findUnique({
      where: {
        parentUserId_learnerId: {
          parentUserId,
          learnerId,
        },
      },
    })
  },

  async findPendingRequest(parentUserId: string, learnerId: string) {
    return prisma.parentFollowRequest.findFirst({
      where: {
        parentUserId,
        learnerId,
        status: "PENDING",
      },
    })
  },

  async createRequest(input: {
    parentUserId: string
    learnerId: string
    relationshipType: string
    note?: string
  }) {
    return prisma.parentFollowRequest.create({
      data: {
        parentUserId: input.parentUserId,
        learnerId: input.learnerId,
        relationshipType: input.relationshipType,
        note: input.note,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        learner: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  },

  async createAdminNotification(input: {
    parentFollowRequestId: string
    title: string
    message: string
  }) {
    return prisma.adminNotification.create({
      data: {
        type: "PARENT_FOLLOW_REQUEST",
        recipientRole: UserRole.ADMIN,
        parentFollowRequestId: input.parentFollowRequestId,
        title: input.title,
        message: input.message,
      },
    })
  },

  async listPendingRequests() {
    return prisma.parentFollowRequest.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        learner: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  },

  async getRequestById(requestId: string) {
    return prisma.parentFollowRequest.findUnique({
      where: { id: requestId },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        learner: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  },

  async reviewRequest(input: {
    requestId: string
    reviewerId: string
    status: "APPROVED" | "REJECTED"
    reviewNote?: string
  }) {
    return prisma.parentFollowRequest.update({
      where: { id: input.requestId },
      data: {
        status: input.status,
        reviewedByUserId: input.reviewerId,
        reviewNote: input.reviewNote,
        reviewedAt: new Date(),
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        learner: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  },

  async upsertParentLink(input: {
    parentUserId: string
    learnerId: string
    relationshipType: string
  }) {
    return prisma.parentLearnerLink.upsert({
      where: {
        parentUserId_learnerId: {
          parentUserId: input.parentUserId,
          learnerId: input.learnerId,
        },
      },
      update: {
        relationshipType: input.relationshipType,
      },
      create: {
        parentUserId: input.parentUserId,
        learnerId: input.learnerId,
        relationshipType: input.relationshipType,
      },
    })
  },

  async countUnreadAdminNotifications() {
    return prisma.adminNotification.count({
      where: {
        recipientRole: UserRole.ADMIN,
        isRead: false,
      },
    })
  },

  async markNotificationAsReadForRequest(parentFollowRequestId: string) {
    return prisma.adminNotification.updateMany({
      where: {
        parentFollowRequestId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })
  },

  async listAdminNotifications() {
    return prisma.adminNotification.findMany({
      where: {
        recipientRole: UserRole.ADMIN,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        parentFollowRequest: {
          include: {
            parent: {
              select: {
                name: true,
                email: true,
              },
            },
            learner: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 100,
    })
  },

  async markNotificationAsRead(notificationId: string) {
    return prisma.adminNotification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
  },
}
