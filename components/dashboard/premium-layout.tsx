"use client"

import { useState } from "react"
import { Crown, Zap, Users, BarChart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PremiumTab } from "./tabs/premium-tab"
import { AnalyticsTab } from "./tabs/analytics-tab"
import { ManagerTab } from "./tabs/manager-tab"
import { WebhookTab } from "./tabs/webhook-tab"

type PremiumTabType = "subscription" | "analytics" | "manager" | "webhooks"

interface PremiumLayoutProps {
  session: {
    owner_id: string
    app_name: string
    secret: string
    avatar?: string
    email?: string
    subscription_tier?: string
    subscription_status?: string
  }
  onBack: () => void
  language: string
}

export function PremiumLayout({ session, onBack, language }: PremiumLayoutProps) {
  const [activeTab, setActiveTab] = useState<PremiumTabType>("subscription")

  const isPremium = session.subscription_tier === "gold" && session.subscription_status === "active"

  const premiumTabs = [
    {
      id: "subscription" as PremiumTabType,
      label: "💰 Suscripción",
      description: "Gestionar tu plan Gold Premium",
      icon: Crown,
    },
    {
      id: "analytics" as PremiumTabType,
      label: "📊 Analítica",
      description: "Ver estadísticas en tiempo real",
      icon: BarChart,
    },
    {
      id: "manager" as PremiumTabType,
      label: "👥 Equipo",
      description: "Gestionar miembros del equipo",
      icon: Users,
    },
    {
      id: "webhooks" as PremiumTabType,
      label: "⚡ Webhooks",
      description: "Configurar Discord webhooks",
      icon: Zap,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Volver al dashboard"
          >
            <ArrowLeft className="h-6 w-6 text-slate-400 hover:text-white" />
          </button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-400" />
              Gold Premium
            </h2>
            <p className="text-slate-400 text-sm mt-1">Características avanzadas para tu aplicación</p>
          </div>
        </div>
        {isPremium && (
          <div className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full text-sm font-semibold shadow-md animate-pulse-glow border border-green-500/30">
            <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Plan Activo
          </div>
        )}
      </div>

      {/* Premium Tabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {premiumTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-6 rounded-xl transition-all group ${
                activeTab === tab.id
                  ? "bg-gradient-to-br from-yellow-600/30 to-yellow-700/30 border border-yellow-500/50 shadow-lg"
                  : "bg-slate-800/50 border border-slate-700/50 hover:border-yellow-500/30 hover:bg-slate-800/70"
              }`}
            >
              <Icon className={`h-6 w-6 mb-3 ${activeTab === tab.id ? "text-yellow-400" : "text-slate-400 group-hover:text-yellow-400"}`} />
              <h3 className={`font-semibold mb-1 ${activeTab === tab.id ? "text-yellow-300" : "text-slate-300"}`}>
                {tab.label}
              </h3>
              <p className="text-xs text-slate-400">{tab.description}</p>
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-scale-in">
        {activeTab === "subscription" && <PremiumTab session={session} language={language} />}
        {activeTab === "analytics" && <AnalyticsTab session={session} isPremium={isPremium} language={language} />}
        {activeTab === "manager" && <ManagerTab session={session} isPremium={isPremium} language={language} />}
        {activeTab === "webhooks" && <WebhookTab session={session} isPremium={isPremium} language={language} />}
      </div>
    </div>
  )
}
