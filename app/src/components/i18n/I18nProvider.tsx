"use client"

import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react"
import fr from "@/i18n/messages/fr.json"
import en from "@/i18n/messages/en.json"
import ar from "@/i18n/messages/ar.json"

type TFn = (key: string, fallback?: string) => string

const messagesMap: Record<string, Record<string, unknown>> = { fr, en, ar }

type I18nContextType = {
  locale: string
  setLocale: (l: string) => void
  t: TFn
}

const I18nContext = createContext<I18nContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (k: string) => k,
})

function getMessage(obj: Record<string, unknown>, key: string) {
  return key.split(".").reduce((o: unknown, p: string) => {
    if (typeof o === "object" && o !== null && p in (o as Record<string, unknown>)) {
      return (o as Record<string, unknown>)[p]
    }
    return undefined
  }, obj)
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem("locale")
      return stored ?? "fr"
    } catch {
      return "fr"
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("locale", locale)
    } catch {
      // ignore
    }
    // set html lang and direction
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
    }
  }, [locale])

  const msgs = messagesMap[locale] ?? messagesMap.fr

  const t: TFn = useCallback((key: string, fallback?: string) => {
    const v = getMessage(msgs, key)
    return typeof v === "string" ? v : fallback ?? key
  }, [msgs])

  const setLocale = (l: string) => setLocaleState(l)

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  return useContext(I18nContext)
}
