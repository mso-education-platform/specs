"use client"

import { useEffect, useState } from "react"
import { useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { buildSessionHeaders, getClientSession, setClientSession } from "@/lib/auth/client-session"
import { ParentChildProgress } from "@/components/dashboards/ParentChildProgress"
import { ParentFollowRequestForm } from "@/components/dashboards/ParentFollowRequestForm"
import { useTranslation } from "@/components/i18n/I18nProvider"
import type { ParentDashboardResponseDto } from "@/lib/validation/dashboard"

type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
  }
}

export default function ParentDashboardPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [data, setData] = useState<ParentDashboardResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const hasLinkedChildren = (data?.children.length ?? 0) > 0
  const forceRequestForm = searchParams.get("request") === "1"

  const mapApiError = useCallback((payload: ApiErrorPayload) => {
    if (payload.error?.code === "PARENT_LINK_REQUIRED") {
      return t("parent_dashboard.errors.parent_link_required")
    }

    return payload.error?.message ?? t("parent_dashboard.errors.load_failed")
  }, [t])

  useEffect(() => {
    const refreshRequestFormVisibility = () => {
      setShowRequestForm(window.location.hash === "#request-link")
    }

    refreshRequestFormVisibility()
    window.addEventListener("hashchange", refreshRequestFormVisibility)

    return () => {
      window.removeEventListener("hashchange", refreshRequestFormVisibility)
    }
  }, [])

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError(null)

      try {
        const session = getClientSession()
        if (session && session.role !== "PARENT") {
          setClientSession({
            ...session,
            role: "PARENT",
          })
        }

        const headers = new Headers()
        const sessionHeaders = buildSessionHeaders()
        Object.entries(sessionHeaders).forEach(([key, value]) => {
          if (value) {
            headers.set(key, String(value))
          }
        })

        const response = await fetch("/api/dashboard/parent", { headers })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(mapApiError(payload as ApiErrorPayload))
        }

        setData(payload)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t("parent_dashboard.errors.load_failed"))
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [mapApiError, t])

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <h1 className="text-2xl font-semibold">{t("parent_dashboard.title")}</h1>

      {loading ? <Card className="p-4">{t("parent_dashboard.loading")}</Card> : null}
      {error ? <Card className="p-4 text-destructive">{error}</Card> : null}

      {!hasLinkedChildren || showRequestForm || forceRequestForm ? (
        <div id="request-link">
          <ParentFollowRequestForm onSubmitted={() => {
            void (async () => {
              const headers = new Headers()
              const sessionHeaders = buildSessionHeaders()
              Object.entries(sessionHeaders).forEach(([key, value]) => {
                if (value) {
                  headers.set(key, String(value))
                }
              })

              const response = await fetch("/api/dashboard/parent", { headers })
              const payload = await response.json()
              if (response.ok) {
                setData(payload)
              }
            })()
          }} />
        </div>
      ) : null}

      {!loading && !error && data ? <ParentChildProgress childrenProgress={data.children} /> : null}
    </div>
  )
}
