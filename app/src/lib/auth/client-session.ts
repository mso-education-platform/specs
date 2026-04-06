export type ClientSession = {
  userId: string
  role: "LEARNER" | "EDUCATOR" | "PARENT" | "MENTOR" | "ADMIN"
  email: string
  name: string
}

const SESSION_KEY = "learning-platform-session"
const ONBOARDING_COMPLETED_KEY = "learning-platform-onboarding-completed"
export const CLIENT_SESSION_CHANGED_EVENT = "learning-platform-session-changed"

function emitClientSessionChanged() {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new Event(CLIENT_SESSION_CHANGED_EVENT))
}

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
  emitClientSessionChanged()
}

export function clearClientSession() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(SESSION_KEY)
  emitClientSessionChanged()
}

export function markClientOnboardingCompleted() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true")
}

export function isClientOnboardingCompleted() {
  if (typeof window === "undefined") {
    return false
  }

  return window.localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true"
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
