"use client"

import { useState, useEffect } from "react"
import { Users, Mail, Send, Loader2, AlertCircle, Check, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ManagerTabProps {
  session: {
    owner_id: string
    secret: string
  }
  isPremium: boolean
  language: string
}

interface TeamMember {
  id: number
  invited_email: string
  username?: string
  role: string
  status: string
  created_at: string
}

type PermissionRole = "viewer" | "license_manager" | "user_manager" | "admin"

export function ManagerTab({ session, isPremium, language }: ManagerTabProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<PermissionRole>("viewer")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  const roles: { value: PermissionRole; label: string; description: string }[] = [
    { value: "viewer", label: "Visor", description: "Solo lectura de datos" },
    { value: "license_manager", label: "Gestor de Licencias", description: "Generar y gestionar licencias" },
    { value: "user_manager", label: "Gestor de Usuarios", description: "Crear y gestionar usuarios" },
    { value: "admin", label: "Admin Completo", description: "Acceso total a todas las funciones" },
  ]

  useEffect(() => {
    if (isPremium) {
      loadTeamMembers()
    }
  }, [isPremium])

  const loadTeamMembers = async () => {
    try {
      const response = await fetch(
        `${API}/premium/team?owner_id=${session.owner_id}&secret=${session.secret}`
      )
      const data = await response.json()
      if (data.success) {
        setTeamMembers(data.members || [])
      }
    } catch (error) {
      console.error("Error loading team:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!email.trim() || !email.includes("@")) {
      return
    }

    setInviting(true)
    try {
      const response = await fetch(`${API}/premium/invite-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          invited_email: email,
          role,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setEmail("")
        setRole("viewer")
        loadTeamMembers()
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    try {
      const response = await fetch(`${API}/premium/remove-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          member_id: memberId,
        }),
      })
      const data = await response.json()
      if (data.success) {
        loadTeamMembers()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (!isPremium) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Manager/Equipo
          </h2>
        </div>

        <Card className="bg-gradient-to-br from-red-950/50 to-red-900/50 border border-red-600/50 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-300 mb-2">Característica Premium</h3>
          <p className="text-red-200 mb-4">
            Gestión de equipos disponible solo con Gold Premium
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-950/50 border-red-600/50 text-red-300"
      case "user_manager":
        return "bg-purple-950/50 border-purple-600/50 text-purple-300"
      case "license_manager":
        return "bg-blue-950/50 border-blue-600/50 text-blue-300"
      default:
        return "bg-slate-950/50 border-slate-600/50 text-slate-300"
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Check className="h-4 w-4 text-green-400" />
    return <Mail className="h-4 w-4 text-yellow-400" />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-purple-500" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Manager/Equipo
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-purple-400" />
          Invitar Miembro
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
            <Input
              type="email"
              placeholder="usuario@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-950/50 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Rol</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`p-3 rounded border-2 text-left transition-all ${
                    role === r.value
                      ? "border-purple-500 bg-purple-950/50"
                      : "border-slate-700 bg-slate-900/50 hover:border-purple-500/50"
                  }`}
                >
                  <div className="font-semibold text-slate-200">{r.label}</div>
                  <div className="text-xs text-slate-400">{r.description}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleInvite}
            disabled={inviting || !email.includes("@")}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white font-semibold py-3"
          >
            {inviting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Invitando...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Enviar Invitación
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-400" />
          Miembros del Equipo ({teamMembers.length})
        </h3>

        {teamMembers.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No hay miembros invitados aún</p>
        ) : (
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded border flex items-center justify-between ${getRoleColor(member.role)}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{member.invited_email}</span>
                    {getStatusBadge(member.status)}
                  </div>
                  <div className="text-xs opacity-75">
                    {roles.find((r) => r.value === (member.role as PermissionRole))?.label || member.role}
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveMember(member.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="bg-blue-950/40 border border-blue-600/50 p-4 rounded-lg flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-300 mb-1">Permisos de Roles</h4>
          <p className="text-blue-200 text-sm">
            Los miembros invitados recibirán un email con un enlace para aceptar la invitación. Los permisos pueden ser cambiados en cualquier momento.
          </p>
        </div>
      </Card>
    </div>
  )
}
