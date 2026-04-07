"use client"

import { useEffect, useState } from "react"
import { buildSessionHeaders } from "@/lib/auth/client-session"

type LearningPathUnit = {
  unitId: string
  title: string
  objective: string
  sequenceIndex: number
  state: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
  projectSubmissionStatus: "NONE" | "SUBMITTED" | "REVIEWED"
  reflectionCompleted: boolean
  prerequisites: string[]
}

type LearningPathResponse = {
  learningPathId: string
  programCode: "WEB_DEV" | "AI_ORIENTED"
  version: number
  units: LearningPathUnit[]
}

type UnitProgressPatch = {
  state?: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
  projectSubmissionStatus?: "NONE" | "SUBMITTED" | "REVIEWED"
  reflectionCompleted?: boolean
}

export function useLearningPath() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<LearningPathResponse | null>(null)

  const buildHeaders = () => {
    const headers = new Headers()
    const sessionHeaders = buildSessionHeaders()
    Object.entries(sessionHeaders).forEach(([key, value]) => {
      if (value) {
        headers.set(key, String(value))
      }
    })

    headers.set("Content-Type", "application/json")
    return headers
  }

  const refresh = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/learning-path", {
        headers: buildHeaders(),
      })
      const payload = await response.json()

      if (!response.ok) {
        // Treat a missing active learning path as a normal state (no error)
        if (response.status === 404 && payload?.error?.code === "ACTIVE_PATH_NOT_FOUND") {
          setData(null)
          setError(null)
          return
        }

        throw new Error(payload?.error?.message ?? "Could not load learning path.")
      }

      setData(payload)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load learning path.")
    } finally {
      setLoading(false)
    }
  }

  const updateUnitProgress = async (unitId: string, patch: UnitProgressPatch) => {
    const response = await fetch(`/api/units/${unitId}`, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(patch),
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload?.error?.message ?? "Could not update unit progress.")
    }

    await refresh()
    return payload
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data,
    loading,
    error,
    refresh,
    updateUnitProgress,
    getUnitById: (unitId: string) => data?.units.find((unit) => unit.unitId === unitId) ?? null,
  }
}
