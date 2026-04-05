"use client"

import { useState } from "react"
import { buildSessionHeaders } from "@/lib/auth/client-session"

type AssessmentQuestion = {
  questionId: string
  prompt: string
  type: "MULTIPLE_CHOICE" | "OPEN_TEXT" | "SCENARIO"
  choices?: string[]
}

type AssessmentStartResponse = {
  assessmentSessionId: string
  questions: AssessmentQuestion[]
  progress: {
    currentStep: number
    totalSteps: number
  }
}

type AssessmentSubmitResponse = {
  assessmentSessionId: string
  scoreTotal: number
  scoreBreakdown: Record<string, number>
  learningPathId: string
  adaptationSummary: {
    strengths: string[]
    improvements: string[]
  }
}

export function useAssessmentSession() {
  const [loading, setLoading] = useState(false)
  const [startPayload, setStartPayload] = useState<AssessmentStartResponse | null>(null)
  const [submitPayload, setSubmitPayload] = useState<AssessmentSubmitResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function start(programCode: "WEB_DEV" | "AI_ORIENTED") {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/assessment/start", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...buildSessionHeaders(),
        },
        body: JSON.stringify({ programCode }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Could not start assessment.")
      }

      setStartPayload(data)
      return data as AssessmentStartResponse
    } catch (startError) {
      const message = startError instanceof Error ? startError.message : "Could not start assessment."
      setError(message)
      throw startError
    } finally {
      setLoading(false)
    }
  }

  async function submit(assessmentSessionId: string, responses: Array<{ questionId: string; response: string }>) {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...buildSessionHeaders(),
        },
        body: JSON.stringify({
          assessmentSessionId,
          responses,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Could not submit assessment.")
      }

      setSubmitPayload(data)
      return data as AssessmentSubmitResponse
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Could not submit assessment."
      setError(message)
      throw submitError
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    startPayload,
    submitPayload,
    start,
    submit,
  }
}
