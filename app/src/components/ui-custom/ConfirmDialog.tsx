"use client"

import React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/I18nProvider"

type ConfirmDialogProps = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  trigger?: React.ReactNode
  onConfirm?: () => void
  className?: string
}

export default function ConfirmDialog({
  title = undefined,
  description,
  confirmText = undefined,
  cancelText = undefined,
  destructive = false,
  trigger,
  onConfirm,
  className,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const finalTitle = title ?? t("dialog.confirm")
  const finalConfirm = confirmText ?? t("dialog.confirm")
  const finalCancel = cancelText ?? t("dialog.cancel")
  return (
    <Dialog>
      {trigger && (
        <DialogTrigger>
          {/* Ensure the render prop is a non-<button> element so Base UI's
              `nativeButton={false}` setting is valid. Wrap the trigger inside
              a span/div if it's a Button element. */}
          <span>{trigger}</span>
        </DialogTrigger>
      )}

      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{finalTitle}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>{finalCancel}</DialogClose>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm?.()
            }}
          >
            {finalConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
