"use client"

import React from "react"
import { cn } from "@/lib/utils"
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
  title = "Confirm",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  trigger,
  onConfirm,
  className,
}: ConfirmDialogProps) {
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
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>{cancelText}</DialogClose>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm?.()
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
