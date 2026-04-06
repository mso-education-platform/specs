"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { BookOpen, Home, LogIn, Users } from "lucide-react"
import { useTranslation } from "@/components/i18n/I18nProvider"
import { CLIENT_SESSION_CHANGED_EVENT, getClientSession, type ClientSession } from "@/lib/auth/client-session"

type NavItem = { href: string; labelKey: string; icon: React.ReactNode }

const publicNav: NavItem[] = [
  { href: "/", labelKey: "nav.home", icon: <Home className="h-4 w-4" /> },
  { href: "/tracks", labelKey: "nav.track", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/sign-in", labelKey: "nav.sign_in_learner", icon: <LogIn className="h-4 w-4" /> },
  { href: "/sign-in?role=educator", labelKey: "nav.sign_in_educator", icon: <LogIn className="h-4 w-4" /> },
]

const roleDashboardHref: Record<ClientSession["role"], string> = {
  LEARNER: "/dashboard",
  EDUCATOR: "/educator/dashboard",
  PARENT: "/parent/dashboard",
  MENTOR: "/",
  ADMIN: "/educator/dashboard",
}

export default function Sidebar({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [session, setSession] = useState<ClientSession | null>(() => getClientSession())
  const nav: NavItem[] = session
    ? [
        { href: "/", labelKey: "nav.home", icon: <Home className="h-4 w-4" /> },
        { href: roleDashboardHref[session.role], labelKey: "nav.dashboard", icon: <Users className="h-4 w-4" /> },
        ...(session.role === "LEARNER"
          ? [{ href: "/track", labelKey: "nav.my_progress", icon: <BookOpen className="h-4 w-4" /> }]
          : []),
      ]
    : publicNav

  useEffect(() => {
    const refreshSession = () => setSession(getClientSession())

    window.addEventListener("storage", refreshSession)
    window.addEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshSession)

    return () => {
      window.removeEventListener("storage", refreshSession)
      window.removeEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshSession)
    }
  }, [])

  return (
    <>
      {/* Mobile: use Dialog as a sheet */}
      <div className="lg:hidden">
        <Dialog>
          <DialogTrigger>
            <div role="button" tabIndex={0} className="p-2">{t("ui.menu")}</div>
          </DialogTrigger>
          <DialogContent className="w-64">
            <nav className="flex flex-col gap-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                  {item.icon}
                  <span className="text-sm text-foreground">{t(item.labelKey)}</span>
                </Link>
              ))}
            </nav>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop: fixed sidebar */}
      <aside className={cn("hidden lg:flex lg:w-64 lg:flex-col lg:gap-4 lg:py-6 lg:px-4", className)}>
        <div className="flex items-center gap-3 px-2">
          <div className="mr-2">
            <Avatar className="h-10 w-10" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{t("app.title")}</div>
            <div className="text-xs text-muted-foreground">{t("ui.version")}</div>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1 px-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted">
              <span className="text-muted-foreground">{item.icon}</span>
              <span className="text-foreground">{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>

        {session ? (
          <div className="mt-auto px-2">
            <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">
              <Avatar className="h-8 w-8" />
              <div className="flex-1">
                <div className="text-sm text-foreground">{session.name}</div>
                <div className="text-xs text-muted-foreground">{session.email}</div>
                <div className="text-xs text-muted-foreground">{t(`topbar.role.${session.role}`)}</div>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
