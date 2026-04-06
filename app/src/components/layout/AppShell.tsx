"use client"

import React from "react"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import { UserRole } from "@prisma/client"

type AppShellProps = {
  children: React.ReactNode
  pageTitle?: string
  role?: UserRole
}

export default function AppShell({ children, pageTitle, role }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-0">
          <TopBar title={pageTitle} role={role} />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}
