"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { setClientSession } from "@/lib/auth/client-session"
import { useTranslation } from "@/components/i18n/I18nProvider"

type AuthMode = "register" | "login"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")
  const isLearnerLogin = roleParam === "learner"
  const isEducatorLogin = roleParam === "educator"
  const isParentLogin = roleParam === "parent"
  const [mode, setMode] = useState<AuthMode>("register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // Open on login mode for explicit learner/educator entry points.
    setMode(isEducatorLogin || isLearnerLogin || isParentLogin ? "login" : "register")
    setShowLoginPrompt(false)
    setError(null)
  }, [isEducatorLogin, isLearnerLogin, isParentLogin])

  const normalizeEmail = () => email.trim().toLowerCase()

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return
    }

    setLoading(true)
    setError(null)
    setShowLoginPrompt(false)

    try {
      const normalizedEmail = normalizeEmail()
      const checkResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const checkData = await checkResponse.json()
      if (!checkResponse.ok) {
        throw new Error(checkData?.error?.message ?? "Unable to verify the account email.")
      }

      if (checkData?.exists) {
        setError(t("signin.account_exists"))
        setShowLoginPrompt(true)
        return
      }

      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          role: isParentLogin ? "PARENT" : "LEARNER",
        }),
      })

      const registerData = await registerResponse.json()
      if (!registerResponse.ok) {
        throw new Error(registerData?.error?.message ?? "Could not create account.")
      }

      setClientSession(registerData)
      if (registerData.role === "PARENT") {
        router.push("/parent/dashboard")
        return
      }

      router.push("/onboarding/age-level")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not continue.")
    } finally {
      setLoading(false)
    }
  }

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

      const sessionData = isParentLogin ? { ...data, role: "PARENT" as const } : data

      setClientSession(sessionData)
      if (sessionData.role === "PARENT") {
        router.push("/parent/dashboard")
        return
      }

      if (sessionData.role === "ADMIN") {
        router.push("/educator/dashboard")
        return
      }

      if (sessionData.role === "EDUCATOR" || isEducatorLogin) {
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

  const switchToLogin = () => {
    setMode("login")
    setShowLoginPrompt(false)
    setError(null)
  }

  return (
    <Card className="mx-auto mt-10 max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{t("signin.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {isEducatorLogin ? t("signin.subtitle_educator") : t("signin.subtitle")}
      </p>

      {mode === "register" && !isEducatorLogin ? (
        <div className="space-y-2">
          <Label htmlFor="name">{t("signin.name")}</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
      ) : null}

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

      {showLoginPrompt ? (
        <Button type="button" variant="outline" className="w-full" onClick={switchToLogin}>
          {t("signin.show_login_form")}
        </Button>
      ) : null}

      <Button
        className="w-full"
        onClick={mode === "register" ? handleRegister : handleLogin}
        disabled={
          loading ||
          !email.trim() ||
          !password.trim() ||
          (mode === "register" && !name.trim())
        }
      >
        {loading
          ? t("signin.loading")
          : mode === "register"
            ? t("signin.continue")
            : t("signin.login")}
      </Button>

      {!isEducatorLogin ? (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setMode(mode === "register" ? "login" : "register")
            setShowLoginPrompt(false)
            setError(null)
          }}
        >
          {mode === "register" ? t("signin.switch_to_login") : t("signin.switch_to_register")}
        </Button>
      ) : null}
    </Card>
  )
}
