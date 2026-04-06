"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProgramSelectionStep } from "@/components/onboarding/ProgramSelectionStep"
import { getClientSession, isClientOnboardingCompleted } from "@/lib/auth/client-session"

export default function ProgramPage() {
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
    }
  }, [router])

  return <ProgramSelectionStep />
}
