"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import { UserRole } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/components/i18n/I18nProvider"
// removed unused Select import

type TopBarProps = {
  title?: string
  actions?: React.ReactNode
  className?: string
  role?: UserRole
}

const roleNavigation: Record<UserRole, Array<{ href: string; labelKey: string }>> = {
  LEARNER: [
    { href: "/dashboard", labelKey: "nav.dashboard" },
    { href: "/track", labelKey: "nav.track" },
  ],
  EDUCATOR: [{ href: "/dashboard", labelKey: "nav.dashboard" }],
  PARENT: [{ href: "/dashboard", labelKey: "nav.dashboard" }],
  MENTOR: [{ href: "/dashboard", labelKey: "nav.dashboard" }],
  ADMIN: [
    { href: "/dashboard", labelKey: "nav.dashboard" },
    { href: "/dashboard", labelKey: "nav.dashboard" },
  ],
}

export default function TopBar({ title, actions, className, role = UserRole.LEARNER }: TopBarProps) {
  const { t } = useTranslation()
  const links = roleNavigation[role]

  const displayTitle = title ? t(title) : undefined

  return (
    <header className={cn("flex items-center justify-between gap-4 border-b border-border py-3 px-4 bg-background", className)}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium text-foreground">{displayTitle}</h2>
        <Badge variant="secondary">{t(`topbar.role.${role}`)}</Badge>
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:flex ml-2">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
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
