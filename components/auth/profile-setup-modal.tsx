"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, User, AlertCircle, CheckCircle } from "lucide-react"

interface ProfileSetupModalProps {
  username: string
  password: string
  onComplete: (displayName: string, avatarUrl?: string) => void
  onCancel: () => void
}

export function ProfileSetupModal({ username, password, onComplete, onCancel }: ProfileSetupModalProps) {
  const [displayName, setDisplayName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      showNotification("La foto debe pesar menos de 4MB", "error")
      return
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      showNotification("Formato no permitido (JPEG, PNG, WebP, GIF)", "error")
      return
    }

    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleComplete = async () => {
    if (!displayName.trim()) {
      showNotification("Por favor ingresa un nombre para el perfil", "error")
      return
    }

    if (displayName.trim().length < 2) {
      showNotification("El nombre debe tener al menos 2 caracteres", "error")
      return
    }

    setLoading(true)

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

      const setupResponse = await fetch(`${API}/auth/setup-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          display_name: displayName.trim(),
        }),
      })

      const setupData = await setupResponse.json()

      if (!setupData.success) {
        showNotification(setupData.message || "Error al configurar perfil", "error")
        setLoading(false)
        return
      }

      let avatarUrl: string | undefined = undefined

      if (avatarFile) {
        const formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)
        formData.append("file", avatarFile)

        const uploadResponse = await fetch(`${API}/auth/upload-avatar`, {
          method: "POST",
          body: formData,
        })

        const uploadData = await uploadResponse.json()

        if (!uploadData.success) {
          showNotification(uploadData.message || "Error al subir foto", "error")
          setLoading(false)
          return
        }

        avatarUrl = uploadData.avatar_url
      }

      showNotification("Perfil completado exitosamente", "success")
      setTimeout(() => {
        onComplete(displayName.trim(), avatarUrl)
      }, 1000)
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
      setLoading(false)
    }
  }

  return (
    <>
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50 animate-fade-in ${
            notification.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{notification.text}</span>
        </div>
      )}

      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 glass-effect shadow-2xl animate-scale-in">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">Completar Perfil</CardTitle>
              <CardDescription>Configura tu perfil público antes de continuar</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Nombre para el Chat Público</label>
              <input
                type="text"
                placeholder="Tu nombre aquí"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
                maxLength={32}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50"
              />
              <p className="text-xs text-slate-400">{displayName.length}/32 caracteres</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200">Foto de Perfil (Opcional)</label>
              <div className="space-y-3">
                {avatarPreview ? (
                  <div className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-blue-500/50">
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setAvatarFile(null)
                        setAvatarPreview("")
                      }}
                      disabled={loading}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs disabled:opacity-50"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-400">Haz clic para seleccionar</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileSelect}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-400">Máximo 4MB • JPEG, PNG, WebP, GIF</p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleComplete}
                disabled={loading || !displayName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-xl transition-all duration-300 disabled:opacity-75"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Configurando...
                  </span>
                ) : (
                  "Completar Perfil"
                )}
              </Button>

              <Button
                onClick={onCancel}
                disabled={loading}
                variant="outline"
                className="w-full py-6 rounded-xl disabled:opacity-50"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
