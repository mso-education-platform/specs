export type ClientSession = {
  userId: string
  role: "LEARNER" | "EDUCATOR" | "PARENT" | "MENTOR" | "ADMIN"
  email: string
  name: string
}

const SESSION_KEY = "learning-platform-session"

export function getClientSession(): ClientSession | null {
  if (typeof window === "undefined") {
    return null
  }

  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as ClientSession
  } catch {
    return null
  }
}

export function setClientSession(session: ClientSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function buildSessionHeaders() {
  const session = getClientSession()

  if (!session) {
    return {}
  }

  return {
    "x-user-id": session.userId,
    "x-user-role": session.role,
    "x-user-email": session.email,
    "x-user-name": session.name,
  }
}
