"use client"

import { useState, useEffect } from "react"
import { Crown, Zap, Check, AlertCircle, Loader2, X, Sparkles } from "lucide-react"
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
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
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

  const handleUpgrade = () => {
    setShowComingSoonModal(true)
  }

  const features = [
    { icon: "🪝", name: "Discord Webhooks", description: "Automatic Discord logs and notifications" },
    { icon: "🔐", name: "Anti-Crack Logs", description: "Monitor cracking attempts in real-time" },
    { icon: "📊", name: "Real-time Analytics", description: "Advanced statistics and insights" },
    { icon: "🌍", name: "Geo-tracking", description: "Track execution locations worldwide" },
    { icon: "👥", name: "Team Manager", description: "Invite and manage team members" },
    { icon: "🔍", name: "Deep Analysis", description: "In-depth executable analysis" },
  ]

  const isPremium = subscription?.status === "active" && subscription?.tier === "gold"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-yellow-400 animate-bounce" />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent">
              Gold Premium
            </h2>
            <p className="text-slate-400 text-sm mt-1">Unlock advanced features for your application</p>
          </div>
        </div>

        {isPremium ? (
          <Card className="bg-gradient-to-br from-green-950/50 to-green-900/50 border border-green-500/50 p-8 shadow-lg shadow-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Check className="h-8 w-8 text-green-400" />
                <h3 className="text-2xl font-bold text-green-300">Plan Active</h3>
              </div>
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <p className="text-green-200 mb-3 text-lg">You have access to all premium features</p>
            {subscription?.expires_at && (
              <p className="text-green-300 text-sm">
                Next renewal: {new Date(subscription.expires_at).toLocaleDateString()}
              </p>
            )}
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/40 p-8 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all">
            <div className="text-center space-y-6">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mb-2">
                  $10 USD / Month
                </div>
                <p className="text-yellow-200 text-lg">Unlimited access to all premium features</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-yellow-300 text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Premium benefits included</span>
              </div>
              <Button
                onClick={handleUpgrade}
                disabled={processing}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-10 rounded-lg transition-all hover:shadow-lg hover:shadow-yellow-500/30 w-full"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="h-5 w-5 mr-2" />
                    Get Gold Premium
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
              className={`p-6 backdrop-blur-sm transition-all hover:scale-105 ${
                isPremium
                  ? "bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-600/50 shadow-lg shadow-green-500/10"
                  : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-yellow-500/30"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{feature.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-100">{feature.name}</h4>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </div>
              {isPremium && <Check className="h-5 w-5 text-green-400 mt-2" />}
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-600/50 p-6 rounded-lg flex gap-4">
          <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-300 mb-2 text-lg">Premium Information</h4>
            <p className="text-blue-200 text-sm leading-relaxed">
              All payments are processed securely through our payment system. Your subscription will auto-renew monthly. You can cancel anytime from your account settings.
            </p>
          </div>
        </Card>
      </div>

      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              </div>
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 text-center font-semibold text-lg">
                  Premium purchases coming soon
                </p>
                <p className="text-yellow-200 text-center text-sm mt-2">
                  We're preparing our secure payment system to offer you Gold Premium subscriptions
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-slate-300 font-semibold">Get ready for:</h3>
                <ul className="space-y-2">
                  {["Secure payment processing", "Instant activation", "Flexible billing", "Premium support"].map(
                    (benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-400 text-sm">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        {benefit}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <Button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
