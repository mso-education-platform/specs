"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/I18nProvider"

type EmptyStateProps = {
  title: string
  description?: string
  ctaText?: string
  onCta?: () => void
  className?: string
}

export default function EmptyState({ title, description, ctaText, onCta, className }: EmptyStateProps) {
  const { t } = useTranslation()

  const cta = ctaText ?? t("ui.create")

  return (
    <div className={cn("grid place-items-center gap-4 text-center p-8", className)}>
      <svg className="h-24 w-24 text-muted-foreground" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && <p className="max-w-xl text-sm text-muted-foreground">{description}</p>}
      {cta && (
        <Button onClick={onCta} className="mt-2">
          {cta}
        </Button>
      )}
    </div>
  )
}
