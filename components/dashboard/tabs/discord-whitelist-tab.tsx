"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Shield, Plus, Trash2, Ban, Check } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface WhitelistEntry {
  id: number
  discord_id: string
  username: string
  status: string
  banned: number
  created_at: string
}

interface DiscordWhitelistTabProps {
  session: {
    owner_id: string
    secret: string
  }
  showMessage: (text: string, type: "success" | "error") => void
}

interface ConfirmDialog {
  isOpen: boolean
  title: string
  message: string
  action: (() => void) | null
  isDangerous: boolean
}

export function DiscordWhitelistTab({ session, showMessage }: DiscordWhitelistTabProps) {
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [discordId, setDiscordId] = useState("")
  const [username, setUsername] = useState("")
  const [addingUser, setAddingUser] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDangerous: false,
  })
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    loadWhitelist()
  }, [])

  const loadWhitelist = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/client/discord/whitelist?owner_id=${session.owner_id}&secret=${session.secret}`)
      const data = await response.json()
      if (data.whitelist) {
        setWhitelist(data.whitelist)
      }
    } catch (error) {
      showMessage("Error loading whitelist: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  const addUserToWhitelist = async () => {
    if (!discordId.trim()) {
      showMessage("Por favor ingresa un Discord ID", "error")
      return
    }

    setAddingUser(true)
    try {
      const response = await fetch(`${API}/client/discord/whitelist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          action_data: {
            discord_id: discordId,
            username: username || `User_${discordId}`,
          },
        }),
      })
      const data = await response.json()
      showMessage(data.message || (data.success ? "Usuario agregado" : "Error"), data.success ? "success" : "error")
      if (data.success) {
        setDiscordId("")
        setUsername("")
        loadWhitelist()
      }
    } catch (error) {
      showMessage("Error: " + error, "error")
    } finally {
      setAddingUser(false)
    }
  }

  const removeUser = (id: number, discordId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove from Whitelist",
      message: `¿Remover al usuario ${discordId} de la whitelist?`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/discord/whitelist/remove/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "Usuario removido", data.success ? "success" : "error")
          if (data.success) loadWhitelist()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const banUser = (id: number, discordId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Ban User",
      message: `¿Banear al usuario ${discordId}? No podrá acceder.`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/discord/whitelist/ban/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "Usuario baneado", data.success ? "success" : "error")
          if (data.success) loadWhitelist()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const unbanUser = async (id: number) => {
    try {
      const response = await fetch(`${API}/client/discord/whitelist/unban/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
        }),
      })
      const data = await response.json()
      showMessage(data.message || "Usuario desbaneado", data.success ? "success" : "error")
      if (data.success) loadWhitelist()
    } catch (error) {
      showMessage("Error: " + error, "error")
    }
  }

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
        onConfirm={() => confirmDialog.action?.()}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-purple-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Discord Whitelist
          </h2>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/30 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Usuario a Whitelist
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Discord ID (ej: 123456789)"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Input
                type="text"
                placeholder="Username (opcional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button
                onClick={addUserToWhitelist}
                disabled={addingUser || !discordId.trim()}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white shadow-md"
              >
                {addingUser ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </>
                )}
              </Button>
            </div>
            <p className="text-slate-400 text-sm">
              Ingresa el Discord ID del usuario que deseas autorizar para acceder a tu aplicación Discord
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden animate-scale-in backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <th className="p-4 text-left font-semibold">Discord ID</th>
                    <th className="p-4 text-left font-semibold">Username</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Agregado</th>
                    <th className="p-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelist.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-smooth animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4 text-slate-100 font-mono text-sm">{entry.discord_id}</td>
                      <td className="p-4 text-slate-100 font-medium">{entry.username}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            entry.banned
                              ? "bg-red-900/50 text-red-400 border border-red-500/30"
                              : entry.status === "active"
                                ? "bg-green-900/50 text-green-400 border border-green-500/30"
                                : "bg-yellow-900/50 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {entry.banned ? "🚫 Baneado" : entry.status === "active" ? "✓ Activo" : "⏸ Inactivo"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 space-x-2">
                        {entry.banned ? (
                          <Button
                            onClick={() => unbanUser(entry.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Unban
                          </Button>
                        ) : (
                          <Button
                            onClick={() => banUser(entry.id, entry.discord_id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Ban
                          </Button>
                        )}
                        <Button
                          onClick={() => removeUser(entry.id, entry.discord_id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {whitelist.length === 0 && (
                <p className="text-center text-slate-400 py-12 font-medium">
                  No hay usuarios en la whitelist. Agrega el primer usuario arriba.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
