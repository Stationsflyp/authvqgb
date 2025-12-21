"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { type Language, useTranslation } from "@/lib/i18n"

interface CTAProps {
  language: Language
}

export function CTA({ language }: CTAProps) {
  const { t } = useTranslation(language)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { margin: "0px 0px -100px 0px" }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-destructive/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className={`relative overflow-hidden rounded-2xl glass-effect border border-primary/30 p-12 text-center shadow-2xl hover:shadow-3xl hover:shadow-primary/40 transition-all duration-300 group ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-destructive/20 to-primary/20 animate-gradient" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-destructive/30 rounded-full blur-3xl animate-pulse-glow-red" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-balance group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-destructive group-hover:bg-clip-text transition-all duration-300">{t("cta.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto group-hover:text-muted-foreground/90 transition-all duration-300">{t("cta.description")}</p>
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: isVisible ? "0.3s" : "0s" }}>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 group transition-all duration-300 hover:scale-110"
                >
                  {t("cta.trial")}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-all" />
                </Button>
              </Link>
              <Link href="#docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-110 bg-transparent hover:shadow-lg hover:shadow-primary/20"
                >
                  {t("cta.docs")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
