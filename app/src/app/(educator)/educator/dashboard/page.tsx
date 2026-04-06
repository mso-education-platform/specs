"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { buildSessionHeaders } from "@/lib/auth/client-session"
import { EducatorCohortAnalytics } from "@/components/dashboards/EducatorCohortAnalytics"
import { InterventionQueue } from "@/components/dashboards/InterventionQueue"
import { AdaptationDecisionLog } from "@/components/dashboards/AdaptationDecisionLog"
import type { EducatorDashboardResponseDto } from "@/lib/validation/dashboard"

export default function EducatorDashboardPage() {
  const [data, setData] = useState<EducatorDashboardResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
          throw new Error(payload?.error?.message ?? "Could not load educator dashboard.")
        }

        setData(payload)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load educator dashboard.")
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <h1 className="text-2xl font-semibold">Educator Supervision</h1>

      {loading ? <Card className="p-4">Loading dashboard...</Card> : null}
      {error ? <Card className="p-4 text-destructive">{error}</Card> : null}

      {!loading && !error && data ? (
        <div className="space-y-4">
          <EducatorCohortAnalytics cohortSummary={data.cohortSummary} />
          <InterventionQueue items={data.interventionQueue} />
          <AdaptationDecisionLog items={data.adaptationHistory} />
        </div>
      ) : null}
    </div>
  )
}
