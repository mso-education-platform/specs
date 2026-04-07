"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Brain, CheckCircle2, Compass, GraduationCap, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

  const primaryHref = session ? "/dashboard" : "/sign-in"
  const primaryLabel = session ? t("home.go_dashboard") : hasCompletedOnboarding ? t("home.sign_in") : t("home.start")

  const metrics = [
    { value: t("home.metrics.value_1"), label: t("home.metrics.label_1") },
    { value: t("home.metrics.value_2"), label: t("home.metrics.label_2") },
    { value: t("home.metrics.value_3"), label: t("home.metrics.label_3") },
  ]

  const strengths = [
    { title: t("home.strengths.item_1.title"), description: t("home.strengths.item_1.description") },
    { title: t("home.strengths.item_2.title"), description: t("home.strengths.item_2.description") },
    { title: t("home.strengths.item_3.title"), description: t("home.strengths.item_3.description") },
  ]

  const steps = [
    t("home.how_it_works.step_1"),
    t("home.how_it_works.step_2"),
    t("home.how_it_works.step_3"),
    t("home.how_it_works.step_4"),
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_10%_10%,hsl(var(--accent)/0.18),transparent_60%),radial-gradient(60%_40%_at_90%_0%,hsl(var(--primary)/0.2),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Card className="border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              <Sparkles className="size-3.5" />
              {t("home.badge")}
            </Badge>

            <div className="space-y-3">
              <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{t("home.title")}</h1>
              <p className="max-w-3xl text-pretty text-base text-muted-foreground sm:text-lg">{t("home.subtitle")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href={primaryHref} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
                {primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/tracks" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                {t("home.discover_tracks")}
              </Link>
            </div>

            {session ? (
              <div className="rounded-xl border bg-muted/40 p-4">
                <p className="text-sm font-medium">{t("home.connected")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("home.connected_as")} {session.name} ({session.email})
                </p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={handleSignOut}>
                  {t("home.sign_out")}
                </Button>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <Card key={metric.label} className="border-border/70 bg-background/80 p-4">
                  <p className="text-2xl font-semibold text-primary">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((item, index) => {
            const Icon = [Brain, Compass, GraduationCap][index] ?? CheckCircle2
            return (
              <Card key={item.title} className="border-border/70 p-6">
                <Icon className="size-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/70 p-6 sm:p-7">
            <h2 className="text-xl font-semibold">{t("home.tracks.title")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("home.tracks.subtitle")}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="font-medium">{t("home.tracks.web.title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("home.tracks.web.description")}</p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="font-medium">{t("home.tracks.ai.title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("home.tracks.ai.description")}</p>
              </div>
            </div>
          </Card>

          <Card className="border-border/70 p-6 sm:p-7">
            <h2 className="text-xl font-semibold">{t("home.how_it_works.title")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("home.how_it_works.subtitle")}</p>
            <ol className="mt-5 space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground/90">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </section>

        <Card className="border-primary/30 bg-primary/[0.07] p-6 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">{t("home.final_cta.kicker")}</p>
          <h2 className="mt-2 text-2xl font-semibold">{t("home.final_cta.title")}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{t("home.final_cta.subtitle")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={primaryHref} className={cn(buttonVariants({ size: "lg" }))}>
              {primaryLabel}
            </Link>
            <Link href="/sign-up" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              {t("home.create_account")}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

