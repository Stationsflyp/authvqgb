"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { type Language, useTranslation } from "@/lib/i18n"

interface NavigationProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function Navigation({ language, onLanguageChange }: NavigationProps) {
  const { t } = useTranslation(language)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 glass-effect animate-slide-down hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-destructive flex items-center justify-center group-hover:scale-125 transition-all duration-300 animate-pulse-glow group-hover:shadow-lg group-hover:shadow-primary/50">
              <Shield className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="gradient-text animate-gradient group-hover:text-primary transition-colors duration-300">AuthGuard</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 hover:scale-105"
            >
              {t("nav.features")}
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 hover:scale-105"
            >
              {t("nav.pricing")}
            </Link>
            <Link
              href="#docs"
              className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 hover:scale-105"
            >
              {t("nav.docs")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector currentLang={language} onLanguageChange={onLanguageChange} />

            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:scale-110"
              >
                {t("nav.login")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
