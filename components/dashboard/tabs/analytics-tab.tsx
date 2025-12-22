"use client"

import { useState, useEffect } from "react"
import { BarChart, Loader2, AlertCircle, Globe, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AnalyticsTabProps {
  session: {
    owner_id: string
    secret: string
  }
  isPremium: boolean
  language: string
}

interface UsageData {
  total_executions: number
  unique_devices: number
  countries: { [key: string]: number }
  recent_executions: Array<{
    exe_name: string
    hwid: string
    country: string
    timestamp: string
  }>
}

export function AnalyticsTab({ session, isPremium, language }: AnalyticsTabProps) {
  const [analytics, setAnalytics] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    if (isPremium) {
      loadAnalytics()
      const interval = setInterval(loadAnalytics, 5000)
      return () => clearInterval(interval)
    }
  }, [isPremium])

  const loadAnalytics = async () => {
    if (!isPremium) return
    try {
      const response = await fetch(
        `${API}/premium/analytics?owner_id=${session.owner_id}&secret=${session.secret}`
      )
      const data = await response.json()
      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isPremium) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <BarChart className="h-8 w-8 text-blue-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Analítica
          </h2>
        </div>

        <Card className="bg-gradient-to-br from-red-950/50 to-red-900/50 border border-red-600/50 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-300 mb-2">Característica Premium</h3>
          <p className="text-red-200 mb-4">
            Acceso a analytics en tiempo real disponible solo con Gold Premium
          </p>
          <Button className="bg-red-600 hover:bg-red-700">Actualizar a Premium</Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#667eea]" />
      </div>
    )
  }

  const topCountries = analytics
    ? Object.entries(analytics.countries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    : []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <BarChart className="h-8 w-8 text-blue-500" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Analítica en Tiempo Real
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-600/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ejecuciones Totales</p>
              <p className="text-3xl font-bold text-blue-300">{analytics?.total_executions || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-600/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Dispositivos Únicos</p>
              <p className="text-3xl font-bold text-purple-300">{analytics?.unique_devices || 0}</p>
            </div>
            <Globe className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-600/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Países</p>
              <p className="text-3xl font-bold text-green-300">
                {analytics?.countries ? Object.keys(analytics.countries).length : 0}
              </p>
            </div>
            <Globe className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-slate-200 mb-4">Países Principales</h3>
          <div className="space-y-3">
            {topCountries.length > 0 ? (
              topCountries.map(([country, count], idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-300">{country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-full"
                        style={{
                          width: `${(count / (topCountries[0]?.[1] || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-slate-400 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400">Sin datos aún</p>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-slate-200 mb-4">Ejecuciones Recientes</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analytics?.recent_executions && analytics.recent_executions.length > 0 ? (
              analytics.recent_executions.slice(0, 10).map((exec, idx) => (
                <div key={idx} className="bg-slate-900/50 p-3 rounded border border-slate-700/50 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-300 font-mono">{exec.exe_name}</span>
                    <span className="text-slate-400">{new Date(exec.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{exec.country}</span>
                    <span className="font-mono text-slate-500">{exec.hwid.slice(0, 8)}...</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400">Sin datos aún</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
