"use client"

import React from "react"
import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import { UserRole } from "@prisma/client"
import { CLIENT_SESSION_CHANGED_EVENT, getClientSession } from "@/lib/auth/client-session"

type AppShellProps = {
  children: React.ReactNode
  pageTitle?: string
  role?: UserRole
}

export default function AppShell({ children, pageTitle, role }: AppShellProps) {
  const [effectiveRole, setEffectiveRole] = useState<UserRole | undefined>(role)

  useEffect(() => {
    const refreshRole = () => {
      const session = getClientSession()
      setEffectiveRole((session?.role as UserRole | undefined) ?? role)
    }

    refreshRole()
    window.addEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshRole)
    window.addEventListener("storage", refreshRole)

    return () => {
      window.removeEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshRole)
      window.removeEventListener("storage", refreshRole)
    }
  }, [role])

  const showSidebar = effectiveRole === UserRole.LEARNER || effectiveRole === UserRole.EDUCATOR

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {showSidebar ? <Sidebar /> : null}
        <div className="flex-1 lg:ml-0">
          <TopBar title={pageTitle} role={effectiveRole} />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}
