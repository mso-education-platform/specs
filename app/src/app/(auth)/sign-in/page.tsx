"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { setClientSession } from "@/lib/auth/client-session"
import { useTranslation } from "@/components/i18n/I18nProvider"

export default function SignInPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { t } = useTranslation()

  const handleSignIn = () => {
    if (!name || !email) {
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    const userId = `learner-${normalizedEmail.replace(/[^a-z0-9]+/g, "-")}`

    setClientSession({
      userId,
      role: "LEARNER",
      email: normalizedEmail,
      name: name.trim(),
    })

    router.push("/onboarding/age-level")
  }

  return (
    <Card className="mx-auto mt-10 max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{t("signin.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("signin.subtitle")}</p>

      <div className="space-y-2">
        <Label htmlFor="name">{t("signin.name")}</Label>
        <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("signin.email")}</Label>
        <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>

      <Button className="w-full" onClick={handleSignIn} disabled={!name || !email}>
        {t("signin.continue")}
      </Button>
    </Card>
  )
}
