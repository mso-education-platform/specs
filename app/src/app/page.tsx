"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/components/i18n/I18nProvider"
import {
  CLIENT_SESSION_CHANGED_EVENT,
  clearClientSession,
  getClientSession,
  isClientOnboardingCompleted,
  type ClientSession,
} from "@/lib/auth/client-session"

export default function HomePage() {
  const { t } = useTranslation()
  const [session, setSession] = useState<ClientSession | null>(() => getClientSession())
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => isClientOnboardingCompleted())

  useEffect(() => {
    const refreshSessionState = () => {
      setSession(getClientSession())
      setHasCompletedOnboarding(isClientOnboardingCompleted())
    }

    window.addEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshSessionState)
    window.addEventListener("storage", refreshSessionState)

    return () => {
      window.removeEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshSessionState)
      window.removeEventListener("storage", refreshSessionState)
    }
  }, [])

  const handleSignOut = () => {
    clearClientSession()
  }

  return (
    <Card className="mx-auto mt-8 max-w-3xl p-8 space-y-4">
      <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
      <p className="text-muted-foreground">{t("home.subtitle")}</p>

      {session ? (
        <div className="rounded-md border bg-muted/40 p-4 space-y-3">
          <p className="text-sm font-medium">{t("home.connected")}</p>
          <p className="text-sm text-muted-foreground">
            {t("home.connected_as")} {session.name} ({session.email})
          </p>
          <Button variant="outline" onClick={handleSignOut}>
            {t("home.sign_out")}
          </Button>
        </div>
      ) : null}

      {!session ? (
        <Link href="/sign-in" className={cn(buttonVariants({}))}>
          {hasCompletedOnboarding ? t("home.sign_in") : t("home.start")}
        </Link>
      ) : null}

      {/* Intentionally hide onboarding-complete message on home for signed-out users. */}
    </Card>
  )
}

