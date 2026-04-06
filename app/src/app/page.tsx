"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/components/i18n/I18nProvider"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <Card className="mx-auto mt-8 max-w-3xl p-8 space-y-4">
      <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
      <p className="text-muted-foreground">{t("home.subtitle")}</p>
      <Link href="/sign-in" className={cn(buttonVariants({}))}>
        {t("home.start")}
      </Link>
    </Card>
  )
}

