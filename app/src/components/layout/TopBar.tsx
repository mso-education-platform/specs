"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type TopBarProps = {
  title?: string
  actions?: React.ReactNode
  className?: string
}

export default function TopBar({ title, actions, className }: TopBarProps) {
  return (
    <header className={cn("flex items-center justify-between gap-4 border-b border-border py-3 px-4 bg-background", className)}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium text-foreground">{title}</h2>
        <div className="hidden sm:flex">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  )
}
