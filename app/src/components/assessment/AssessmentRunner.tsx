"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAssessmentSession } from "@/hooks/useAssessmentSession"
import { useTranslation } from "@/components/i18n/I18nProvider"
import { markClientOnboardingCompleted } from "@/lib/auth/client-session"

export function AssessmentRunner() {
  const router = useRouter()
  const { start, submit, startPayload, loading, error } = useAssessmentSession()
  const { t } = useTranslation()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [starting, setStarting] = useState(false)

  const programCode = (typeof window !== "undefined" ? window.sessionStorage.getItem("program-code") : null) as
    | "WEB_DEV"
    | "AI_ORIENTED"
    | null

  const allAnswered = useMemo(() => {
    if (!startPayload) {
      return false
    }

    return startPayload.questions.every((question) => Boolean(answers[question.questionId]))
  }, [answers, startPayload])

  const handleStart = async () => {
    if (!programCode) {
      return
    }

    setStarting(true)
    try {
      await start(programCode)
    } finally {
      setStarting(false)
    }
  }

  const handleSubmit = async () => {
    if (!startPayload || !allAnswered) {
      return
    }

    const payload = await submit(
      startPayload.assessmentSessionId,
      startPayload.questions.map((question) => ({
        questionId: question.questionId,
        response: answers[question.questionId],
      })),
    )

    window.sessionStorage.setItem("assessment-result", JSON.stringify(payload))
    // Navigate to the feedback page first, then mark onboarding completed to
    // avoid the feedback page immediately redirecting to the dashboard.
    router.push("/onboarding/feedback")
    markClientOnboardingCompleted()
  }

  return (
    <Card className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{t("assessment.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("assessment.subtitle")}</p>

      {!startPayload ? (
        <Button onClick={handleStart} disabled={!programCode || starting || loading}>
          {starting || loading ? t("assessment.starting") : t("assessment.start")}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-3 text-sm">
            Step {startPayload.progress.currentStep} of {startPayload.progress.totalSteps}
          </div>

          {startPayload.questions.map((question) => (
            <div key={question.questionId} className="space-y-2">
              <p className="font-medium">{t(question.promptKey ?? question.prompt)}</p>
              <Input
                placeholder={t("assessment.placeholder")}
                value={answers[question.questionId] ?? ""}
                onChange={(event) =>
                  setAnswers((previous) => ({
                    ...previous,
                    [question.questionId]: event.target.value,
                  }))
                }
              />
            </div>
          ))}

          <Button onClick={handleSubmit} disabled={!allAnswered || loading}>
            {loading ? t("assessment.submitting") : t("assessment.submit")}
          </Button>
        </div>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Card>
  )
}
