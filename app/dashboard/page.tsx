"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/keyauth-layout"
import { HolidayModal } from "@/components/dashboard/holiday-modal"
import { useLanguage } from "@/lib/i18n"

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()
  const { language } = useLanguage()
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    const sessionData = localStorage.getItem("dashSession")
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData)
        setSession(parsed)
      } catch (e) {
        localStorage.removeItem("dashSession")
        router.push("/auth/login")
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  useEffect(() => {
    if (!session) return

    const registerLocation = async () => {
      try {
        await fetch(`${API}/location/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session.owner_id || "web_user",
            username: session.display_name || session.app_name || "Usuario",
          }),
        })
      } catch (error) {
        console.error("Error registering location:", error)
      }
    }

    const refreshSubscription = async () => {
      try {
        const response = await fetch(
          `${API}/premium/subscription?owner_id=${session.owner_id}&secret=${session.secret}`
        )
        const data = await response.json()
        if (data.success && data.subscription) {
          setSession((prev: any) => ({
            ...prev,
            subscription_tier: data.subscription.tier,
            subscription_status: data.subscription.status,
          }))
          localStorage.setItem(
            "dashSession",
            JSON.stringify({
              ...session,
              subscription_tier: data.subscription.tier,
              subscription_status: data.subscription.status,
            })
          )
        }
      } catch (error) {
        console.error("Error refreshing subscription:", error)
      }
    }

    registerLocation()
    const interval = setInterval(refreshSubscription, 30000)
    return () => clearInterval(interval)
  }, [session, API])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <HolidayModal username={session.display_name || session.app_name || "Usuario"} />
      <DashboardLayout session={session} />
    </>
  )
}
