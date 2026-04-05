import { UserRole } from "@prisma/client"
import { headers } from "next/headers"
import { ApiError } from "@/lib/api-errors"

export type AppSession = {
  userId: string
  role: UserRole
  email?: string
  name?: string
}

function normalizeRole(rawRole: string | null): UserRole {
  if (!rawRole) {
    return UserRole.LEARNER
  }

  const roleCandidate = rawRole.toUpperCase() as UserRole
  return Object.values(UserRole).includes(roleCandidate) ? roleCandidate : UserRole.LEARNER
}

export async function getSession(): Promise<AppSession | null> {
  const headerStore = await headers()
  const userId = headerStore.get("x-user-id")

  if (!userId) {
    return null
  }

  return {
    userId,
    role: normalizeRole(headerStore.get("x-user-role")),
    email: headerStore.get("x-user-email") ?? undefined,
    name: headerStore.get("x-user-name") ?? undefined,
  }
}

export async function requireSession(): Promise<AppSession> {
  const session = await getSession()

  if (!session) {
    throw new ApiError(401, "UNAUTHENTICATED", "You need to sign in to continue.")
  }

  return session
}
