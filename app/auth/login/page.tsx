"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useState } from "react"
import type { Language } from "@/lib/i18n"
import { LanguageSelector } from "@/components/language-selector"

export default function LoginPage() {
  const [language, setLanguage] = useState<Language>("en")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/20 rounded-full blur-3xl animate-pulse-glow-red" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full animate-rotate" />
      </div>

      <div className="absolute top-6 right-6 z-50 animate-slide-right">
        <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
      </div>

      <LoginForm language={language} />
    </div>
  )
}
