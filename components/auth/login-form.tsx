"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { type Language, useTranslation } from "@/lib/i18n"
import { ProfileSetupModal } from "./profile-setup-modal"

interface LoginFormProps {
  language: Language
}

export function LoginForm({ language }: LoginFormProps) {
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDiscordLoading, setIsDiscordLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [pendingUsername, setPendingUsername] = useState("")
  const [pendingPassword, setPendingPassword] = useState("")
  const router = useRouter()
  const { t } = useTranslation(language)

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleUsernameLogin = async () => {
    if (isLoading) return
    
    if (!username.trim() || !password.trim()) {
      showNotification("Por favor ingresa usuario y contraseña", "error")
      return
    }

    setIsLoading(true)
    const startTime = Date.now()
    
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"
      const response = await fetch(`${API}/auth/username-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })

      const data = await response.json()
      const elapsedTime = Date.now() - startTime
      const minLoadTime = 800
      const delayTime = Math.max(0, minLoadTime - elapsedTime)

      if (data.success) {
        if (data.profile_completed === 0) {
          await new Promise(resolve => setTimeout(resolve, delayTime))
          setPendingUsername(username)
          setPendingPassword(password)
          setShowProfileSetup(true)
          setIsLoading(false)
        } else {
          const sessionData = {
            owner_id: data.owner_id,
            app_name: data.app_name,
            display_name: data.display_name || data.app_name,
            secret: data.secret,
            avatar: data.avatar_url || "",
            email: data.email || "",
            is_owner: data.is_owner || false,
            subscription_tier: "free",
            subscription_status: "inactive",
          }
          
          localStorage.setItem("dashSession", JSON.stringify(sessionData))
          
          showNotification("¡Acceso concedido!", "success")
          setTimeout(() => {
            router.push("/dashboard")
          }, delayTime + 1500)
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, delayTime))
        showNotification(data.message || "Error al iniciar sesión", "error")
        setIsLoading(false)
      }
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
      setIsLoading(false)
    }
  }

  const handleProfileSetupComplete = async (displayName: string, avatarUrl?: string) => {
    const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"
    
    try {
      const response = await fetch(`${API}/auth/username-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: pendingUsername,
          password: pendingPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const sessionData = {
          owner_id: data.owner_id,
          app_name: data.app_name,
          display_name: data.display_name || data.app_name,
          secret: data.secret,
          avatar: avatarUrl || data.avatar_url || "",
          email: data.email || "",
          is_owner: data.is_owner || false,
          subscription_tier: "free",
          subscription_status: "inactive",
        }
        
        localStorage.setItem("dashSession", JSON.stringify(sessionData))
        
        setShowProfileSetup(false)
        showNotification("¡Perfil completado y acceso concedido!", "success")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        showNotification(data.message || "Error al completar el perfil", "error")
      }
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    }
  }

  const handleProfileSetupCancel = () => {
    setShowProfileSetup(false)
    setPendingUsername("")
    setPendingPassword("")
    setUsername("")
    setPassword("")
  }

  const handleDiscordLogin = () => {
    if (isDiscordLoading) return
    
    setIsDiscordLoading(true)
    
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
    const scopes = "identify email"
    const state = Math.random().toString(36).substring(7)
    
    localStorage.setItem("oauth_state", state)
    
    const authUrl = new URL("https://discord.com/api/oauth2/authorize")
    authUrl.searchParams.append("client_id", clientId || "")
    authUrl.searchParams.append("redirect_uri", redirectUri || "")
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("scope", scopes)
    authUrl.searchParams.append("state", state)
    
    setTimeout(() => {
      window.location.href = authUrl.toString()
    }, 300)
  }

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: inset 0 0 0 30px rgb(30, 41, 59) !important;
          box-shadow: inset 0 0 0 30px rgb(30, 41, 59) !important;
        }
        input:-webkit-autofill {
          -webkit-text-fill-color: rgb(226, 232, 240) !important;
        }
      `}</style>
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
      <Card className="w-full max-w-md border-border/50 glass-effect animate-scale-in shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />

        <CardHeader className="text-center space-y-6 relative z-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-destructive flex items-center justify-center animate-pulse-glow relative">
            <Shield className="h-8 w-8 text-white" />
            <Lock className="h-4 w-4 text-white absolute bottom-1 right-1" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold gradient-text animate-gradient">{t("login.title")}</CardTitle>
            <CardDescription className="text-muted-foreground">{t("login.soon")}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-500/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 backdrop-blur-sm px-4 py-2 text-blue-300 rounded-lg border border-blue-500/20">Application Credentials</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed autofill:bg-slate-800 autofill:text-slate-100 autofill:shadow-[inset_0_0_0px_1000px_rgb(30,41,59)] animate-fade-in"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleUsernameLogin()}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
              style={{ animationDelay: '50ms' }}
            />

            <Button
              onClick={handleUsernameLogin}
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
                {isLoading ? t("login.verifying") : t("login.access")}
              </span>
            </Button>

            <Button
              onClick={handleDiscordLogin}
              disabled={isDiscordLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isDiscordLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                )}
                {isDiscordLoading ? "Conectando..." : t("login.button")}
              </span>
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-r from-slate-700/20 to-slate-800/20 backdrop-blur-sm px-4 py-2 text-slate-400 rounded-lg border border-slate-700/30">Coming Soon</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                disabled
                className="flex-1 bg-slate-700/30 hover:bg-slate-700/40 text-slate-400 py-6 rounded-lg cursor-not-allowed border border-slate-700/50 transition-all opacity-60"
              >
                <span className="flex flex-col items-center gap-1">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-xs">Google</span>
                </span>
              </Button>

              <Button
                disabled
                className="flex-1 bg-slate-700/30 hover:bg-slate-700/40 text-slate-400 py-6 rounded-lg cursor-not-allowed border border-slate-700/50 transition-all opacity-60"
              >
                <span className="flex flex-col items-center gap-1">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-xs">GitHub</span>
                </span>
              </Button>

              <Button
                disabled
                className="flex-1 bg-slate-700/30 hover:bg-slate-700/40 text-slate-400 py-6 rounded-lg cursor-not-allowed border border-slate-700/50 transition-all opacity-60"
              >
                <span className="flex flex-col items-center gap-1">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span className="text-xs">Email</span>
                </span>
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4 animate-fade-in">
              <Lock className="inline h-3 w-3 mr-1" />
              Private access only - No public registration
            </p>
          </div>
        </CardContent>
      </Card>

      {showProfileSetup && (
        <ProfileSetupModal
          username={pendingUsername}
          password={pendingPassword}
          onComplete={handleProfileSetupComplete}
          onCancel={handleProfileSetupCancel}
        />
      )}
    </>
  )
}
