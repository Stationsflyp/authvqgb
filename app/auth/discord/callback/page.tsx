"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"

function DiscordCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<{ avatar?: string; email?: string } | null>(null)
  const code = searchParams.get("code")
  const discordError = searchParams.get("error")

  useEffect(() => {
    const handleCallback = async () => {
      if (discordError) {
        console.error("Discord OAuth error:", discordError)
        setError(`Discord error: ${discordError}`)
        setLoading(false)
        setTimeout(() => router.push("/"), 3000)
        return
      }

      if (!code) {
        console.error("No authorization code received from Discord")
        setError("No authorization code received. Please try again.")
        setLoading(false)
        setTimeout(() => router.push("/"), 3000)
        return
      }

      try {
        const existingSession = localStorage.getItem("dashSession")
        let storedCredentials = null
        
        if (existingSession) {
          try {
            storedCredentials = JSON.parse(existingSession)
          } catch (e) {
            console.warn("Failed to parse existing session")
          }
        }

        const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"
        console.log("API URL:", API)
        console.log("Code:", code)
        
        const response = await fetch(`${API}/discord/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            code,
            redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI 
          }),
        })

        const data = await response.json()
        console.log("Server response:", data)

        if (data.success) {
          if (storedCredentials) {
            if (storedCredentials.owner_id !== data.owner_id ||
                storedCredentials.secret !== data.secret ||
                storedCredentials.app_name !== data.app_name) {
              setError(`❌ Discord credentials do not match your current application. Please use the same Discord account or clear your session.`)
              setLoading(false)
              setTimeout(() => router.push("/"), 3000)
              return
            }
          }

          let subscriptionTier = "free"
          let subscriptionStatus = "inactive"
          
          try {
            const subResponse = await fetch(`${API}/premium/subscription?owner_id=${data.owner_id}&secret=${data.secret}`)
            const subData = await subResponse.json()
            if (subData.success && subData.subscription) {
              subscriptionTier = subData.subscription.tier
              subscriptionStatus = subData.subscription.status
            }
          } catch (e) {
            console.warn("Failed to fetch subscription data:", e)
          }

          const sessionData = {
            owner_id: data.owner_id,
            app_name: data.app_name,
            secret: data.secret,
            avatar: data.avatar,
            email: data.email,
            is_owner: data.is_owner || false,
            subscription_tier: subscriptionTier,
            subscription_status: subscriptionStatus,
          }
          
          localStorage.setItem("dashSession", JSON.stringify(sessionData))
          localStorage.removeItem("oauth_state")
          
          setUserData({ avatar: data.avatar, email: data.email })
          setLoading(false)
          
          await new Promise(resolve => setTimeout(resolve, 3000))
          
          router.push("/dashboard")
        } else {
          setError(`Login failed: ${data.message || "Unknown error"}`)
          setLoading(false)
          setTimeout(() => router.push("/"), 3000)
        }
      } catch (error) {
        console.error("Callback error:", error)
        setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setLoading(false)
        setTimeout(() => router.push("/"), 3000)
      }
    }

    if (code) {
      handleCallback()
    }
  }, [code, discordError, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-red-500/30 p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-2xl animate-pulse"></div>
                <AlertCircle className="h-16 w-16 text-red-400 relative" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Authentication Failed</h2>
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs">Redirecting you to login in 3 seconds...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && userData) {
    const email = userData.email || ""
    const blurredEmail = email 
      ? email.split("").map((char, idx) => {
          const emailLength = email.length
          const showStart = Math.ceil(emailLength * 0.2)
          const showEnd = Math.ceil(emailLength * 0.8)
          return idx < showStart || idx >= showEnd ? "•" : char
        }).join("")
      : "••••••••••"

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-blue-500/30 p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-6">
            {userData.avatar && (
              <div className="flex justify-center">
                <img 
                  src={userData.avatar} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-blue-500/50 shadow-lg shadow-blue-500/20"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Verifying Profile</h2>
              <p className="text-slate-400 text-sm">Completing your authentication...</p>
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 space-y-2 text-sm">
                <p className="text-slate-400">
                  Email: <span className="text-slate-200 font-mono select-none">{blurredEmail}</span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
            
            <p className="text-slate-400 text-xs">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-slate-300 font-medium">Authenticating with Discord...</p>
      </div>
    </div>
  )
}

export default function DiscordCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-slate-300 font-medium">Authenticating with Discord...</p>
        </div>
      </div>
    }>
      <DiscordCallbackContent />
    </Suspense>
  )
}
