"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/i18n"

const languages = [
  { code: "en" as Language, name: "English", flag: "🇬🇧" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "ru" as Language, name: "Русский", flag: "🇷🇺" },
  { code: "hi" as Language, name: "हिन्दी", flag: "🇮🇳" },
  { code: "ar" as Language, name: "العربية", flag: "🇸🇦" },
]

interface LanguageSelectorProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-card/80 backdrop-blur-xl hover:bg-card border border-border/50 hover:border-primary/50 rounded-lg transition-all duration-300 group"
      >
        <Globe className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-sm font-medium">
          {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-up">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code)
                  setIsOpen(false)
                }}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-all duration-200 ${
                  currentLang === lang.code ? "bg-primary/20 border-l-2 border-primary" : ""
                } animate-fade-in`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-medium ${currentLang === lang.code ? "text-primary" : ""}`}>
                    {lang.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</span>
                </div>
                {currentLang === lang.code && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
