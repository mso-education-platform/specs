"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UnitProgressActions } from "@/components/learning-path/UnitProgressActions"

type Unit = {
  unitId: string
  title: string
  objective: string
  sequenceIndex: number
  state: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
  projectSubmissionStatus: "NONE" | "SUBMITTED" | "REVIEWED"
  reflectionCompleted: boolean
  prerequisites: string[]
}

type UnitDetailPanelProps = {
  unit: Unit
  onUnitUpdated: (patch: {
    state?: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
    projectSubmissionStatus?: "NONE" | "SUBMITTED" | "REVIEWED"
    reflectionCompleted?: boolean
  }) => Promise<void>
}

export function UnitDetailPanel({ unit, onUnitUpdated }: UnitDetailPanelProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">{unit.sequenceIndex}. {unit.title}</h1>
          <Badge variant={unit.state === "LOCKED" ? "secondary" : "default"}>{unit.state}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{unit.objective}</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Project submission: {unit.projectSubmissionStatus}</p>
          <p>Reflection completed: {unit.reflectionCompleted ? "Yes" : "No"}</p>
          <p>Prerequisites: {unit.prerequisites.length === 0 ? "None" : unit.prerequisites.join(", ")}</p>
        </div>
      </Card>

      <UnitProgressActions
        unitId={unit.unitId}
        state={unit.state}
        projectSubmissionStatus={unit.projectSubmissionStatus}
        reflectionCompleted={unit.reflectionCompleted}
        onPatch={onUnitUpdated}
      />
    </div>
  )
}
