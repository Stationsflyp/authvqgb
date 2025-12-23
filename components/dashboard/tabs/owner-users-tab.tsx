"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Users, Plus, Trash2, Key } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface OwnerUser {
  id: number
  username: string
  display_name: string
  created_at: string
}

interface OwnerUsersTabProps {
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

export function OwnerUsersTab({ session, showMessage }: OwnerUsersTabProps) {
  const [users, setUsers] = useState<OwnerUser[]>([])
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [addingUser, setAddingUser] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDangerous: false,
  })
  const [showPasswordChange, setShowPasswordChange] = useState<number | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    loadUsers()
  }, [session.owner_id, session.secret])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/client/owner-users?owner_id=${session.owner_id}&secret=${session.secret}`)
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      showMessage("Error cargando usuarios: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    if (!username.trim() || !password.trim()) {
      showMessage("Por favor ingresa username y contraseña", "error")
      return
    }

    if (password.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres", "error")
      return
    }

    setAddingUser(true)
    try {
      const response = await fetch(`${API}/client/owner-users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          action_data: {
            username: username,
            password: password,
            display_name: displayName || username,
          },
        }),
      })
      const data = await response.json()
      showMessage(data.message || (data.success ? "Usuario creado" : "Error"), data.success ? "success" : "error")
      if (data.success) {
        setUsername("")
        setPassword("")
        setDisplayName("")
        loadUsers()
      }
    } catch (error) {
      showMessage("Error: " + error, "error")
    } finally {
      setAddingUser(false)
    }
  }

  const deleteUser = (id: number, username: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Usuario",
      message: `¿Estás seguro de que deseas eliminar al usuario "${username}"? Esta acción no se puede deshacer.`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/owner-users/delete/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "Usuario eliminado", data.success ? "success" : "error")
          if (data.success) loadUsers()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const updatePassword = async (userId: number) => {
    if (!newPassword.trim()) {
      showMessage("Por favor ingresa una nueva contraseña", "error")
      return
    }

    if (newPassword.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres", "error")
      return
    }

    setChangingPassword(true)
    try {
      const response = await fetch(`${API}/client/owner-users/update-password/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          action_data: {
            password: newPassword,
          },
        }),
      })
      const data = await response.json()
      showMessage(data.message || (data.success ? "Contraseña actualizada" : "Error"), data.success ? "success" : "error")
      if (data.success) {
        setShowPasswordChange(null)
        setNewPassword("")
      }
    } catch (error) {
      showMessage("Error: " + error, "error")
    } finally {
      setChangingPassword(false)
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
          <Users className="h-8 w-8 text-blue-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Usuarios de Aplicación
          </h2>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl border border-blue-500/30 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Usuario
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Input
                type="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Input
                type="text"
                placeholder="Nombre mostrable (opcional)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button
                onClick={createUser}
                disabled={addingUser || !username.trim() || !password.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white shadow-md"
              >
                {addingUser ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear
                  </>
                )}
              </Button>
            </div>
            <p className="text-slate-400 text-sm">
              Crea usuarios que podrán acceder a tu aplicación usando sus credenciales (username y contraseña)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden animate-scale-in backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="p-4 text-left font-semibold">Username</th>
                    <th className="p-4 text-left font-semibold">Nombre</th>
                    <th className="p-4 text-left font-semibold">Creado</th>
                    <th className="p-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-smooth animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4 text-slate-100 font-mono text-sm">{user.username}</td>
                      <td className="p-4 text-slate-100 font-medium">{user.display_name}</td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 space-x-2">
                        {showPasswordChange === user.id ? (
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              placeholder="Nueva contraseña"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="h-8 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 text-xs"
                            />
                            <Button
                              onClick={() => updatePassword(user.id)}
                              disabled={changingPassword || !newPassword.trim()}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                            >
                              {changingPassword ? <Loader2 className="h-3 w-3 animate-spin" /> : "OK"}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowPasswordChange(null)
                                setNewPassword("")
                              }}
                              className="bg-slate-600 hover:bg-slate-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              onClick={() => setShowPasswordChange(user.id)}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                            >
                              <Key className="h-3 w-3 mr-1" />
                              Contraseña
                            </Button>
                            <Button
                              onClick={() => deleteUser(user.id, user.username)}
                              className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center text-slate-400 py-12 font-medium">
                  No hay usuarios creados. Crea el primer usuario arriba.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
