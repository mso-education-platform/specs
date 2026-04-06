"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PersonalizationFeedback } from "@/components/assessment/PersonalizationFeedback"
import { getClientSession, isClientOnboardingCompleted } from "@/lib/auth/client-session"

export default function FeedbackPage() {
  const router = useRouter()

  useEffect(() => {
    const session = getClientSession()

    const completed = isClientOnboardingCompleted()

    // If onboarding is already completed and there is no recent assessment
    // result, redirect to the dashboard. This allows the feedback page to be
    // visited immediately after completing the assessment (the assessment
    // stores a transient `assessment-result` in sessionStorage).
    const hasAssessmentResult = typeof window !== "undefined" && !!window.sessionStorage.getItem("assessment-result")

    if (session && completed && !hasAssessmentResult) {
      if (session.role === "EDUCATOR" || session.role === "ADMIN") {
        router.replace("/educator/dashboard")
      } else if (session.role === "PARENT") {
        router.replace("/parent/dashboard")
      } else {
        router.replace("/dashboard")
      }
    }
  }, [router])

  return <PersonalizationFeedback />
}
