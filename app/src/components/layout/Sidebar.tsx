"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Home, Settings, Users } from "lucide-react"

type NavItem = { href: string; label: string; icon: React.ReactNode }

const nav: NavItem[] = [
  { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
  { href: "/dashboard", label: "Dashboard", icon: <Users className="h-4 w-4" /> },
  { href: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
]

export default function Sidebar({ className }: { className?: string }) {
  return (
    <>
      {/* Mobile: use Dialog as a sheet */}
      <div className="lg:hidden">
        <Dialog>
          <DialogTrigger>
            <div role="button" tabIndex={0} className="p-2">Menu</div>
          </DialogTrigger>
          <DialogContent className="w-64">
            <nav className="flex flex-col gap-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                  {item.icon}
                  <span className="text-sm text-foreground">{item.label}</span>
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
            <div className="font-semibold text-foreground">Learning Platform</div>
            <div className="text-xs text-muted-foreground">v0.1</div>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1 px-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted">
              <span className="text-muted-foreground">{item.icon}</span>
              <span className="text-foreground">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-2">
          <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">
            <Avatar className="h-8 w-8" />
            <div className="flex-1">
              <div className="text-sm text-foreground">User Name</div>
              <div className="text-xs text-muted-foreground">Account</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
