"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

type AppShellProps = {
  children: React.ReactNode
  pageTitle?: string
}

export default function AppShell({ children, pageTitle }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-0">
          <TopBar title={pageTitle} />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}
