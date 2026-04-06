"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLearningPath } from "@/hooks/useLearningPath"
import { useTranslation } from "@/components/i18n/I18nProvider"

export function LearnerDashboard() {
  const { data, loading, error } = useLearningPath()
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>

      {loading ? <Card className="p-4">{t("dashboard.loading_plan")}</Card> : null}
      {error ? <Card className="p-4 text-destructive">{error}</Card> : null}

      {data?.units.map((unit) => (
        <Card key={unit.unitId} className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">{unit.sequenceIndex}. {unit.title}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.unit_id")} {unit.unitId}</p>
          </div>
          <Badge variant={unit.state === "UNLOCKED" ? "default" : "secondary"}>{unit.state}</Badge>
        </Card>
      ))}
    </div>
  )
}
