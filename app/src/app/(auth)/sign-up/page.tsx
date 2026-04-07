"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { setClientSession } from "@/lib/auth/client-session"
import { useTranslation } from "@/components/i18n/I18nProvider"
import { cn } from "@/lib/utils"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"LEARNER" | "PARENT">("LEARNER")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { t } = useTranslation()

  const normalizeEmail = () => email.trim().toLowerCase()

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return
    }

    setLoading(true)
    setError(null)

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
        return
      }

      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          role,
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

  return (
    <div className="mx-auto mt-8 w-full max-w-lg px-4 sm:px-0">
      <Card className="space-y-5 border-border/70 p-6 shadow-sm sm:p-7">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t("signin.register_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("signin.register_subtitle")}</p>
        </div>

        <div className="space-y-2">
          <Label>{t("signin.account_type")}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={role === "LEARNER" ? "default" : "outline"}
              onClick={() => setRole("LEARNER")}
            >
              {t("signin.role_learner")}
            </Button>
            <Button
              type="button"
              variant={role === "PARENT" ? "default" : "outline"}
              onClick={() => setRole("PARENT")}
            >
              {t("signin.role_parent")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">{t("signin.name")}</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
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
          onClick={handleRegister}
          disabled={loading || !name.trim() || !email.trim() || !password.trim()}
        >
          {loading ? t("signin.loading") : t("signin.continue")}
        </Button>

        <div className="mt-2 grid gap-2">
          <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>{t("signin.switch_to_login")}</Link>
          <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>{t("signin.show_login_form")}</Link>
        </div>
      </Card>
    </div>
  )
}
