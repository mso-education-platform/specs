"use client"

import { useEffect, useState } from "react"
import { buildSessionHeaders } from "@/lib/auth/client-session"

type LearningPathUnit = {
  unitId: string
  title: string
  sequenceIndex: number
  state: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
}

type LearningPathResponse = {
  learningPathId: string
  programCode: "WEB_DEV" | "AI_ORIENTED"
  version: number
  units: LearningPathUnit[]
}

export function useLearningPath() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<LearningPathResponse | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/learning-path", {
          headers: buildSessionHeaders(),
        })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "Could not load learning path.")
        }

        setData(payload)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load learning path.")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return { data, loading, error }
}
