"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { buildSessionHeaders } from "@/lib/auth/client-session"
import { useTranslation } from "@/components/i18n/I18nProvider"

type PendingRequest = {
  requestId: string
  parentUserId: string
  parentName: string
  parentEmail: string
  learnerId: string
  learnerName: string
  learnerEmail: string
  relationshipType: string
  note?: string | null
  createdAt: string
}

type AdminQueuePayload = {
  unreadNotificationsCount: number
  requests: PendingRequest[]
}

type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
  }
}

export function AdminParentFollowRequests() {
  const { t } = useTranslation()
  const [data, setData] = useState<AdminQueuePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyRequestId, setBusyRequestId] = useState<string | null>(null)

  const mapLoadError = useCallback((payload: ApiErrorPayload) => {
    if (payload.error?.code === "FORBIDDEN") {
      return t("admin_parent_follow.errors.forbidden")
    }

    return payload.error?.message ?? t("admin_parent_follow.errors.load_failed")
  }, [t])

  const mapReviewError = useCallback((payload: ApiErrorPayload) => {
    switch (payload.error?.code) {
      case "PARENT_REQUEST_NOT_FOUND":
        return t("admin_parent_follow.errors.not_found")
      case "PARENT_REQUEST_ALREADY_REVIEWED":
        return t("admin_parent_follow.errors.already_reviewed")
      default:
        return payload.error?.message ?? t("admin_parent_follow.errors.review_failed")
    }
  }, [t])

  const load = useCallback(async () => {
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

      const response = await fetch("/api/admin/parent-follow-requests", { headers })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(mapLoadError(payload as ApiErrorPayload))
      }
      setData(payload)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("admin_parent_follow.errors.load_failed"))
    } finally {
      setLoading(false)
    }
  }, [mapLoadError, t])

  useEffect(() => {
    void load()
  }, [load])

  const review = async (requestId: string, action: "APPROVE" | "REJECT") => {
    setBusyRequestId(requestId)
    setError(null)

    try {
      const headers = new Headers({
        "content-type": "application/json",
      })

      const sessionHeaders = buildSessionHeaders()
      Object.entries(sessionHeaders).forEach(([key, value]) => {
        if (value) {
          headers.set(key, String(value))
        }
      })

      const response = await fetch(`/api/admin/parent-follow-requests/${requestId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ action }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(mapReviewError(payload as ApiErrorPayload))
      }

      await load()
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : t("admin_parent_follow.errors.review_failed"))
    } finally {
      setBusyRequestId(null)
    }
  }

  return (
    <Card className="p-4 space-y-3" data-testid="admin-parent-follow-requests">
      <div>
        <h2 className="text-lg font-semibold">{t("admin_parent_follow.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("admin_parent_follow.subtitle")}</p>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">{t("admin_parent_follow.loading")}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && data ? (
        <p className="text-xs text-muted-foreground" data-testid="admin-unread-notifications">
          {t("admin_parent_follow.unread_notifications")} {data.unreadNotificationsCount}
        </p>
      ) : null}

      {!loading && data && data.requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("admin_parent_follow.empty")}</p>
      ) : null}

      {!loading && data && data.requests.length > 0 ? (
        <div className="space-y-2">
          {data.requests.map((request) => (
            <div key={request.requestId} className="rounded-md border border-border p-3 space-y-2" data-testid="admin-parent-request-item">
              <p className="font-medium">{request.parentName} → {request.learnerName}</p>
              <p className="text-xs text-muted-foreground">{t("admin_parent_follow.parent")}: {request.parentEmail}</p>
              <p className="text-xs text-muted-foreground">{t("admin_parent_follow.learner")}: {request.learnerEmail}</p>
              <p className="text-xs text-muted-foreground">{t("admin_parent_follow.relationship")}: {request.relationshipType}</p>
              {request.note ? <p className="text-xs text-muted-foreground">{t("admin_parent_follow.note")}: {request.note}</p> : null}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={busyRequestId === request.requestId}
                  onClick={() => review(request.requestId, "APPROVE")}
                  data-testid="approve-parent-request"
                >
                  {t("admin_parent_follow.approve")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busyRequestId === request.requestId}
                  onClick={() => review(request.requestId, "REJECT")}
                  data-testid="reject-parent-request"
                >
                  {t("admin_parent_follow.reject")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  )
}
