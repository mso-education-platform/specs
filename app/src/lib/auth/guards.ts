import { UserRole } from "@prisma/client"
import { ApiError } from "@/lib/api-errors"
import type { AppSession } from "@/lib/auth/session"

export function requireRole(session: AppSession, allowedRoles: UserRole[]) {
  if (!allowedRoles.includes(session.role)) {
    throw new ApiError(403, "FORBIDDEN", "You do not have access to this resource.")
  }
}

export function requireLearner(session: AppSession) {
  requireRole(session, [UserRole.LEARNER])
}

export function requireEducator(session: AppSession) {
  requireRole(session, [UserRole.EDUCATOR, UserRole.ADMIN])
}

export function requireParent(session: AppSession) {
  requireRole(session, [UserRole.PARENT, UserRole.ADMIN])
}

export function requireLinkedParent(parentHasLink: boolean) {
  if (!parentHasLink) {
    throw new ApiError(403, "PARENT_LINK_REQUIRED", "Parent account is not linked to this learner.")
  }
}
