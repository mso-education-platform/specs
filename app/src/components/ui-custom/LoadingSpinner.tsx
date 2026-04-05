"use client"

import React from "react"
import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap: Record<string, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg className={cn("animate-spin", sizeMap[size])} viewBox="0 0 24 24" fill="none" style={{ color: "var(--primary)" }} aria-hidden>
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-90" fill="currentColor" d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4z" />
      </svg>
    </div>
  )
}
