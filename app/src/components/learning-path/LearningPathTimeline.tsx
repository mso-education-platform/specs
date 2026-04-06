"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLearningPath } from "@/hooks/useLearningPath"

export function LearningPathTimeline() {
  const { data, loading, error, refresh } = useLearningPath()

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Learning Track</h1>
        <Button variant="outline" onClick={() => void refresh()}>
          Refresh
        </Button>
      </div>

      {loading ? <Card className="p-4">Loading your personalized track...</Card> : null}
      {error ? <Card className="p-4 text-destructive">{error}</Card> : null}

      {data?.units.map((unit) => (
        <Card key={unit.unitId} className="p-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">{unit.sequenceIndex}. {unit.title}</p>
            <p className="text-xs text-muted-foreground">{unit.objective}</p>
            {unit.prerequisites.length > 0 ? (
              <p className="text-xs text-muted-foreground mt-1">Prerequisites: {unit.prerequisites.length}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={unit.state === "LOCKED" ? "secondary" : "default"}>{unit.state}</Badge>
            {unit.state === "LOCKED" ? (
              <Button variant="outline" size="sm" disabled>
                Open
              </Button>
            ) : (
              <Link href={`/unit/${unit.unitId}`}>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
