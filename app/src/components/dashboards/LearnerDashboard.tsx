"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLearningPath } from "@/hooks/useLearningPath"
import { useTranslation } from "@/components/i18n/I18nProvider"
import Link from "next/link"

export function LearnerDashboard() {
  const { data, loading, error } = useLearningPath()
  const { t } = useTranslation()

  const totalUnits = data?.units.length ?? 0
  const completedUnits = data?.units.filter((unit) => unit.state === "COMPLETED").length ?? 0
  const unlockedUnits = data?.units.filter((unit) => unit.state === "UNLOCKED" || unit.state === "IN_PROGRESS").length ?? 0
  const nextUnit = data?.units.find((unit) => unit.state === "UNLOCKED" || unit.state === "IN_PROGRESS")

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Completed units</p>
          <p className="text-2xl font-semibold">{completedUnits}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total units</p>
          <p className="text-2xl font-semibold">{totalUnits}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Ready now</p>
          <p className="text-2xl font-semibold">{unlockedUnits}</p>
        </Card>
      </div>

      {loading ? <Card className="p-4">{t("dashboard.loading_plan")}</Card> : null}
      {error ? <Card className="p-4 text-destructive">{error}</Card> : null}

      {!loading && !error ? (
        <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium">Continue your personalized learning track</p>
            <p className="text-xs text-muted-foreground">
              {nextUnit ? `Next suggested unit: ${nextUnit.title}` : "No unlocked unit available yet."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/track">
              <Button variant="secondary">Open track</Button>
            </Link>
            {nextUnit ? (
              <Link href={`/unit/${nextUnit.unitId}`}>
                <Button>Open next unit</Button>
              </Link>
            ) : null}
          </div>
        </Card>
      ) : null}

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
