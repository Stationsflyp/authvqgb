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

export function WorldMapTab({ session, language }: WorldMapTabProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [users, setUsers] = useState<UserLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ countries: 0, cities: 0 })
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    loadUserLocations()
    const interval = setInterval(loadUserLocations, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadUserLocations = async () => {
    try {
      const response = await fetch(`${API}/location/users`)
      const data = await response.json()
      if (data.status === "success" && data.locations) {
        setUsers(data.locations)
        setStats({
          countries: new Set(data.locations.map((u: any) => u.country)).size,
          cities: new Set(data.locations.map((u: any) => u.city)).size,
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
        const GlobeMod = (await import("globe.gl")).default
        const globe = GlobeMod(containerRef.current!) as any
        
        globe
          .globeImageUrl("https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
          .backgroundColor("rgba(15, 15, 15, 0)")
          .pointsData(users)
          .pointColor(() => "#667eea")
          .pointRadius(() => 0.8)
          .pointLabel((d: any) => `<strong>${d.username}</strong><br/>📍 ${d.city}, ${d.country}`)
          .onPointHover((d: any) => {
            if (containerRef.current) {
              containerRef.current.style.cursor = d ? "pointer" : "auto"
            }
          })

        const width = containerRef.current?.clientWidth || 800
        const height = containerRef.current?.clientHeight || 600
        globe.width(width).height(height)

        if (globe.controls) {
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

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-[#667eea]/30 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🔝</span> Usuarios Activos
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No hay usuarios en línea</p>
          ) : (
            users.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-[#667eea]/20 hover:bg-slate-700/50 hover:border-[#667eea]/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-3 h-3 rounded-full bg-[#667eea] animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate group-hover:text-[#667eea] transition">{user.username}</p>
                    <p className="text-xs text-slate-400">📍 {user.city}, {user.country}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0 ml-2">{new Date(user.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
