"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { type Language, useTranslation } from "@/lib/i18n"

interface LoginFormProps {
  language: Language
}

export function LoginForm({ language }: LoginFormProps) {
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useTranslation(language)

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDiscordLogin = () => {
    if (isLoading) return
    
    setIsLoading(true)
    
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
            <Button
              onClick={handleDiscordLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                )}
                {isLoading ? "Conectando..." : t("login.button")}
              </span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Coming Soon</span>
              </div>
            </div>

            <Button
              disabled
              className="w-full bg-secondary/50 text-muted-foreground text-lg py-6 rounded-lg cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2 opacity-50">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </span>
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4 animate-fade-in">
              <Lock className="inline h-3 w-3 mr-1" />
              Private access only - No public registration
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
