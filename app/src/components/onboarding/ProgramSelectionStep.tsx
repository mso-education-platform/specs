"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/I18nProvider"
import { buildSessionHeaders, getClientSession, setClientSession } from "@/lib/auth/client-session"

export function ProgramSelectionStep() {
  const { t } = useTranslation()
  const initialProgram = typeof window !== "undefined" ? (window.sessionStorage.getItem("onboarding-default-program") as "WEB_DEV" | "AI_ORIENTED" | null) : null
  const [programCode, setProgramCode] = useState<"WEB_DEV" | "AI_ORIENTED" | null>(initialProgram ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = async () => {
    if (!programCode) {
      return
    }

    const ageLevel = window.sessionStorage.getItem("onboarding-age-level") as "A_8_12" | "B_13_18" | null
    if (!ageLevel) {
      setError(t("onboarding.program.error.age_missing"))
      router.push("/onboarding/age-level")
      return
    }

    const cameFromTracks = typeof window !== "undefined" && !!window.sessionStorage.getItem("onboarding-default-program")

    setLoading(true)
    setError(null)

    try {
      const headers = new Headers({ "content-type": "application/json" })
      const sessionHeaders = buildSessionHeaders()
      Object.entries(sessionHeaders).forEach(([k, v]) => {
        if (v) headers.set(k, String(v))
      })

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers,
        body: JSON.stringify({ ageLevel, programCode }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Could not save onboarding choices.")
      }

      if (typeof data?.canonicalUserId === "string") {
        const currentSession = getClientSession()
        if (currentSession && currentSession.userId !== data.canonicalUserId) {
          setClientSession({
            ...currentSession,
            userId: data.canonicalUserId,
          })
        }
      }

      window.sessionStorage.setItem("program-code", programCode)
      // If user came from the tracks page to enroll, go straight to dashboard
      if (cameFromTracks) {
        try {
          window.sessionStorage.removeItem("onboarding-default-program")
        } catch {}
        router.push("/dashboard")
        return
      }

      router.push("/onboarding/assessment")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save onboarding choices.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      // clear the transient default after reading it
      window.sessionStorage.removeItem("onboarding-default-program")
    } catch {}
  }, [])

  return (
    <Card className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{t("onboarding.program.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("onboarding.program.subtitle")}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant={programCode === "WEB_DEV" ? "default" : "outline"}
          onClick={() => setProgramCode("WEB_DEV")}
        >
          {t("onboarding.program.option.WEB_DEV")}
        </Button>
        <Button
          variant={programCode === "AI_ORIENTED" ? "default" : "outline"}
          onClick={() => setProgramCode("AI_ORIENTED")}
        >
          {t("onboarding.program.option.AI_ORIENTED")}
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button className="w-full" onClick={handleContinue} disabled={!programCode || loading}>
        {loading ? t("onboarding.program.saving") : t("onboarding.program.continue_to_assessment")}
      </Button>
    </Card>
  )
}
