"use client"

import React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { UserRole } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/components/i18n/I18nProvider"
import {
  CLIENT_SESSION_CHANGED_EVENT,
  getClientSession,
  type ClientSession,
} from "@/lib/auth/client-session"

type TopBarProps = {
  title?: string
  actions?: React.ReactNode
  className?: string
  role?: UserRole
}

const roleNavigation: Record<UserRole, Array<{ href: string; labelKey: string }>> = {
  LEARNER: [
    { href: "/", labelKey: "nav.home" },
    { href: "/tracks", labelKey: "nav.track" },
  ],
  EDUCATOR: [
    { href: "/", labelKey: "nav.home" },
    { href: "/tracks", labelKey: "nav.track" },
  ],
  PARENT: [
    { href: "/", labelKey: "nav.home" },
    { href: "/tracks", labelKey: "nav.track" },
  ],
  MENTOR: [
    { href: "/", labelKey: "nav.home" },
    { href: "/tracks", labelKey: "nav.track" },
  ],
  ADMIN: [
    { href: "/", labelKey: "nav.home" },
    { href: "/tracks", labelKey: "nav.track" },
  ],
}

const publicNavigation: Array<{ href: string; labelKey: string }> = [
  { href: "/", labelKey: "nav.home" },
  { href: "/tracks", labelKey: "nav.track" },
  { href: "/sign-in", labelKey: "nav.sign_in" },
  { href: "/sign-up", labelKey: "nav.create_account" },
]

export default function TopBar({ title, actions, className, role = UserRole.LEARNER }: TopBarProps) {
  const { t } = useTranslation()
  const [session, setSession] = useState<ClientSession | null>(() => getClientSession())

  useEffect(() => {
    const refreshSession = () => setSession(getClientSession())

    window.addEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshSession)
    window.addEventListener("storage", refreshSession)

    return () => {
      window.removeEventListener(CLIENT_SESSION_CHANGED_EVENT, refreshSession)
      window.removeEventListener("storage", refreshSession)
    }
  }, [])

  const effectiveRole = session?.role ?? role
  const links = session ? roleNavigation[effectiveRole] : publicNavigation

  const displayTitle = title ? t(title) : undefined

  return (
    <header className={cn("flex items-center justify-between gap-4 border-b border-border py-3 px-4 bg-background", className)}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium text-foreground">{displayTitle}</h2>
        {session ? <Badge variant="secondary">{t(`topbar.role.${effectiveRole}`)}</Badge> : null}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSelector />
        {actions}
      </div>
    </header>
  )
}

function LanguageSelector() {
  const { locale, setLocale } = useTranslation()

  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      className="rounded border px-2 py-1 text-sm"
    >
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
    </select>
  )
}
