"use client"

import { useState, useEffect } from "react"
import { Crown, Zap, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PremiumTabProps {
  session: {
    owner_id: string
    secret: string
  }
  language: string
}

interface SubscriptionData {
  tier: string
  status: string
  expires_at: string | null
  created_at: string
}

export function PremiumTab({ session, language }: PremiumTabProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    loadSubscription()
  }, [session.owner_id, session.secret])

  const loadSubscription = async () => {
    try {
      const response = await fetch(
        `${API}/premium/subscription?owner_id=${session.owner_id}&secret=${session.secret}`
      )
      const data = await response.json()
      if (data.success) {
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error("Error loading subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setProcessing(true)
    try {
      const response = await fetch(`${API}/premium/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
        }),
      })
      const data = await response.json()
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setProcessing(false)
    }
  }

  const features = [
    { icon: "🪝", name: "Webhooks Discord", description: "Logs automáticos en Discord" },
    { icon: "🔐", name: "Anti-Crack Logs", description: "Monitorea intentos de crack" },
    { icon: "📊", name: "Analytics Real-time", description: "Estadísticas en tiempo real" },
    { icon: "🌍", name: "Geo-tracking", description: "Ubicación de ejecuciones" },
    { icon: "👥", name: "Manager/Team", description: "Invita otros usuarios" },
    { icon: "🔍", name: "Deep Analysis", description: "Análisis profundo de EXE" },
  ]

  const isPremium = subscription?.status === "active" && subscription?.tier === "gold"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#667eea]" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Crown className="h-8 w-8 text-yellow-400" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Gold Premium
        </h2>
      </div>

      {isPremium ? (
        <Card className="bg-gradient-to-br from-green-950/50 to-green-900/50 border border-green-600/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Check className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-bold text-green-300">Plan Activo</h3>
          </div>
          <p className="text-green-200 mb-2">Tienes acceso a todas las características premium</p>
          {subscription?.expires_at && (
            <p className="text-green-300 text-sm">
              Próxima renovación: {new Date(subscription.expires_at).toLocaleDateString()}
            </p>
          )}
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-yellow-950/50 to-yellow-900/50 border border-yellow-600/50 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">$10 USD / Mes</h3>
            <p className="text-yellow-200 mb-4">Acceso completo a todas las características premium</p>
            <Button
              onClick={handleUpgrade}
              disabled={processing}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:opacity-90 text-white font-bold py-3 px-8"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  Obtener Gold Premium
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => (
          <Card
            key={idx}
            className={`p-6 backdrop-blur-sm transition-all ${
              isPremium
                ? "bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-600/50"
                : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
            }`}
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h4 className="font-bold text-slate-200">{feature.name}</h4>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            </div>
            {isPremium && <Check className="h-5 w-5 text-green-400 mt-2" />}
          </Card>
        ))}
      </div>

      <Card className="bg-blue-950/40 border border-blue-600/50 p-4 rounded-lg flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-300 mb-1">Información</h4>
          <p className="text-blue-200 text-sm">
            Los pagos se procesan de forma segura a través de nuestro sistema de pago. Tu suscripción se renovará automáticamente.
          </p>
        </div>
      </Card>
    </div>
  )
}
