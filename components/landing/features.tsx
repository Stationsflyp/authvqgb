"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, BarChart3, Key, Bell, Lock, Zap, Server } from "lucide-react"
import { type Language, useTranslation } from "@/lib/i18n"

interface FeaturesProps {
  language: Language
}

export function Features({ language }: FeaturesProps) {
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
      { rootMargin: "0px 0px -100px 0px" }
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

  const features = [
    {
      icon: Shield,
      title: t("features.security"),
      description: t("features.securityDesc"),
    },
    {
      icon: Users,
      title: t("features.users"),
      description: t("features.usersDesc"),
    },
    {
      icon: BarChart3,
      title: t("features.analytics"),
      description: t("features.analyticsDesc"),
    },
    {
      icon: Key,
      title: t("features.licenses"),
      description: t("features.licensesDesc"),
    },
    {
      icon: Bell,
      title: t("features.notifications"),
      description: t("features.notificationsDesc"),
    },
    {
      icon: Lock,
      title: t("features.hwid"),
      description: t("features.hwidDesc"),
    },
    {
      icon: Zap,
      title: t("features.deploy"),
      description: t("features.deployDesc"),
    },
    {
      icon: Server,
      title: t("features.api"),
      description: t("features.apiDesc"),
    },
  ]

  return (
    <section ref={sectionRef} id="features" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute right-0 top-1/2 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className={`text-center space-y-4 mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-bold text-balance">{t("features.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              style={{ animationDelay: isVisible ? `${index * 0.15}s` : '0s' }}
              className={`glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 group hover:-translate-y-3 hover:bg-primary/5 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-destructive/20 flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/40">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
