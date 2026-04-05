"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/I18nProvider"

type AssessmentResult = {
  scoreTotal: number
  adaptationSummary: {
    strengths: string[]
    improvements: string[]
  }
}

export function PersonalizationFeedback() {
  const { t } = useTranslation()
  const result = useMemo(() => {
    if (typeof window === "undefined") {
      return null
    }

    const raw = window.sessionStorage.getItem("assessment-result")
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as AssessmentResult
    } catch {
      return null
    }
  }, [])

  return (
    <Card className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{t("feedback.title")}</h1>
      {!result ? (
        <p className="text-sm text-muted-foreground">{t("feedback.no_result")}</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{t("feedback.score")} : {(result.scoreTotal * 100).toFixed(0)}%</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="font-medium">{t("feedback.strengths")}</h2>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {result.adaptationSummary.strengths.length ? result.adaptationSummary.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                )) : <li>{t("feedback.baseline_confidence")}</li>}
              </ul>
            </div>
            <div>
              <h2 className="font-medium">{t("feedback.focus_areas")}</h2>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {result.adaptationSummary.improvements.length ? result.adaptationSummary.improvements.map((improvement) => (
                  <li key={improvement}>{improvement}</li>
                )) : <li>{t("feedback.keep_rhythm")}</li>}
              </ul>
            </div>
          </div>
        </>
      )}

      <Button asChild>
        <Link href="/dashboard">{t("feedback.go_dashboard")}</Link>
      </Button>
    </Card>
  )
}
