"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { buildSessionHeaders } from "@/lib/auth/client-session"
import { useTranslation } from "@/components/i18n/I18nProvider"

type AdminNotificationItem = {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  parentFollowRequestId: string | null
  parentName: string | null
  parentEmail: string | null
  learnerName: string | null
  learnerEmail: string | null
  requestStatus: string | null
}

type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
  }
}

function interpolate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    template,
  )
}

export default function AdminNotificationsPanel() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyActionByNotification, setBusyActionByNotification] = useState<Record<string, boolean>>({})

  const getNotificationTitle = useCallback((notification: AdminNotificationItem) => {
    if (notification.type === "PARENT_FOLLOW_REQUEST") {
      return t("admin_notifications.parent_follow.title")
    }

    return notification.title
  }, [t])

  const getNotificationMessage = useCallback((notification: AdminNotificationItem) => {
    if (notification.type === "PARENT_FOLLOW_REQUEST" && notification.learnerName) {
      return interpolate(t("admin_notifications.parent_follow.message"), {
        learnerName: notification.learnerName,
      })
    }

    return notification.message
  }, [t])

  const mapLoadError = useCallback((payload: ApiErrorPayload) => {
    if (payload.error?.code === "FORBIDDEN") {
      return t("admin_notifications.errors.forbidden")
    }

    return payload.error?.message ?? t("admin_notifications.errors.load_failed")
  }, [t])

  const mapMarkReadError = useCallback((payload: ApiErrorPayload) => {
    switch (payload.error?.code) {
      case "NOTIFICATION_NOT_FOUND":
      case "ADMIN_NOTIFICATION_NOT_FOUND":
        return t("admin_notifications.errors.not_found")
      default:
        return payload.error?.message ?? t("admin_notifications.errors.mark_read_failed")
    }
  }, [t])

  const mapReviewError = useCallback((payload: ApiErrorPayload) => {
    switch (payload.error?.code) {
      case "PARENT_REQUEST_NOT_FOUND":
        return t("admin_notifications.errors.parent_request_not_found")
      case "PARENT_REQUEST_ALREADY_REVIEWED":
        return t("admin_notifications.errors.parent_request_already_reviewed")
      default:
        return payload.error?.message ?? t("admin_notifications.errors.review_failed")
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

      const response = await fetch("/api/admin/notifications", { headers })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(mapLoadError(payload as ApiErrorPayload))
      }

      setNotifications(payload.notifications)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("admin_notifications.errors.load_failed"))
    } finally {
      setLoading(false)
    }
  }, [mapLoadError, t])

  useEffect(() => {
    void load()
  }, [load])

  const markRead = async (notificationId: string) => {
    try {
      const headers = new Headers()
      const sessionHeaders = buildSessionHeaders()
      Object.entries(sessionHeaders).forEach(([key, value]) => {
        if (value) {
          headers.set(key, String(value))
        }
      })

      const response = await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers,
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(mapMarkReadError(payload as ApiErrorPayload))
      }

      setNotifications((current) =>
        current.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)),
      )
    } catch (markError) {
      setError(markError instanceof Error ? markError.message : t("admin_notifications.errors.mark_read_failed"))
    }
  }

  const reviewParentRequestFromNotification = async (
    notification: AdminNotificationItem,
    action: "APPROVE" | "REJECT",
  ) => {
    if (!notification.parentFollowRequestId) {
      return
    }

    setBusyActionByNotification((current) => ({ ...current, [notification.id]: true }))
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

      const response = await fetch(`/api/admin/parent-follow-requests/${notification.parentFollowRequestId}`, {
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
      setError(reviewError instanceof Error ? reviewError.message : t("admin_notifications.errors.review_failed"))
    } finally {
      setBusyActionByNotification((current) => ({ ...current, [notification.id]: false }))
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin_notifications.title")}</h1>

      {loading ? <Card className="p-4">{t("admin_notifications.loading")}</Card> : null}
      {error ? <Card className="p-4 text-destructive">{error}</Card> : null}

      {!loading && notifications.length === 0 ? (
        <Card className="p-4">{t("admin_notifications.empty")}</Card>
      ) : null}

      {!loading && notifications.length > 0
        ? notifications.map((notification) => (
            <Card key={notification.id} className="p-4 space-y-2" data-testid="admin-notification-item">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{getNotificationTitle(notification)}</p>
                <span className={`text-xs ${notification.isRead ? "text-muted-foreground" : "text-amber-600"}`}>
                  {notification.isRead ? t("admin_notifications.read") : t("admin_notifications.unread")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{getNotificationMessage(notification)}</p>
              {notification.parentName && notification.learnerName ? (
                <p className="text-xs text-muted-foreground">
                  {t("admin_notifications.parent_label")} ({notification.parentEmail}) {"->"} {notification.learnerName} ({notification.learnerEmail})
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                {t("admin_notifications.created_at")}: {new Date(notification.createdAt).toLocaleString()}
              </p>
              {notification.requestStatus === "PENDING" && notification.parentFollowRequestId ? (
                <div className="flex gap-2" data-testid="notification-review-actions">
                  <Button
                    size="sm"
                    onClick={() => reviewParentRequestFromNotification(notification, "APPROVE")}
                    disabled={busyActionByNotification[notification.id]}
                    data-testid="notification-approve-request"
                  >
                    {t("admin_notifications.actions.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => reviewParentRequestFromNotification(notification, "REJECT")}
                    disabled={busyActionByNotification[notification.id]}
                    data-testid="notification-reject-request"
                  >
                    {t("admin_notifications.actions.reject")}
                  </Button>
                </div>
              ) : null}
              {!notification.isRead ? (
                <Button size="sm" onClick={() => markRead(notification.id)} data-testid="mark-notification-read">
                  {t("admin_notifications.mark_read")}
                </Button>
              ) : null}
            </Card>
          ))
        : null}
    </div>
  )
}
