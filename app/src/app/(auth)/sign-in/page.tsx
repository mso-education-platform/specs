"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { setClientSession } from "@/lib/auth/client-session"
import { useTranslation } from "@/components/i18n/I18nProvider"
import { cn } from "@/lib/utils"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams?.get("returnTo") ?? null
  const { t } = useTranslation()

  const normalizeEmail = () => email.trim().toLowerCase()

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const normalizedEmail = normalizeEmail()
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Authentication failed.")
      }

      setClientSession(data)

      if (returnTo) {
        router.push(returnTo)
        return
      }

      if (data.role === "PARENT") {
        router.push("/parent/dashboard")
        return
      }

      if (data.role === "ADMIN") {
        router.push("/educator/dashboard")
        return
      }

      if (data.role === "EDUCATOR") {
        router.push("/educator/dashboard")
        return
      }

      router.push("/onboarding/age-level")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-lg px-4 sm:px-0">
      <Card className="space-y-5 border-border/70 p-6 shadow-sm sm:p-7">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t("signin.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("signin.subtitle")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("signin.email")}</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("signin.password")}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          className="w-full"
          onClick={handleLogin}
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? t("signin.loading") : t("signin.login")}
        </Button>

        <Link href="/sign-up" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
          {t("signin.switch_to_register")}
        </Link>
      </Card>
    </div>
  )
}
