"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock, Zap } from "lucide-react"
import { type Language, useTranslation } from "@/lib/i18n"

interface HeroProps {
  language: Language
}

export function Hero({ language }: HeroProps) {
  const { t } = useTranslation(language)

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/20 rounded-full blur-3xl animate-pulse-glow-red"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full" style={{ animation: "rotate-slow 30s linear infinite" }} />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-destructive/10 rounded-full"
          style={{ animation: "rotate-slow 30s linear infinite reverse" }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-scale-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/30 text-sm text-muted-foreground animate-slide-up shadow-lg shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span>{t("hero.badge")}</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-balance animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            {t("hero.title")}
            <br />
            <span className="gradient-text animate-gradient">{t("hero.subtitle")}</span>
          </h1>

          <p
            className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("hero.description")}
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <div className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-full text-white font-bold shadow-lg shadow-green-500/50 border border-green-500/30 hover:shadow-xl hover:shadow-green-500/60 hover:scale-105 transition-all duration-300">
              <span className="text-sm">{t("hero.free")}</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white font-bold shadow-lg shadow-blue-500/50 border border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-105 transition-all duration-300">
              <span className="text-sm">{t("hero.private")}</span>
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 group transition-all duration-300 hover:scale-105"
              >
                {t("hero.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105 bg-transparent"
              >
                {t("hero.viewFeatures")}
              </Button>
            </Link>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 cursor-default group hover:shadow-lg hover:shadow-primary/20">
              <Shield className="h-4 w-4 text-primary group-hover:animate-pulse" />
              <span>{t("hero.encryption")}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 cursor-default group hover:shadow-lg hover:shadow-primary/20">
              <Lock className="h-4 w-4 text-primary group-hover:animate-pulse" />
              <span>{t("hero.hwid")}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 cursor-default group hover:shadow-lg hover:shadow-primary/20">
              <Zap className="h-4 w-4 text-primary group-hover:animate-pulse" />
              <span>{t("hero.analytics")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
