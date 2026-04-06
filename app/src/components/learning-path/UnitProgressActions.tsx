"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/components/i18n/I18nProvider"

type UnitProgressActionsProps = {
  unitId: string
  state: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
  projectSubmissionStatus: "NONE" | "SUBMITTED" | "REVIEWED"
  reflectionCompleted: boolean
  onPatch: (patch: {
    state?: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
    projectSubmissionStatus?: "NONE" | "SUBMITTED" | "REVIEWED"
    reflectionCompleted?: boolean
  }) => Promise<void>
}

export function UnitProgressActions(props: UnitProgressActionsProps) {
  const { t } = useTranslation()
  const [reflectionText, setReflectionText] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runPatch = async (patch: {
    state?: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED"
    projectSubmissionStatus?: "NONE" | "SUBMITTED" | "REVIEWED"
    reflectionCompleted?: boolean
  }) => {
    setPending(true)
    setError(null)

    try {
      await props.onPatch(patch)
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : t("learning_path.errors.update_progress"))
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">{t("learning_path.unit_progress")}</h2>
      <p className="text-sm text-muted-foreground">{t("learning_path.unit_id")}: {props.unitId}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={pending || props.state === "LOCKED" || props.state === "IN_PROGRESS"}
          onClick={() => void runPatch({ state: "IN_PROGRESS" })}
        >
          {t("learning_path.start_unit")}
        </Button>
        <Button
          disabled={pending || props.state !== "IN_PROGRESS"}
          onClick={() =>
            void runPatch({
              state: "COMPLETED",
              projectSubmissionStatus: props.projectSubmissionStatus === "NONE" ? "SUBMITTED" : props.projectSubmissionStatus,
            })
          }
        >
          {t("learning_path.complete_unit")}
        </Button>
        <Button
          variant="secondary"
          disabled={pending || props.projectSubmissionStatus !== "SUBMITTED"}
          onClick={() => void runPatch({ projectSubmissionStatus: "REVIEWED" })}
        >
          {t("learning_path.mark_reviewed")}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="reflection">
          {t("learning_path.reflection")}
        </label>
        <Input
          id="reflection"
          placeholder={t("learning_path.reflection_placeholder")}
          value={reflectionText}
          onChange={(event) => setReflectionText(event.target.value)}
        />
        <Button
          variant="outline"
          disabled={pending || reflectionText.trim().length < 5 || props.reflectionCompleted}
          onClick={() => void runPatch({ reflectionCompleted: true })}
        >
          {t("learning_path.save_reflection")}
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Card>
  )
}
