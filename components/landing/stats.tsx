"use client"

import { useEffect, useRef, useState } from "react"
import { type Language, useTranslation } from "@/lib/i18n"

interface StatItemProps {
  value: number
  label: string
  suffix?: string
  prefix?: string
  isVisible: boolean
}

function StatItem({ value, label, suffix = "", prefix = "", isVisible }: StatItemProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0
          const end = value
          const duration = 2000
          const increment = end / (duration / 16)

          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, isVisible])

  return (
    <div ref={ref} className={`text-center space-y-2 group cursor-default p-6 rounded-lg hover:bg-primary/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: isVisible ? '0.2s' : '0s' }}>
      <div className="text-4xl md:text-5xl font-bold gradient-text animate-gradient group-hover:scale-125 transition-all duration-300">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{label}</div>
    </div>
  )
}

interface StatsProps {
  language: Language
}

export function Stats({ language }: StatsProps) {
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

  return (
    <section ref={sectionRef} className="py-20 px-4 border-y border-border/40 glass-effect relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute right-0 top-1/2 w-64 h-64 bg-destructive/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatItem value={50000} label={t("stats.users")} suffix="+" isVisible={isVisible} />
          <StatItem value={99} label={t("stats.uptime")} suffix="%" isVisible={isVisible} />
          <StatItem value={500} label={t("stats.apps")} suffix="+" isVisible={isVisible} />
          <StatItem value={24} label={t("stats.support")} suffix="/7" isVisible={isVisible} />
        </div>
      </div>
    </section>
  )
}
