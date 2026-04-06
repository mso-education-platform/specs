"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buildSessionHeaders } from "@/lib/auth/client-session"
import { useTranslation } from "@/components/i18n/I18nProvider"

type ParentFollowRequestFormProps = {
  onSubmitted?: () => void
}

type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
  }
}

export function ParentFollowRequestForm({ onSubmitted }: ParentFollowRequestFormProps) {
  const { t } = useTranslation()
  const [learnerEmail, setLearnerEmail] = useState("")
  const [relationshipType, setRelationshipType] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const mapApiError = (payload: ApiErrorPayload) => {
    switch (payload.error?.code) {
      case "LEARNER_NOT_FOUND":
        return t("parent_follow_request.errors.learner_not_found")
      case "PARENT_ALREADY_LINKED":
        return t("parent_follow_request.errors.already_linked")
      case "PARENT_REQUEST_ALREADY_PENDING":
        return t("parent_follow_request.errors.already_pending")
      default:
        return payload.error?.message ?? t("parent_follow_request.errors.submit_failed")
    }
  }

  const submit = async () => {
    if (!learnerEmail.trim() || !relationshipType.trim()) {
      setError(t("parent_follow_request.errors.required_fields"))
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

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

      const response = await fetch("/api/parent/follow-requests", {
        method: "POST",
        headers,
        body: JSON.stringify({
          learnerEmail: learnerEmail.trim().toLowerCase(),
          relationshipType: relationshipType.trim(),
          note: note.trim() || undefined,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(mapApiError(payload as ApiErrorPayload))
      }

      setSuccess(t("parent_follow_request.success.submitted"))
      setLearnerEmail("")
      setRelationshipType("")
      setNote("")
      onSubmitted?.()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("parent_follow_request.errors.submit_failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 space-y-3" data-testid="parent-follow-request-form">
      <div>
        <h2 className="text-lg font-semibold">{t("parent_follow_request.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("parent_follow_request.subtitle")}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="learnerEmail">{t("parent_follow_request.learner_email")}</Label>
        <Input
          id="learnerEmail"
          data-testid="learner-email-input"
          type="email"
          value={learnerEmail}
          onChange={(event) => setLearnerEmail(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationshipType">{t("parent_follow_request.relationship")}</Label>
        <Input
          id="relationshipType"
          data-testid="relationship-type-input"
          value={relationshipType}
          onChange={(event) => setRelationshipType(event.target.value)}
          placeholder={t("parent_follow_request.relationship_placeholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentNote">{t("parent_follow_request.note_optional")}</Label>
        <Input
          id="parentNote"
          data-testid="parent-note-input"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={t("parent_follow_request.note_placeholder")}
        />
      </div>

      {error ? <p className="text-sm text-destructive" data-testid="parent-follow-request-error">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600" data-testid="parent-follow-request-success">{success}</p> : null}

      <Button
        onClick={submit}
        disabled={loading || !learnerEmail.trim() || !relationshipType.trim()}
        data-testid="submit-parent-follow-request"
      >
        {loading ? t("parent_follow_request.submitting") : t("parent_follow_request.submit")}
      </Button>
    </Card>
  )
}
