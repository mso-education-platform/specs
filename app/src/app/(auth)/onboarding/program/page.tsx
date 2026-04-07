"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProgramSelectionStep } from "@/components/onboarding/ProgramSelectionStep"
import { getClientSession, isClientOnboardingCompleted } from "@/lib/auth/client-session"

export default function ProgramPage() {
  const router = useRouter()

  useEffect(() => {
    const session = getClientSession()

    // If the user already completed onboarding, normally we redirect them to their dashboard.
    // However, if they came from the `tracks` page to enroll in a program we set
    // `onboarding-default-program` in sessionStorage. In that case, allow visiting this
    // page so the program can be pre-selected and submitted.
    const hasDefaultProgram = typeof window !== "undefined" && !!window.sessionStorage.getItem("onboarding-default-program")

    if (session && isClientOnboardingCompleted() && !hasDefaultProgram) {
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
