import "./globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import AppShell from "@/components/layout/AppShell"
import { getSession } from "@/lib/auth/session"
import I18nProvider from "@/components/i18n/I18nProvider"
import frMessages from "@/i18n/messages/fr.json"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: frMessages.app.title,
  description: frMessages.app.description,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <AppShell pageTitle="app.title" role={session?.role}>
            {children}
          </AppShell>
        </I18nProvider>
      </body>
    </html>
  )
}
