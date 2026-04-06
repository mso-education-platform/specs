import { describe, expect, it, vi } from "vitest"
import { UserRole } from "@prisma/client"
import * as sessionModule from "@/lib/auth/session"
import * as parentFollowServiceModule from "@/services/parent-follow-service"
import { POST as createParentFollowRequest } from "@/app/api/parent/follow-requests/route"
import { GET as getAdminPendingRequests } from "@/app/api/admin/parent-follow-requests/route"
import { PATCH as reviewParentFollowRequest } from "@/app/api/admin/parent-follow-requests/[requestId]/route"

describe("US4 integration: parent follow request workflow", () => {
  it("allows parent to submit follow request", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "parent-1",
      role: UserRole.PARENT,
      email: "parent@example.com",
      name: "Parent",
    })

    const serviceSpy = vi.spyOn(parentFollowServiceModule.parentFollowService, "submitParentFollowRequest").mockResolvedValue({
      requestId: "request-1",
      status: "PENDING",
      parentName: "Parent",
      learnerName: "Child",
      createdAt: new Date().toISOString(),
    })

    const response = await createParentFollowRequest(
      new Request("http://localhost/api/parent/follow-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          learnerEmail: "child@example.com",
          relationshipType: "Parent",
        }),
      }),
    )

    const payload = await response.json()
    expect(response.status).toBe(201)
    expect(payload.status).toBe("PENDING")

    sessionSpy.mockRestore()
    serviceSpy.mockRestore()
  })

  it("allows admin to list pending requests", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "admin-1",
      role: UserRole.ADMIN,
      email: "admin@example.com",
      name: "Admin",
    })

    const serviceSpy = vi.spyOn(parentFollowServiceModule.parentFollowService, "getAdminPendingRequests").mockResolvedValue({
      unreadNotificationsCount: 1,
      requests: [
        {
          requestId: "request-1",
          parentUserId: "parent-1",
          parentName: "Parent",
          parentEmail: "parent@example.com",
          learnerId: "learner-1",
          learnerName: "Child",
          learnerEmail: "child@example.com",
          relationshipType: "Parent",
          note: null,
          createdAt: new Date().toISOString(),
        },
      ],
    })

    const response = await getAdminPendingRequests()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.unreadNotificationsCount).toBe(1)
    expect(payload.requests).toHaveLength(1)

    sessionSpy.mockRestore()
    serviceSpy.mockRestore()
  })

  it("allows admin to approve a parent request", async () => {
    const sessionSpy = vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
      userId: "admin-1",
      role: UserRole.ADMIN,
      email: "admin@example.com",
      name: "Admin",
    })

    const serviceSpy = vi.spyOn(parentFollowServiceModule.parentFollowService, "reviewParentFollowRequest").mockResolvedValue({
      requestId: "request-1",
      status: "APPROVED",
      parentName: "Parent",
      learnerName: "Child",
      reviewedAt: new Date().toISOString(),
      reviewedByUserId: "admin-1",
      reviewNote: null,
    })

    const response = await reviewParentFollowRequest(
      new Request("http://localhost/api/admin/parent-follow-requests/request-1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      }),
      {
        params: Promise.resolve({ requestId: "request-1" }),
      },
    )

    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.status).toBe("APPROVED")

    sessionSpy.mockRestore()
    serviceSpy.mockRestore()
  })
})
