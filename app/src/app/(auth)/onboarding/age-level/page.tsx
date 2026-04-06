"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AgeLevelStep } from "@/components/onboarding/AgeLevelStep"
import { getClientSession, isClientOnboardingCompleted } from "@/lib/auth/client-session"

export default function AgeLevelPage() {
  const router = useRouter()

  useEffect(() => {
    const session = getClientSession()

    if (session && isClientOnboardingCompleted()) {
      if (session.role === "EDUCATOR" || session.role === "ADMIN") {
        router.replace("/educator/dashboard")
      } else if (session.role === "PARENT") {
        router.replace("/parent/dashboard")
      } else {
        router.replace("/dashboard")
      }
      return
    }
  }, [router])

  return <AgeLevelStep />
}
