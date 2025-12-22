"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, Gift, Snowflake, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HolidayModalProps {
  username: string
}

export function HolidayModal({ username }: HolidayModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showOffers, setShowOffers] = useState(false)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("holidayModalSeen")
    if (!hasSeenModal) {
      setTimeout(() => setIsOpen(true), 500)
      localStorage.setItem("holidayModalSeen", "true")
    }
  }, [])

  if (!isOpen) return null

  const snowflakes = [...Array(6)].map((_, i) => (
    <Snowflake
      key={i}
      className="absolute text-cyan-300 opacity-30 animate-pulse"
      style={{
        width: Math.random() * 20 + 10,
        height: Math.random() * 20 + 10,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${i * 0.2}s`,
      }}
    />
  ))

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      emoji: "🎁",
      features: [
        "✅ Real-time chat system",
        "✅ Discord OAuth integration",
        "✅ Basic analytics",
        "✅ 1 team member",
        "✅ Message history (30 days)",
        "❌ Advanced analytics",
        "❌ Priority support",
        "❌ Webhooks",
      ],
      highlighted: true,
    },
    {
      name: "Premium Gold",
      price: "$10",
      period: "Per month",
      emoji: "✨",
      discount: "20% OFF",
      originalPrice: "$12.50",
      features: [
        "✅ Everything in Free",
        "✅ Advanced analytics & insights",
        "✅ Up to 10 team members",
        "✅ Discord webhook integration",
        "✅ Priority customer support",
        "✅ Unlimited message history",
        "✅ Custom branding",
        "✅ 30-day free trial",
      ],
      highlighted: false,
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={() => {
          if (showOffers) {
            setShowOffers(false)
          } else {
            setIsOpen(false)
          }
        }}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 pointer-events-auto animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Snowflakes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {snowflakes}
        </div>

        <div className="relative bg-gradient-to-br from-red-900/95 via-red-800/95 to-red-950/95 border-2 border-gold-300 rounded-3xl p-8 shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-green-400/20 to-transparent rounded-full blur-2xl" />

          {/* Close button */}
          <button
            onClick={() => {
              if (showOffers) {
                setShowOffers(false)
              } else {
                setIsOpen(false)
              }
            }}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all z-20 text-white hover:text-yellow-300"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            {!showOffers ? (
              <div className="text-center space-y-6">
                {/* Emoji Decorations */}
                <div className="flex justify-center gap-3 text-4xl animate-bounce">
                  <span style={{ animationDelay: "0s" }}>🎄</span>
                  <span style={{ animationDelay: "0.2s" }}>✨</span>
                  <span style={{ animationDelay: "0.4s" }}>🎅</span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-yellow-200 to-red-300 bg-clip-text mb-2 drop-shadow-lg">
                    ¡Feliz Navidad! 🎄
                  </h2>
                  <p className="text-red-100 font-bold text-lg">¡Bienvenido {username}!</p>
                </div>

                {/* Message */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Gift className="h-6 w-6 text-yellow-300 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <p className="text-white font-bold mb-2">Special Holiday Gifts 🎁</p>
                      <ul className="text-sm text-red-50 space-y-2">
                        <li>✨ Access to <span className="font-bold text-yellow-300">Premium Gold</span> with discount</li>
                        <li>🎯 20% bonus on all plans</li>
                        <li>🚀 Priority support during holidays</li>
                        <li>💎 Advanced analytics free for 30 days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Festive message */}
                <div className="text-sm text-yellow-100 font-semibold">
                  🎊 Enjoy our holiday offers before December 31st expires 🎊
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-lg"
                  >
                    Continue 🎉
                  </Button>
                  <Button
                    onClick={() => setShowOffers(true)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-red-950 font-bold rounded-xl transition-all shadow-lg"
                  >
                    View Offers 🎁
                  </Button>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-white/20">
                  <p className="text-xs text-red-100">
                    🎵 Enjoy the magic of the holidays with AuthGuard 🎵
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="flex justify-center gap-3 text-4xl animate-bounce mb-4">
                    <span style={{ animationDelay: "0s" }}>🎅</span>
                    <span style={{ animationDelay: "0.2s" }}>💝</span>
                    <span style={{ animationDelay: "0.4s" }}>🎄</span>
                  </div>
                  <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-yellow-200 to-green-300 bg-clip-text mb-2">
                    Christmas Offers 🎁
                  </h2>
                  <p className="text-yellow-100 text-sm font-semibold">
                    ✨ Many features are completely FREE! ✨
                  </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`relative rounded-2xl border-2 p-6 backdrop-blur-sm transition-all ${
                        plan.highlighted
                          ? "border-green-400 bg-green-500/10"
                          : "border-white/30 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {plan.discount && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-xl rounded-tr-2xl font-bold text-sm">
                          {plan.discount}
                        </div>
                      )}

                      {plan.highlighted && (
                        <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-br-xl rounded-tl-2xl font-bold text-sm">
                          ✨ Popular
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <div className="text-5xl mb-2">{plan.emoji}</div>
                        <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-black text-yellow-300">
                            {plan.price}
                          </span>
                          {plan.originalPrice && (
                            <span className="text-sm text-red-200 line-through">
                              {plan.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-red-100 mt-1">{plan.period}</p>
                      </div>

                      <div className="space-y-2 mb-6 text-sm">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-yellow-50">
                            <span className="mt-0.5 flex-shrink-0">{feature.substring(0, 2)}</span>
                            <span>{feature.substring(2)}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className={`w-full font-bold rounded-xl transition-all ${
                          plan.name === "Free"
                            ? "bg-green-600 hover:bg-green-500 text-white"
                            : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-red-950"
                        }`}
                      >
                        {plan.name === "Free" ? "Get Started Free 🚀" : "Upgrade Now 💎"}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Info box */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <p className="text-yellow-100 text-sm text-center">
                    <span className="font-bold text-yellow-300">💡 Did you know?</span> Start with all our free features today and upgrade anytime! No credit card required.
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => setShowOffers(false)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-lg py-3"
                >
                  Back to Holiday Message 🎄
                </Button>
              </div>
            )}
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent blur-sm" />
        </div>
      </div>
    </div>
  )
}
