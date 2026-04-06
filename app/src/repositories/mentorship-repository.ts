import { MentorshipStatus, Urgency } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

export const mentorshipRepository = {
  async createRequest(input: {
    learnerId: string
    topic: string
    urgency: Urgency
    requestedMentorId?: string
  }) {
    return prisma.mentorshipRequest.create({
      data: {
        learnerId: input.learnerId,
        topic: input.topic,
        urgency: input.urgency,
        requestedMentorId: input.requestedMentorId,
        status: MentorshipStatus.OPEN,
      },
    })
  },

  async listLearnerRequests(learnerId: string) {
    return prisma.mentorshipRequest.findMany({
      where: { learnerId },
      orderBy: { createdAt: "desc" },
      include: {
        requestedMentor: {
          select: { id: true, name: true, email: true },
        },
      },
    })
  },
}
