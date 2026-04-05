"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/I18nProvider"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <Card className="mx-auto mt-8 max-w-3xl p-8 space-y-4">
      <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
      <p className="text-muted-foreground">{t("home.subtitle")}</p>
      <Button asChild>
        <Link href="/sign-in">{t("home.start")}</Link>
      </Button>
    </Card>
  )
}

