"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/components/i18n/I18nProvider"
import {
  clearClientSession,
  getClientSession,
  isClientOnboardingCompleted,
  type ClientSession,
} from "@/lib/auth/client-session"

export default function HomePage() {
  const { t } = useTranslation()
  const [session, setSession] = useState<ClientSession | null>(() => getClientSession())
  const [hasCompletedOnboarding] = useState<boolean>(() => isClientOnboardingCompleted())

  const handleSignOut = () => {
    clearClientSession()
    setSession(null)
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

      {!session && !hasCompletedOnboarding ? (
        <Link href="/sign-in" className={cn(buttonVariants({}))}>
          {t("home.start")}
        </Link>
      ) : null}

      {!session && hasCompletedOnboarding ? (
        <p className="text-sm text-muted-foreground">{t("home.already_onboarded")}</p>
      ) : null}
    </Card>
  )
}

