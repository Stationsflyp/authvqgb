"use client"

import { useState, useEffect } from "react"
import { Zap, AlertCircle, Check, Copy, Loader2, Eye, EyeOff, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface WebhookTabProps {
  session: {
    owner_id: string
    secret: string
  }
  isPremium: boolean
  language: string
}

interface WebhookConfig {
  discord_webhook_url: string
  enabled: boolean
  log_anticracks: boolean
  log_exe_launch: boolean
}

export function WebhookTab({ session, isPremium, language }: WebhookTabProps) {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [showUrl, setShowUrl] = useState(false)
  const [config, setConfig] = useState<WebhookConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingWebhook, setTestingWebhook] = useState(false)
  const [message, setMessage] = useState("")
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    if (isPremium) {
      loadWebhookConfig()
    }
  }, [isPremium])

  const loadWebhookConfig = async () => {
    try {
      const response = await fetch(
        `${API}/premium/webhook-config?owner_id=${session.owner_id}&secret=${session.secret}`
      )
      const data = await response.json()
      if (data.success && data.config) {
        setConfig(data.config)
        setWebhookUrl(data.config.discord_webhook_url || "")
      }
    } catch (error) {
      console.error("Error loading webhook config:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    if (!webhookUrl.trim()) {
      setMessage("URL de webhook requerida")
      return
    }

    setSaving(true)
    setMessage("")
    try {
      const response = await fetch(`${API}/premium/webhook-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          discord_webhook_url: webhookUrl,
          log_anticracks: config?.log_anticracks ?? true,
          log_exe_launch: config?.log_exe_launch ?? true,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setMessage("Configuración guardada exitosamente")
        loadWebhookConfig()
      } else {
        setMessage(data.message || "Error al guardar")
      }
    } catch (error) {
      setMessage("Error: " + error)
    } finally {
      setSaving(false)
    }
  }

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      setMessage("Ingresa una URL de webhook válida")
      return
    }

    setTestingWebhook(true)
    try {
      const response = await fetch(`${API}/premium/test-webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          discord_webhook_url: webhookUrl,
        }),
      })
      const data = await response.json()
      setMessage(data.message || (data.success ? "Webhook funcionando correctamente" : "Error en webhook"))
    } catch (error) {
      setMessage("Error al probar webhook: " + error)
    } finally {
      setTestingWebhook(false)
    }
  }

  const toggleSetting = (setting: "log_anticracks" | "log_exe_launch") => {
    if (config) {
      setConfig({ ...config, [setting]: !config[setting] })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl)
    setMessage("URL copiada al portapapeles")
  }

  if (!isPremium) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-yellow-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Webhooks Discord
          </h2>
        </div>

        <Card className="bg-gradient-to-br from-red-950/50 to-red-900/50 border border-red-600/50 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-300 mb-2">Característica Premium</h3>
          <p className="text-red-200 mb-4">
            Configuración de webhooks disponible solo con Gold Premium
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Zap className="h-8 w-8 text-yellow-500" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Webhooks Discord
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4">Configuración de Webhook</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">URL de Webhook Discord</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type={showUrl ? "text" : "password"}
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="bg-slate-950/50 border-slate-700 text-slate-200 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <Button
                onClick={() => setShowUrl(!showUrl)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
              >
                {showUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Obtén tu webhook en Discord: Configuración del servidor → Webhooks → Nuevo Webhook
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Eventos a Registrar</h4>

            <div className="space-y-2">
              <button
                onClick={() => toggleSetting("log_anticracks")}
                className={`w-full p-3 rounded border flex items-center justify-between ${
                  config?.log_anticracks
                    ? "bg-red-950/50 border-red-600/50"
                    : "bg-slate-900/50 border-slate-700/50"
                }`}
              >
                <span className={config?.log_anticracks ? "text-red-300 font-semibold" : "text-slate-300"}>
                  🔐 Intentos de Anti-Crack
                </span>
                {config?.log_anticracks ? (
                  <ToggleRight className="h-5 w-5 text-red-400" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-slate-500" />
                )}
              </button>

              <button
                onClick={() => toggleSetting("log_exe_launch")}
                className={`w-full p-3 rounded border flex items-center justify-between ${
                  config?.log_exe_launch
                    ? "bg-blue-950/50 border-blue-600/50"
                    : "bg-slate-900/50 border-slate-700/50"
                }`}
              >
                <span className={config?.log_exe_launch ? "text-blue-300 font-semibold" : "text-slate-300"}>
                  🚀 Lanzamiento de EXE
                </span>
                {config?.log_exe_launch ? (
                  <ToggleRight className="h-5 w-5 text-blue-400" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded text-sm ${
                message.includes("Error")
                  ? "bg-red-950/50 text-red-300"
                  : "bg-green-950/50 text-green-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSaveConfig}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white font-semibold py-3"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>

            <Button
              onClick={handleTestWebhook}
              disabled={testingWebhook || !webhookUrl}
              variant="outline"
              className="flex-1 border-yellow-600 text-yellow-400 hover:bg-yellow-950/50"
            >
              {testingWebhook ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Probar Webhook
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-blue-950/40 border border-blue-600/50 p-4 rounded-lg flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-300 mb-1">Información de Webhooks</h4>
          <p className="text-blue-200 text-sm">
            Los eventos se registrarán automáticamente en Discord cuando ocurran. Puedes cambiar los eventos registrados en cualquier momento.
          </p>
        </div>
      </Card>

      <Card className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-300 mb-2">Ejemplo de Mensaje</h4>
        <div className="bg-slate-950/50 p-3 rounded border border-slate-700/50 font-mono text-xs text-slate-300">
          <div>🔐 Anti-Crack Attempt Detected</div>
          <div>User: username</div>
          <div>Time: 2024-01-20 15:30:45</div>
          <div>IP: 192.168.1.1</div>
        </div>
      </Card>
    </div>
  )
}
