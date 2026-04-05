"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/I18nProvider"

export function AgeLevelStep() {
  const { t } = useTranslation()
  const [ageLevel, setAgeLevel] = useState<"A_8_12" | "B_13_18" | null>(null)
  const router = useRouter()

  const handleNext = () => {
    if (!ageLevel) {
      return
    }

    window.sessionStorage.setItem("onboarding-age-level", ageLevel)
    router.push("/onboarding/program")
  }

  return (
    <Card className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{t("onboarding.age.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("onboarding.age.subtitle")}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant={ageLevel === "A_8_12" ? "default" : "outline"}
          onClick={() => setAgeLevel("A_8_12")}
        >
          {t("onboarding.age.option.A_8_12")}
        </Button>
        <Button
          variant={ageLevel === "B_13_18" ? "default" : "outline"}
          onClick={() => setAgeLevel("B_13_18")}
        >
          {t("onboarding.age.option.B_13_18")}
        </Button>
      </div>

      <Button className="w-full" onClick={handleNext} disabled={!ageLevel}>
        {t("onboarding.age.continue")}
      </Button>
    </Card>
  )
}
