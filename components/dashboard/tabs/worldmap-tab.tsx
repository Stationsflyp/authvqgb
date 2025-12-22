"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin, Users, Globe as GlobeIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UserLocation {
  username: string
  latitude: number
  longitude: number
  country: string
  city: string
  timestamp: string
}

interface WorldMapTabProps {
  session: {
    owner_id: string
    secret: string
  }
  language: string
}

const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  "Canada": "🇨🇦",
  "Mexico": "🇲🇽",
  "Brazil": "🇧🇷",
  "Argentina": "🇦🇷",
  "Spain": "🇪🇸",
  "France": "🇫🇷",
  "Germany": "🇩🇪",
  "Italy": "🇮🇹",
  "Russia": "🇷🇺",
  "Japan": "🇯🇵",
  "China": "🇨🇳",
  "India": "🇮🇳",
  "Australia": "🇦🇺",
  "Netherlands": "🇳🇱",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "Poland": "🇵🇱",
  "South Korea": "🇰🇷",
  "Turkey": "🇹🇷",
  "Chile": "🇨🇱",
  "Colombia": "🇨🇴",
  "Peru": "🇵🇪",
  "Venezuela": "🇻🇪",
}

const getCountryFlag = (country: string): string => {
  return COUNTRY_FLAGS[country] || "🌐"
}

export function WorldMapTab({ session, language }: WorldMapTabProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [users, setUsers] = useState<UserLocation[]>([])
  const [uniqueUsers, setUniqueUsers] = useState<UserLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ countries: 0, cities: 0 })
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    loadUserLocations()
    const interval = setInterval(loadUserLocations, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadUserLocations = async () => {
    try {
      const response = await fetch(`${API}/location/users`)
      const data = await response.json()
      if (data.status === "success" && data.locations) {
        const deduped = Array.from(
          new Map(data.locations.map((u: any) => [u.username, u])).values()
        ) as UserLocation[]
        
        setUsers(deduped)
        setUniqueUsers(deduped)
        setStats({
          countries: new Set(deduped.map((u: any) => u.country)).size,
          cities: new Set(deduped.map((u: any) => u.city)).size,
        })
      }
    } catch (error) {
      console.error("Error loading user locations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!containerRef.current || users.length === 0) return

    const loadGlobe = async () => {
      try {
        const GlobeModule = await import("globe.gl")
        const Globe = GlobeModule.default as any
        const globe = new Globe(containerRef.current!, {
          rendererConfig: { antialias: true, alpha: true }
        })
        
        globe
          .globeImageUrl("https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
          .backgroundColor("rgba(15, 15, 15, 0)")
          .pointsData(users)
          .pointColor(() => "#667eea")
          .pointRadius(() => 0.8)
          .pointLat((d: any) => d.latitude)
          .pointLng((d: any) => d.longitude)
          .pointLabel((d: any) => `<strong>${d.username}</strong><br/>${getCountryFlag(d.country)} ${d.city}, ${d.country}`)
          .onPointHover((d: any) => {
            if (containerRef.current) {
              containerRef.current.style.cursor = d ? "pointer" : "auto"
            }
          })

        const width = containerRef.current?.clientWidth || 800
        const height = containerRef.current?.clientHeight || 600
        globe.width(width).height(height)

        if (globe.controls()) {
          globe.controls().autoRotate = true
          globe.controls().autoRotateSpeed = 0.8
          globe.controls().enableZoom = true
          globe.controls().enablePan = true
        }

        const handleResize = () => {
          if (!containerRef.current) return
          const w = containerRef.current.clientWidth
          const h = containerRef.current.clientHeight
          globe.width(w).height(h)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
      } catch (error) {
        console.error("Error loading Globe.gl:", error)
      }
    }

    loadGlobe()
  }, [users])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <GlobeIcon className="h-8 w-8 text-[#667eea]" />
        <h2 className="text-3xl font-bold text-[#667eea]">🌍 Mapa Mundial de Usuarios</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-600/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-400" />
            <div>
              <p className="text-sm text-blue-300">Usuarios Online</p>
              <p className="text-2xl font-bold text-blue-100">{users.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-600/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-sm text-green-300">Países</p>
              <p className="text-2xl font-bold text-green-100">{stats.countries}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-600/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏙️</span>
            <div>
              <p className="text-sm text-purple-300">Ciudades</p>
              <p className="text-2xl font-bold text-purple-100">{stats.cities}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border border-yellow-600/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏱️</span>
            <div>
              <p className="text-sm text-yellow-300">Actualización</p>
              <p className="text-sm font-bold text-yellow-100">Cada 5s</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-[#667eea]/30 bg-black shadow-2xl">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-[#667eea]" />
              <p className="text-gray-300 text-sm">Cargando globo 3D...</p>
            </div>
          </div>
        )}
        <div ref={containerRef} style={{ width: "100%", height: "600px" }} className="bg-gradient-to-b from-slate-900 to-black" />
      </div>

      <Card className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-[#667eea]/40 p-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#8b9eff] flex items-center gap-2">
            <span className="text-2xl">👥</span> Usuarios Activos
          </h3>
          <span className="px-3 py-1 bg-[#667eea]/20 border border-[#667eea]/50 rounded-full text-sm font-semibold text-[#667eea]">
            {uniqueUsers.length} online
          </span>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {uniqueUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <span className="text-4xl mb-2">🌍</span>
              <p className="text-sm">No hay usuarios en línea</p>
            </div>
          ) : (
            uniqueUsers.map((user) => (
              <div
                key={user.username}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/20 rounded-lg border border-[#667eea]/20 hover:border-[#667eea]/60 hover:shadow-lg hover:shadow-[#667eea]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#5568d3] flex items-center justify-center shadow-lg group-hover:shadow-[#667eea]/50">
                      <span className="text-lg">{getCountryFlag(user.country)}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-[#667eea] transition">{user.username}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate">{user.city}, {user.country}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap flex-shrink-0 ml-4 px-3 py-1 bg-slate-700/30 rounded-full">
                  {new Date(user.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
