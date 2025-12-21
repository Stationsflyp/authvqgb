"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/keyauth-layout"
import { useLanguage } from "@/lib/i18n"

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()
  const { language } = useLanguage()

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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return <DashboardLayout session={session} />
}
