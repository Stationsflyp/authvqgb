"use client"

import { useState } from "react"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Stats } from "@/components/landing/stats"
import { CTA } from "@/components/landing/cta"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/footer"
import { HolidayModal } from "@/components/dashboard/holiday-modal"
import type { Language } from "@/lib/i18n"

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en")

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <HolidayModal username="Visitante" />
      <Navigation language={language} onLanguageChange={setLanguage} />
      <Hero language={language} />
      <Stats language={language} />
      <Features language={language} />
      <CTA language={language} />
      <Footer lang={language} />
    </main>
  )
}
