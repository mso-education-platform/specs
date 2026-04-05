"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/I18nProvider"
import { AlertTriangle } from "lucide-react"

type ErrorMessageProps = {
  message: string
  onRetry?: () => void
  className?: string
}

export default function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  const { t } = useTranslation()
  return (
    <div className={cn("flex items-center gap-4 rounded-md border border-border bg-destructive/10 p-4 text-destructive", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded bg-destructive/20 text-destructive">
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="flex-1 text-sm text-destructive">{message}</div>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry} size="sm">
          {t("ui.retry")}
        </Button>
      )}
    </div>
  )
}
