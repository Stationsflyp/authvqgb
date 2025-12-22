"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, Gift, Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HolidayModalProps {
  username: string
}

export function HolidayModal({ username }: HolidayModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("holidayModalSeen")
    if (!hasSeenModal) {
      setTimeout(() => setIsOpen(true), 500)
      localStorage.setItem("holidayModalSeen", "true")
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 pointer-events-auto animate-scale-in">
        {/* Snowflakes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
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
          ))}
        </div>

        <div className="relative bg-gradient-to-br from-red-900/95 via-red-800/95 to-red-950/95 border-2 border-gold-300 rounded-3xl p-8 shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-green-400/20 to-transparent rounded-full blur-2xl" />

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all z-20 text-white hover:text-yellow-300"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
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
                  <p className="text-white font-bold mb-2">Regalos Especiales de Navidad 🎁</p>
                  <ul className="text-sm text-red-50 space-y-2">
                    <li>✨ Acceso a <span className="font-bold text-yellow-300">Premium Gold</span> con descuento</li>
                    <li>🎯 Bonificación de 20% en todos los planes</li>
                    <li>🚀 Soporte prioritario durante las fiestas</li>
                    <li>💎 Análisis avanzado gratis por 30 días</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Festive message */}
            <div className="text-sm text-yellow-100 font-semibold">
              🎊 Aprovecha nuestras ofertas navideñas antes de que expire el 31 de diciembre 🎊
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                Continuar 🎉
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  window.location.hash = "#premium"
                }}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-red-950 font-bold rounded-xl transition-all shadow-lg"
              >
                Ver Ofertas 🎁
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/20">
              <p className="text-xs text-red-100">
                🎵 Que disfrutes la magia de las fiestas con AuthGuard 🎵
              </p>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent blur-sm" />
        </div>
      </div>
    </div>
  )
}
