"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { buildSessionHeaders, getClientSession } from "@/lib/auth/client-session"
import { EducatorCohortAnalytics } from "@/components/dashboards/EducatorCohortAnalytics"
import { InterventionQueue } from "@/components/dashboards/InterventionQueue"
import { AdaptationDecisionLog } from "@/components/dashboards/AdaptationDecisionLog"
import { AdminParentFollowRequests } from "@/components/dashboards/AdminParentFollowRequests"
import { useTranslation } from "@/components/i18n/I18nProvider"
import type { EducatorDashboardResponseDto } from "@/lib/validation/dashboard"

type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
  }
}

export default function EducatorDashboardPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<EducatorDashboardResponseDto | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mapApiError = useCallback((payload: ApiErrorPayload) => {
    return payload.error?.message ?? t("educator_dashboard.errors.load_failed")
  }, [t])

  useEffect(() => {
    setIsAdmin(getClientSession()?.role === "ADMIN")

    async function loadDashboard() {
      setLoading(true)
      setError(null)

      try {
        const headers = new Headers()
        const sessionHeaders = buildSessionHeaders()
        Object.entries(sessionHeaders).forEach(([key, value]) => {
          if (value) {
            headers.set(key, String(value))
          }
        })
        const response = await fetch("/api/dashboard/educator", { headers })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(mapApiError(payload as ApiErrorPayload))
        }

        setData(payload)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t("educator_dashboard.errors.load_failed"))
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [mapApiError, t])

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <h1 className="text-2xl font-semibold">{t("educator_dashboard.title")}</h1>

      {loading ? <Card className="p-4">{t("educator_dashboard.loading")}</Card> : null}
      {error ? <Card className="p-4 text-destructive">{error}</Card> : null}

      {!loading && !error && data ? (
        <div className="space-y-4">
          <EducatorCohortAnalytics cohortSummary={data.cohortSummary} />
          <InterventionQueue items={data.interventionQueue} />
          <AdaptationDecisionLog items={data.adaptationHistory} />
          {isAdmin ? <AdminParentFollowRequests /> : null}
        </div>
      ) : null}
    </div>
  )
}
