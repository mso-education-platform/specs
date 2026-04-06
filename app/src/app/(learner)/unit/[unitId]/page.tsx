"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UnitDetailPanel } from "@/components/learning-path/UnitDetailPanel"
import { useLearningPath } from "@/hooks/useLearningPath"

export default function UnitDetailPage() {
  const params = useParams<{ unitId: string }>()
  const { data, loading, error, updateUnitProgress } = useLearningPath()

  const unit = useMemo(() => data?.units.find((item) => item.unitId === params.unitId) ?? null, [data, params.unitId])

  if (loading) {
    return <Card className="mx-auto max-w-3xl p-4">Loading unit details...</Card>
  }

  if (error) {
    return <Card className="mx-auto max-w-3xl p-4 text-destructive">{error}</Card>
  }

  if (!unit) {
    return (
      <Card className="mx-auto max-w-3xl p-4 space-y-3">
        <p>Unit not found in your active learning path.</p>
        <Link href="/track">
          <Button variant="outline">Back to track</Button>
        </Link>
      </Card>
    )
  }

  return <UnitDetailPanel unit={unit} onUnitUpdated={(patch) => updateUnitProgress(unit.unitId, patch).then(() => undefined)} />
}
